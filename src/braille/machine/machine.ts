import { createBrailleCell, type BrailleCell, type BrailleDot } from './values'

export type DirectOperationType =
    'space' | 'backspace' | 'line-feed' | 'carriage-return'

export type MachineControl =
    | Readonly<{
          type: 'dot'
          dot: BrailleDot
      }>
    | Readonly<{ type: DirectOperationType }>

export type MachineIntent =
    | Readonly<{ type: 'press'; control: MachineControl }>
    | Readonly<{ type: 'release'; control: MachineControl }>
    | Readonly<{ type: 'cancel-input' }>
    | Readonly<{
          type: 'interrupt-capture'
          policy: 'discard' | 'confirm'
      }>

export type MachineOperation =
    | Readonly<{
          type: 'confirm-cell'
          cell: BrailleCell
      }>
    | Readonly<{ type: DirectOperationType }>

export type EngineEvent =
    | Readonly<{
          type: 'operation-produced'
          operation: MachineOperation
      }>
    | Readonly<{
          type: 'input-rejected'
          reason: 'control-already-pressed' | 'control-not-pressed'
      }>
    | Readonly<{
          type: 'chord-discarded'
          cause: 'cancellation' | 'interruption'
          cell: BrailleCell
      }>

export type EngineState = Readonly<{
    accumulatedDots: readonly BrailleDot[]
    pressedDots: readonly BrailleDot[]
    pressedControls: readonly DirectOperationType[]
}>

export type EngineSnapshot = Readonly<{
    chord: Readonly<{
        accumulatedDots: readonly BrailleDot[]
        pressedDots: readonly BrailleDot[]
    }>
    pressedControls: readonly DirectOperationType[]
}>

export type EngineResult = Readonly<{
    state: EngineState
    snapshot: EngineSnapshot
    events: readonly EngineEvent[]
}>

const createState = (
    pressedDots: readonly BrailleDot[],
    accumulatedDots: readonly BrailleDot[],
    pressedControls: readonly DirectOperationType[] = [],
): EngineState =>
    Object.freeze({
        pressedDots: Object.freeze([...pressedDots].sort()),
        accumulatedDots: Object.freeze([...accumulatedDots].sort()),
        pressedControls: Object.freeze([...pressedControls].sort()),
    })

export const createEngineState = (): EngineState => createState([], [])

const createResult = (
    state: EngineState,
    events: readonly EngineEvent[] = [],
): EngineResult =>
    Object.freeze({
        state,
        snapshot: Object.freeze({
            chord: Object.freeze({
                accumulatedDots: state.accumulatedDots,
                pressedDots: state.pressedDots,
            }),
            pressedControls: state.pressedControls,
        }),
        events: Object.freeze([...events]),
    })

export const applyIntent = (
    state: EngineState,
    intent: MachineIntent,
): EngineResult => {
    const reject = (
        reason: 'control-already-pressed' | 'control-not-pressed',
    ) =>
        createResult(state, [Object.freeze({ type: 'input-rejected', reason })])

    if (intent.type === 'cancel-input') {
        return createResult(createState([], [], state.pressedControls), [
            Object.freeze({
                type: 'chord-discarded',
                cause: 'cancellation',
                cell: createBrailleCell(state.accumulatedDots),
            }),
        ])
    }

    if (intent.type === 'interrupt-capture') {
        if (state.accumulatedDots.length === 0) {
            return createResult(createEngineState())
        }

        const cell = createBrailleCell(state.accumulatedDots)
        if (intent.policy === 'confirm') {
            return createResult(createEngineState(), [
                Object.freeze({
                    type: 'operation-produced',
                    operation: Object.freeze({ type: 'confirm-cell', cell }),
                }),
            ])
        }

        return createResult(createEngineState(), [
            Object.freeze({
                type: 'chord-discarded',
                cause: 'interruption',
                cell,
            }),
        ])
    }

    if (intent.control.type !== 'dot') {
        const control = intent.control.type
        const isPressed = state.pressedControls.includes(control)

        if (intent.type === 'press') {
            if (isPressed) return reject('control-already-pressed')

            return createResult(
                createState(state.pressedDots, state.accumulatedDots, [
                    ...state.pressedControls,
                    control,
                ]),
            )
        }

        if (!isPressed) return reject('control-not-pressed')

        return createResult(
            createState(
                state.pressedDots,
                state.accumulatedDots,
                state.pressedControls.filter((pressed) => pressed !== control),
            ),
            [
                Object.freeze({
                    type: 'operation-produced',
                    operation: Object.freeze({ type: control }),
                }),
            ],
        )
    }

    const dot = intent.control.dot
    const isPressed = state.pressedDots.includes(dot)

    if (intent.type === 'press') {
        if (isPressed) return reject('control-already-pressed')

        return createResult(
            createState(
                [...state.pressedDots, dot],
                state.accumulatedDots.includes(dot)
                    ? state.accumulatedDots
                    : [...state.accumulatedDots, dot],
                state.pressedControls,
            ),
        )
    }

    if (!isPressed) return reject('control-not-pressed')

    const pressedDots = state.pressedDots.filter((pressed) => pressed !== dot)
    if (pressedDots.length > 0) {
        return createResult(
            createState(
                pressedDots,
                state.accumulatedDots,
                state.pressedControls,
            ),
        )
    }

    const cell = createBrailleCell(state.accumulatedDots)
    return createResult(createState([], [], state.pressedControls), [
        Object.freeze({
            type: 'operation-produced',
            operation: Object.freeze({ type: 'confirm-cell', cell }),
        }),
    ])
}
