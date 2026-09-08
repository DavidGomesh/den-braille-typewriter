import { describe, expect, test } from 'vitest'

import {
    applyIntent,
    createBrailleCell,
    createBrailleDot,
    createEngineState,
} from './public'

describe('fundamental engine values', () => {
    test('accepts only the six Braille dot positions', () => {
        expect([1, 2, 3, 4, 5, 6].map(createBrailleDot)).toEqual([
            1, 2, 3, 4, 5, 6,
        ])
        expect(() => createBrailleDot(0)).toThrowError(RangeError)
        expect(() => createBrailleDot(7)).toThrowError(RangeError)
        expect(() => createBrailleDot(1.5)).toThrowError(RangeError)
    })

    test('creates a canonical immutable Braille cell', () => {
        const cell = createBrailleCell([6, 1, 1, 3])
        expect(cell).toEqual({ dots: [1, 3, 6] })
        expect(createBrailleCell()).toEqual({ dots: [] })
        expect(Object.isFrozen(cell)).toBe(true)
        expect(Object.isFrozen(cell.dots)).toBe(true)
        expect(() => createBrailleCell([8])).toThrowError(RangeError)
    })
})

describe('Braille chord', () => {
    test('confirms overlapping dots only after all are released', () => {
        const dot1 = createBrailleDot(1)
        const dot4 = createBrailleDot(4)
        const pressed1 = applyIntent(createEngineState(), {
            type: 'press',
            control: { type: 'dot', dot: dot1 },
        })
        const pressed4 = applyIntent(pressed1.state, {
            type: 'press',
            control: { type: 'dot', dot: dot4 },
        })
        const released1 = applyIntent(pressed4.state, {
            type: 'release',
            control: { type: 'dot', dot: dot1 },
        })

        expect(released1.events).toEqual([])
        expect(released1.snapshot.chord).toEqual({
            accumulatedDots: [1, 4],
            pressedDots: [4],
        })

        const released4 = applyIntent(released1.state, {
            type: 'release',
            control: { type: 'dot', dot: dot4 },
        })

        expect(released4.events).toEqual([
            {
                type: 'operation-produced',
                operation: {
                    type: 'confirm-cell',
                    cell: { dots: [1, 4] },
                },
            },
        ])
        expect(released4.snapshot.chord).toEqual({
            accumulatedDots: [],
            pressedDots: [],
        })
    })
})

describe('machine operations', () => {
    test.each(['space', 'backspace', 'line-feed', 'carriage-return'] as const)(
        '%s produces one operation per press and release cycle',
        (type) => {
            const pressed = applyIntent(createEngineState(), {
                type: 'press',
                control: { type },
            })
            expect(pressed.events).toEqual([])

            const released = applyIntent(pressed.state, {
                type: 'release',
                control: { type },
            })
            expect(released.events).toEqual([
                { type: 'operation-produced', operation: { type } },
            ])
        },
    )

    test('rejects repetition while a control remains pressed', () => {
        const intent = {
            type: 'press',
            control: { type: 'space' },
        } as const
        const firstPress = applyIntent(createEngineState(), intent)
        const repetition = applyIntent(firstPress.state, intent)

        expect(repetition.state).toBe(firstPress.state)
        expect(repetition.events).toEqual([
            { type: 'input-rejected', reason: 'control-already-pressed' },
        ])
    })

    test('rejects releasing an inactive control without changing state', () => {
        const state = createEngineState()
        const result = applyIntent(state, {
            type: 'release',
            control: { type: 'backspace' },
        })

        expect(result.state).toBe(state)
        expect(result.events).toEqual([
            { type: 'input-rejected', reason: 'control-not-pressed' },
        ])
    })
})

describe('non-confirming capture termination', () => {
    const stateWithChord = () => {
        const pressed1 = applyIntent(createEngineState(), {
            type: 'press',
            control: { type: 'dot', dot: createBrailleDot(1) },
        })
        return applyIntent(pressed1.state, {
            type: 'press',
            control: { type: 'dot', dot: createBrailleDot(5) },
        }).state
    }

    test('input cancellation always discards the chord', () => {
        const result = applyIntent(stateWithChord(), { type: 'cancel-input' })

        expect(result.snapshot.chord).toEqual({
            accumulatedDots: [],
            pressedDots: [],
        })
        expect(result.events).toEqual([
            {
                type: 'chord-discarded',
                cause: 'cancellation',
                cell: { dots: [1, 5] },
            },
        ])
    })

    test('capture interruption discards the chord under that policy', () => {
        const activeDirectControl = applyIntent(stateWithChord(), {
            type: 'press',
            control: { type: 'space' },
        })
        const result = applyIntent(activeDirectControl.state, {
            type: 'interrupt-capture',
            policy: 'discard',
        })

        expect(result.snapshot).toEqual({
            chord: { accumulatedDots: [], pressedDots: [] },
            pressedControls: [],
        })
        expect(result.events).toEqual([
            {
                type: 'chord-discarded',
                cause: 'interruption',
                cell: { dots: [1, 5] },
            },
        ])
    })

    test('capture interruption confirms the chord under that policy', () => {
        const result = applyIntent(stateWithChord(), {
            type: 'interrupt-capture',
            policy: 'confirm',
        })

        expect(result.snapshot.chord).toEqual({
            accumulatedDots: [],
            pressedDots: [],
        })
        expect(result.events).toEqual([
            {
                type: 'operation-produced',
                operation: {
                    type: 'confirm-cell',
                    cell: { dots: [1, 5] },
                },
            },
        ])
    })
})
