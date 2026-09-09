import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'

import {
    createOrthographyProfile,
    createPaperConfiguration,
} from '../../braille/public'
import Keyboard from '../../components/Keyboard'
import { Cell, cellToString } from '../../domain/Cell'
import { Key } from '../../domain/Key'
import { useAudioContext } from '../../providers/AudioProvider'
import {
    applySessionInput,
    createTypingSession,
    getTypingSessionSnapshot,
    mapWebKeyboardEvent,
    type SessionInput,
    type TypingSessionState,
} from '../../session/public'

const keyboardSource = 'web-keyboard'

const createFreeSession = () =>
    createTypingSession({
        paper: createPaperConfiguration({
            type: 'continuous',
            columns: 40,
        }),
        profile: createOrthographyProfile('portuguese-braille-2018'),
        effectiveConfiguration: { interruptionPolicy: 'discard' },
    })

const applyInputs = (
    state: TypingSessionState,
    inputs: readonly SessionInput[],
) =>
    inputs.reduce(
        (current, input) => applySessionInput(current, input).state,
        state,
    )

const initialKeyStatus = {
    [Key.DOT1]: false,
    [Key.DOT2]: false,
    [Key.DOT3]: false,
    [Key.DOT4]: false,
    [Key.DOT5]: false,
    [Key.DOT6]: false,
    [Key.SPACE]: false,
    [Key.ENTER]: false,
    [Key.BACKSPACE]: false,
}

const visualKeyByCode = new Map<string, keyof typeof initialKeyStatus>([
    ['KeyF', Key.DOT1],
    ['KeyD', Key.DOT2],
    ['KeyS', Key.DOT3],
    ['KeyJ', Key.DOT4],
    ['KeyK', Key.DOT5],
    ['KeyL', Key.DOT6],
    ['Space', Key.SPACE],
    ['KeyQ', Key.ENTER],
    ['Backspace', Key.BACKSPACE],
])

const reviewDirectionByCode: ReadonlyMap<
    string,
    'up' | 'right' | 'down' | 'left'
> = new Map([
    ['ArrowUp', 'up'],
    ['ArrowRight', 'right'],
    ['ArrowDown', 'down'],
    ['ArrowLeft', 'left'],
])

const legacyText = (state: TypingSessionState) => {
    const snapshot = getTypingSessionSnapshot(state)
    const rows: string[][] = []
    const paper = snapshot.document.paper
    const absoluteRow = (sheet: number, row: number) =>
        paper.type === 'sheet' ? sheet * paper.rows + row : row

    snapshot.document.grids.forEach((grid, sheet) => {
        grid.impressions.forEach(({ position, impression }) => {
            const row = absoluteRow(sheet, position.row)
            const cells = rows[row] ?? []
            const cellName = `C${impression.cell.dots.join('') || '0'}`
            const legacyCell = (Cell as unknown as Record<string, Cell>)[
                cellName
            ]
            cells[position.column - paper.margins.left] =
                cellToString(legacyCell)
            rows[row] = cells
        })
    })
    const editingRow = absoluteRow(
        snapshot.document.editingPosition.sheet,
        snapshot.document.editingPosition.row,
    )
    while (rows.length <= editingRow) rows.push([])
    return rows.map((cells) => cells.join('')).join('\n')
}

/** Temporary legacy-presentation callbacks for the modern free typing session. */
export type FreeTypingSessionProps = Readonly<{
    onInstructionsRequested: () => void
}>

export default function FreeTypingSession({
    onInstructionsRequested,
}: FreeTypingSessionProps) {
    const [session, setSession] = useState(createFreeSession)
    const [showBraille, setShowBraille] = useState(true)
    const [, setOutputMuted] = useState(false)
    const [keyboardMuted, setKeyboardMuted] = useState(false)
    const [keyStatus, setKeyStatus] = useState(initialKeyStatus)
    const {
        playKeyPress,
        playKeyboardMuted,
        playKeyboardUnmuted,
        playOutputMuted,
        playOutputUnmuted,
        playBrailleViewAudio,
        playInkViewAudio,
    } = useAudioContext()

    const output = useMemo(() => legacyText(session), [session])

    const dispatch = useCallback(
        (input: SessionInput) =>
            setSession((current) => applySessionInput(current, input).state),
        [],
    )

    const interrupt = useCallback(
        (cause: 'focus-loss' | 'page-hidden' | 'pause') =>
            dispatch({ type: 'interrupt-capture', cause }),
        [dispatch],
    )

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') interrupt('page-hidden')
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () =>
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            )
    }, [interrupt])

    const handleFocus = () =>
        dispatch({ type: 'activate-capture', source: keyboardSource })

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            interrupt('focus-loss')
        }
    }

    const handlePresentationKey = (event: KeyboardEvent<HTMLElement>) => {
        if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) {
            return false
        }
        if (event.code === 'KeyI') {
            event.preventDefault()
            onInstructionsRequested()
            return true
        }
        if (event.code === 'KeyT') {
            event.preventDefault()
            setShowBraille((current) => {
                current ? playInkViewAudio() : playBrailleViewAudio()
                return !current
            })
            return true
        }
        if (event.code === 'KeyO') {
            event.preventDefault()
            setOutputMuted((current) => {
                current ? playOutputUnmuted() : playOutputMuted()
                return !current
            })
            return true
        }
        if (event.code === 'KeyM') {
            event.preventDefault()
            setKeyboardMuted((current) => {
                current ? playKeyboardUnmuted() : playKeyboardMuted()
                return !current
            })
            return true
        }
        const reviewDirection = reviewDirectionByCode.get(event.code)
        if (reviewDirection !== undefined) {
            event.preventDefault()
            dispatch({ type: 'move-review', direction: reviewDirection })
            return true
        }
        return false
    }

    const handleKeyboardEvent = (
        event: KeyboardEvent<HTMLElement>,
        type: 'press' | 'release',
    ) => {
        if (type === 'press' && handlePresentationKey(event)) return

        const mapping = mapWebKeyboardEvent(event, type)
        if (!mapping.handled) return
        event.preventDefault()

        const visualKey = visualKeyByCode.get(event.code)
        if (visualKey !== undefined) {
            setKeyStatus((current) => ({
                ...current,
                [visualKey]: type === 'press',
            }))
        }
        if (type === 'press' && !event.repeat && !keyboardMuted) playKeyPress()

        setSession((current) =>
            applyInputs(
                current,
                mapping.intents.map((intent) => ({
                    type: 'machine-intent',
                    source: keyboardSource,
                    intent,
                })),
            ),
        )
    }

    return (
        <div
            id="typewriter"
            className="container d-flex flex-column justify-content-center align-items-center"
            role="region"
            aria-label="Área de digitação Braille"
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(event) => handleKeyboardEvent(event, 'press')}
            onKeyUp={(event) => handleKeyboardEvent(event, 'release')}
        >
            <div className="fs-1">MODO LIVRE</div>
            <div role="status" aria-live="polite">
                {session.capture.status === 'active'
                    ? 'Captura ativa'
                    : 'Captura inativa'}{' '}
                — revisão: linha {session.document.reviewPosition.row + 1},
                coluna {session.document.reviewPosition.column + 1}
            </div>
            <div className="d-flex justify-content-center w-100 fs-5 gap-3 mb-3">
                <div>
                    <strong>(i)</strong> Instruções
                </div>
                <div>
                    <strong>(t)</strong> Ver texto a tinta ou em Braille
                </div>
                <div>
                    <strong>(o)</strong> Liga/desliga áudio do conversor
                </div>
                <div>
                    <strong>(m)</strong> Liga/desliga áudio do teclado
                </div>
            </div>
            <textarea
                aria-label="Saída de Celas Braille digitadas"
                className={`form-control p-5 mb-3 ${showBraille ? 'braille' : ''}`}
                readOnly
                rows={3}
                value={output}
                spellCheck={false}
                tabIndex={-1}
                style={{
                    height: '400px',
                    letterSpacing: '15px',
                    fontSize: '4rem',
                    textWrap: 'wrap',
                    overflowY: 'scroll',
                    overflow: 'hidden',
                }}
            />
            <Keyboard keyStatus={keyStatus} />
        </div>
    )
}
