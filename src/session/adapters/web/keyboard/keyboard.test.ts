import { describe, expect, test } from 'vitest'

import {
    createDefaultWebKeyboardBindings,
    mapWebKeyboardEvent,
} from '../../../public'

describe('Web keyboard adapter', () => {
    test('maps a focused Braille dot key to a normalized machine intent', () => {
        expect(
            mapWebKeyboardEvent(
                {
                    code: 'KeyF',
                    repeat: false,
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                },
                'press',
            ),
        ).toEqual({
            handled: true,
            control: { type: 'dot', dot: 1 },
            intents: [
                {
                    type: 'press',
                    control: { type: 'dot', dot: 1 },
                },
            ],
        })
    })

    test('maps the legacy free-mode controls without conflating line movements', () => {
        const event = {
            repeat: false,
            ctrlKey: false,
            altKey: false,
            metaKey: false,
        }

        expect(
            mapWebKeyboardEvent({ ...event, code: 'Space' }, 'release'),
        ).toEqual({
            handled: true,
            control: { type: 'space' },
            intents: [{ type: 'release', control: { type: 'space' } }],
        })
        expect(
            mapWebKeyboardEvent({ ...event, code: 'Backspace' }, 'press'),
        ).toEqual({
            handled: true,
            control: { type: 'backspace' },
            intents: [{ type: 'press', control: { type: 'backspace' } }],
        })
        expect(
            mapWebKeyboardEvent({ ...event, code: 'KeyQ' }, 'release'),
        ).toEqual({
            handled: true,
            control: { type: 'line-feed' },
            intents: [
                { type: 'release', control: { type: 'line-feed' } },
                { type: 'release', control: { type: 'carriage-return' } },
            ],
        })
    })

    test('leaves modified and unmapped input to the browser and suppresses repeats', () => {
        const event = {
            code: 'KeyF',
            repeat: false,
            ctrlKey: false,
            altKey: false,
            metaKey: false,
        }

        expect(
            mapWebKeyboardEvent({ ...event, ctrlKey: true }, 'press'),
        ).toEqual({ handled: false, intents: [] })
        expect(mapWebKeyboardEvent({ ...event, code: 'Tab' }, 'press')).toEqual(
            { handled: false, intents: [] },
        )
        expect(
            mapWebKeyboardEvent({ ...event, repeat: true }, 'press'),
        ).toEqual({
            handled: true,
            control: { type: 'dot', dot: 1 },
            intents: [],
        })
    })

    test('normalizes review and capture toggle keys as session commands', () => {
        const event = {
            repeat: false,
            ctrlKey: false,
            altKey: false,
            metaKey: false,
        }

        expect(
            mapWebKeyboardEvent({ ...event, code: 'ArrowLeft' }, 'press'),
        ).toEqual({
            handled: true,
            command: { type: 'move-review', direction: 'left' },
            intents: [],
        })
        expect(
            mapWebKeyboardEvent({ ...event, code: 'Escape' }, 'press'),
        ).toEqual({
            handled: true,
            command: { type: 'toggle-capture' },
            intents: [],
        })
    })

    test('accepts remapped physical bindings without changing machine intents', () => {
        const bindings = new Map(createDefaultWebKeyboardBindings())
        const dot1 = bindings.get('KeyF')
        bindings.delete('KeyF')
        if (dot1 !== undefined) bindings.set('KeyA', dot1)
        const event = {
            repeat: false,
            ctrlKey: false,
            altKey: false,
            metaKey: false,
        }

        expect(
            mapWebKeyboardEvent({ ...event, code: 'KeyF' }, 'press', bindings),
        ).toEqual({ handled: false, intents: [] })
        expect(
            mapWebKeyboardEvent({ ...event, code: 'KeyA' }, 'press', bindings),
        ).toMatchObject({
            handled: true,
            intents: [
                {
                    type: 'press',
                    control: { type: 'dot', dot: 1 },
                },
            ],
        })
    })
})
