import {
    createBrailleDot,
    type MachineControl,
    type MachineIntent,
} from '../../../../braille/public'

/** Browser keyboard data required by the web adapter. */
export type WebKeyboardEvent = Readonly<{
    code: string
    repeat: boolean
    ctrlKey: boolean
    altKey: boolean
    metaKey: boolean
}>

/**
 * The normalized intents and whether the focused region should consume the
 * browser event.
 */
export type WebKeyboardMapping = Readonly<{
    handled: boolean
    intents: readonly MachineIntent[]
}>

const dotByCode = new Map<string, number>([
    ['KeyF', 1],
    ['KeyD', 2],
    ['KeyS', 3],
    ['KeyJ', 4],
    ['KeyK', 5],
    ['KeyL', 6],
])

const directControlsByCode = new Map<string, readonly MachineControl[]>([
    ['Space', [Object.freeze({ type: 'space' })]],
    ['Backspace', [Object.freeze({ type: 'backspace' })]],
    [
        'KeyQ',
        [
            Object.freeze({ type: 'line-feed' }),
            Object.freeze({ type: 'carriage-return' }),
        ],
    ],
])

const controlsForCode = (code: string): readonly MachineControl[] => {
    const dot = dotByCode.get(code)
    return dot === undefined
        ? (directControlsByCode.get(code) ?? [])
        : [Object.freeze({ type: 'dot', dot: createBrailleDot(dot) })]
}

/**
 * Maps a focused browser event to device-independent machine intents.
 *
 * Modified and unmapped keys remain unhandled. Repeated keydown events are
 * handled without repeating an intent. `KeyQ` preserves the legacy new-line
 * control while producing distinct line-feed and carriage-return operations.
 */
export const mapWebKeyboardEvent = (
    event: WebKeyboardEvent,
    type: 'press' | 'release',
): WebKeyboardMapping => {
    if (event.ctrlKey || event.altKey || event.metaKey) {
        return Object.freeze({ handled: false, intents: Object.freeze([]) })
    }

    const controls = controlsForCode(event.code)
    if (controls.length === 0) {
        return Object.freeze({ handled: false, intents: Object.freeze([]) })
    }
    if (type === 'press' && event.repeat) {
        return Object.freeze({ handled: true, intents: Object.freeze([]) })
    }

    return Object.freeze({
        handled: true,
        intents: Object.freeze(
            controls.map((control) =>
                Object.freeze({
                    type,
                    control,
                }),
            ),
        ),
    })
}
