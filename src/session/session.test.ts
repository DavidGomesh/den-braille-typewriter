import { describe, expect, test } from 'vitest'

import {
    createBrailleDot,
    createOrthographyProfile,
    createPaperConfiguration,
    getDocumentCellImpression,
} from '../braille/public'
import {
    applySessionInput,
    createTypingSession,
    type TypingSessionState,
} from './public'

const createSession = () =>
    createTypingSession({
        paper: createPaperConfiguration({
            type: 'continuous',
            columns: 20,
        }),
        profile: createOrthographyProfile('portuguese-braille-2018'),
        effectiveConfiguration: { interruptionPolicy: 'discard' },
    })

const createConfirmingSession = () =>
    createTypingSession({
        paper: createPaperConfiguration({
            type: 'continuous',
            columns: 20,
        }),
        profile: createOrthographyProfile('portuguese-braille-2018'),
        effectiveConfiguration: { interruptionPolicy: 'confirm' },
    })

const activateKeyboardCapture = (state: TypingSessionState) =>
    applySessionInput(state, {
        type: 'activate-capture',
        source: 'web-keyboard',
    }).state

describe('Typing session', () => {
    test('requires intentional capture before producing a Braille cell', () => {
        const initial = createSession()
        const dot = createBrailleDot(1)

        const ignored = applySessionInput(initial, {
            type: 'machine-intent',
            source: 'web-keyboard',
            intent: { type: 'press', control: { type: 'dot', dot } },
        })
        const active = activateKeyboardCapture(ignored.state)
        const pressed = applySessionInput(active, {
            type: 'machine-intent',
            source: 'web-keyboard',
            intent: { type: 'press', control: { type: 'dot', dot } },
        })
        const released = applySessionInput(pressed.state, {
            type: 'machine-intent',
            source: 'web-keyboard',
            intent: { type: 'release', control: { type: 'dot', dot } },
        })

        expect(ignored.state).toBe(initial)
        expect(ignored.events).toEqual([
            {
                type: 'session-input-rejected',
                reason: 'capture-inactive',
            },
        ])
        expect(released.snapshot.capture).toEqual({
            status: 'active',
            source: 'web-keyboard',
        })
        expect(
            getDocumentCellImpression(released.state.document, {
                sheet: 0,
                row: 0,
                column: 0,
            }),
        ).toEqual({ cell: { dots: [1] }, erasedDots: [] })
        expect(released.snapshot.interpretation.lines).toEqual([
            {
                segments: [
                    {
                        status: 'interpreted',
                        role: 'symbol',
                        text: 'a',
                        source: [{ sheet: 0, row: 0, column: 0 }],
                    },
                ],
            },
        ])
    })

    test('interrupts capture with the effective discard policy', () => {
        const active = activateKeyboardCapture(createSession())
        const pressed = applySessionInput(active, {
            type: 'machine-intent',
            source: 'web-keyboard',
            intent: {
                type: 'press',
                control: { type: 'dot', dot: createBrailleDot(1) },
            },
        })

        const interrupted = applySessionInput(pressed.state, {
            type: 'interrupt-capture',
            cause: 'focus-loss',
        })

        expect(interrupted.snapshot.capture).toEqual({ status: 'inactive' })
        expect(interrupted.state.engine).toEqual({
            accumulatedDots: [],
            pressedDots: [],
            pressedControls: [],
        })
        expect(interrupted.snapshot.document).toBe(active.document)
        expect(interrupted.events).toEqual([
            {
                type: 'chord-discarded',
                cause: 'interruption',
                cell: { dots: [1] },
            },
            {
                type: 'capture-interrupted',
                cause: 'focus-loss',
                policy: 'discard',
            },
        ])
    })

    test('keeps the active input source responsible for capture', () => {
        const active = activateKeyboardCapture(createSession())

        const rejected = applySessionInput(active, {
            type: 'activate-capture',
            source: 'another-input-adapter',
        })

        expect(rejected.state).toBe(active)
        expect(rejected.events).toEqual([
            {
                type: 'session-input-rejected',
                reason: 'source-not-responsible',
            },
        ])
    })

    test('confirms an unfinished chord when required by effective configuration', () => {
        const active = activateKeyboardCapture(createConfirmingSession())
        const pressed = applySessionInput(active, {
            type: 'machine-intent',
            source: 'web-keyboard',
            intent: {
                type: 'press',
                control: { type: 'dot', dot: createBrailleDot(1) },
            },
        })

        const interrupted = applySessionInput(pressed.state, {
            type: 'interrupt-capture',
            cause: 'page-hidden',
        })

        expect(
            getDocumentCellImpression(interrupted.state.document, {
                sheet: 0,
                row: 0,
                column: 0,
            }),
        ).toEqual({ cell: { dots: [1] }, erasedDots: [] })
        expect(interrupted.events.at(-1)).toEqual({
            type: 'capture-interrupted',
            cause: 'page-hidden',
            policy: 'confirm',
        })
    })

    test('moves the review position without changing editing or content', () => {
        const active = activateKeyboardCapture(createSession())
        const pressed = applySessionInput(active, {
            type: 'machine-intent',
            source: 'web-keyboard',
            intent: {
                type: 'press',
                control: { type: 'dot', dot: createBrailleDot(1) },
            },
        })
        const written = applySessionInput(pressed.state, {
            type: 'machine-intent',
            source: 'web-keyboard',
            intent: {
                type: 'release',
                control: { type: 'dot', dot: createBrailleDot(1) },
            },
        })

        const reviewed = applySessionInput(written.state, {
            type: 'move-review',
            direction: 'right',
        })

        expect(reviewed.state.document.editingPosition).toEqual({
            sheet: 0,
            row: 0,
            column: 1,
        })
        expect(reviewed.state.document.reviewPosition).toEqual({
            sheet: 0,
            row: 0,
            column: 1,
        })
        expect(reviewed.events).toEqual([
            {
                type: 'review-position-moved',
                direction: 'right',
                position: { sheet: 0, row: 0, column: 1 },
            },
        ])
        expect(reviewed.snapshot.interpretation).toEqual(
            written.snapshot.interpretation,
        )
    })
})
