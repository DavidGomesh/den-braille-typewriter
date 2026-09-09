import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'

import type { MachineControl } from '../../braille/public'
import Keyboard from '../../components/Keyboard'
import { Cell, cellToString } from '../../domain/Cell'
import { Key } from '../../domain/Key'
import {
    mapWebKeyboardEvent,
    type SessionInput,
    type TypingSessionSnapshot,
} from '../../session/public'
import {
    legacyFreeModeActionForKey,
    type LegacyFreeModeAction,
} from './legacyFreeModeKeyboard'

const keyboardSource = 'web-keyboard'

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

const visualKeyForControl = (
    control: MachineControl,
): keyof typeof initialKeyStatus => {
    if (control.type === 'dot') {
        const dotKeys: ReadonlyArray<keyof typeof initialKeyStatus> = [
            Key.DOT1,
            Key.DOT2,
            Key.DOT3,
            Key.DOT4,
            Key.DOT5,
            Key.DOT6,
        ]
        return dotKeys[control.dot - 1]
    }
    if (control.type === 'space') return Key.SPACE
    if (control.type === 'backspace') return Key.BACKSPACE
    return Key.ENTER
}

const legacyText = (snapshot: TypingSessionSnapshot) => {
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
    snapshot: TypingSessionSnapshot
    dispatch: (input: SessionInput) => void
    onPresentationAction: (action: LegacyFreeModeAction) => void
    onMachineKeyPressed: () => void
}>

export default function FreeTypingSession({
    snapshot,
    dispatch,
    onPresentationAction,
    onMachineKeyPressed,
}: FreeTypingSessionProps) {
    const [showBraille, setShowBraille] = useState(true)
    const [, setOutputMuted] = useState(false)
    const [keyboardMuted, setKeyboardMuted] = useState(false)
    const [keyStatus, setKeyStatus] = useState(initialKeyStatus)

    const output = useMemo(() => legacyText(snapshot), [snapshot])

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

    useEffect(() => {
        if (snapshot.capture.status === 'inactive') {
            setKeyStatus(initialKeyStatus)
        }
    }, [snapshot.capture.status])

    const handleFocus = () => dispatch({ type: 'activate-capture' })

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            interrupt('focus-loss')
        }
    }

    const handlePresentationKey = (event: KeyboardEvent<HTMLElement>) => {
        const action = legacyFreeModeActionForKey(event)
        if (action === undefined) return false
        event.preventDefault()
        if (action === 'view-toggled') setShowBraille((current) => !current)
        if (action === 'output-audio-toggled')
            setOutputMuted((current) => !current)
        if (action === 'keyboard-audio-toggled')
            setKeyboardMuted((current) => !current)
        onPresentationAction(action)
        return true
    }

    const handleKeyboardEvent = (
        event: KeyboardEvent<HTMLElement>,
        type: 'press' | 'release',
    ) => {
        if (type === 'press' && handlePresentationKey(event)) return

        const mapping = mapWebKeyboardEvent(event, type)
        if (!mapping.handled) return
        event.preventDefault()

        if (mapping.control !== undefined) {
            const visualKey = visualKeyForControl(mapping.control)
            setKeyStatus((current) => ({
                ...current,
                [visualKey]: type === 'press',
            }))
        }
        if (type === 'press' && !event.repeat && !keyboardMuted)
            onMachineKeyPressed()

        if (mapping.command?.type === 'move-review') {
            dispatch(mapping.command)
        } else if (mapping.command?.type === 'toggle-capture') {
            snapshot.capture.status === 'active'
                ? interrupt('pause')
                : dispatch({ type: 'activate-capture' })
        }
        mapping.intents.forEach((intent) =>
            dispatch({
                type: 'machine-intent',
                source: keyboardSource,
                intent,
            }),
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
                {snapshot.capture.status === 'active'
                    ? 'Captura ativa'
                    : 'Captura inativa'}{' '}
                — revisão: linha {snapshot.document.reviewPosition.row + 1},
                coluna {snapshot.document.reviewPosition.column + 1}
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
                <div>
                    <strong>(Esc)</strong> Pausa/retoma a captura
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
