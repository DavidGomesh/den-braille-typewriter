import {
    createBrailleDot,
    type MachineControl,
    type MachineIntent,
    type ReviewDirection,
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

const reviewDirectionByCode = new Map<string, ReviewDirection>([
    ['ArrowUp', 'up'],
    ['ArrowRight', 'right'],
    ['ArrowDown', 'down'],
    ['ArrowLeft', 'left'],
])

const controlsForCode = (code: string): readonly MachineControl[] => {
    const dot = dotByCode.get(code)
    return dot === undefined
        ? (directControlsByCode.get(code) ?? [])
        : [Object.freeze({ type: 'dot', dot: createBrailleDot(dot) })]
}

/** Creates an independent copy of the standard free-mode key bindings. */
export const createDefaultWebKeyboardBindings = (): WebKeyboardBindings => {
    const bindings = new Map<
        string,
        | Readonly<{ controls: readonly MachineControl[] }>
        | Readonly<{ command: WebKeyboardCommand }>
    >()
    for (const code of [...dotByCode.keys(), ...directControlsByCode.keys()]) {
        bindings.set(code, Object.freeze({ controls: controlsForCode(code) }))
    }
    for (const [code, direction] of reviewDirectionByCode) {
        bindings.set(
            code,
            Object.freeze({
                command: Object.freeze({
                    type: 'move-review' as const,
                    direction,
                }),
            }),
        )
    }
    bindings.set(
        'Escape',
        Object.freeze({
            command: Object.freeze({ type: 'toggle-capture' as const }),
        }),
    )
    return bindings
}

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
