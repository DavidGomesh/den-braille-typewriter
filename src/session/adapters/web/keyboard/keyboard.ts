import {
    createBrailleDot,
    type MachineControl,
    type MachineIntent,
    type ReviewDirection,
} from '../../../../braille/public'
import {
    createDefaultSimulatorPreferences,
    type KeyboardBindingPreferences,
} from '../../../../preferences/public'

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
    control?: MachineControl
    command?: WebKeyboardCommand
}>

/** A session-level command normalized from a physical keyboard event. */
export type WebKeyboardCommand =
    | Readonly<{ type: 'move-review'; direction: ReviewDirection }>
    | Readonly<{ type: 'toggle-capture' }>

/** Configurable physical bindings consumed by the focused web adapter. */
export type WebKeyboardBindings = ReadonlyMap<
    string,
    | Readonly<{ controls: readonly MachineControl[] }>
    | Readonly<{ command: WebKeyboardCommand }>
>

/** Creates adapter bindings from validated simulator preferences. */
export const createWebKeyboardBindings = (
    codes: KeyboardBindingPreferences,
): WebKeyboardBindings => {
    const bindings = new Map<
        string,
        | Readonly<{ controls: readonly MachineControl[] }>
        | Readonly<{ command: WebKeyboardCommand }>
    >()
    const dots = [
        codes.dot1,
        codes.dot2,
        codes.dot3,
        codes.dot4,
        codes.dot5,
        codes.dot6,
    ]
    dots.forEach((code, index) =>
        bindings.set(
            code,
            Object.freeze({
                controls: Object.freeze([
                    Object.freeze({
                        type: 'dot' as const,
                        dot: createBrailleDot(index + 1),
                    }),
                ]),
            }),
        ),
    )
    bindings.set(
        codes.space,
        Object.freeze({
            controls: Object.freeze([
                Object.freeze({ type: 'space' as const }),
            ]),
        }),
    )
    bindings.set(
        codes.backspace,
        Object.freeze({
            controls: Object.freeze([
                Object.freeze({ type: 'backspace' as const }),
            ]),
        }),
    )
    bindings.set(
        codes.lineChange,
        Object.freeze({
            controls: Object.freeze([
                Object.freeze({ type: 'line-feed' as const }),
                Object.freeze({ type: 'carriage-return' as const }),
            ]),
        }),
    )
    const reviewCodes: readonly [string, ReviewDirection][] = [
        [codes.reviewUp, 'up'],
        [codes.reviewRight, 'right'],
        [codes.reviewDown, 'down'],
        [codes.reviewLeft, 'left'],
    ]
    reviewCodes.forEach(([code, direction]) =>
        bindings.set(
            code,
            Object.freeze({
                command: Object.freeze({
                    type: 'move-review' as const,
                    direction,
                }),
            }),
        ),
    )
    bindings.set(
        codes.toggleCapture,
        Object.freeze({
            command: Object.freeze({ type: 'toggle-capture' as const }),
        }),
    )
    return bindings
}

/** Creates an independent copy of the standard free-mode key bindings. */
export const createDefaultWebKeyboardBindings = (): WebKeyboardBindings =>
    createWebKeyboardBindings(
        createDefaultSimulatorPreferences().keyboardBindings,
    )

const defaultBindings = createDefaultWebKeyboardBindings()

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
    bindings: WebKeyboardBindings = defaultBindings,
): WebKeyboardMapping => {
    if (event.ctrlKey || event.altKey || event.metaKey) {
        return Object.freeze({ handled: false, intents: Object.freeze([]) })
    }

    const binding = bindings.get(event.code)
    if (binding !== undefined && 'command' in binding) {
        if (type === 'press' && !event.repeat) {
            return Object.freeze({
                handled: true,
                intents: Object.freeze([]),
                command: binding.command,
            })
        }
        return Object.freeze({ handled: false, intents: Object.freeze([]) })
    }

    const controls = binding !== undefined ? binding.controls : []
    if (controls.length === 0) {
        return Object.freeze({ handled: false, intents: Object.freeze([]) })
    }
    if (type === 'press' && event.repeat) {
        return Object.freeze({
            handled: true,
            intents: Object.freeze([]),
            control: controls[0],
        })
    }

    return Object.freeze({
        handled: true,
        control: controls[0],
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
