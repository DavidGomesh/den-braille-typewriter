import {
    applyDocumentOperation,
    applyIntent,
    createBrailleDocument,
    createEngineState,
    interpretBrailleDocument,
    moveReviewPosition,
    type BrailleDocument,
    type BrailleInterpretation,
    type EngineEvent,
    type EngineState,
    type MachineIntent,
    type OrthographyProfile,
    type PaperConfiguration,
    type ReviewDirection,
} from '../braille/public'

/** A stable identifier supplied by an input adapter. */
export type SessionInputSource = string

/** Policies in force for this session after experience requirements are applied. */
export type EffectiveSessionConfiguration = Readonly<{
    interruptionPolicy: 'discard' | 'confirm'
}>

/** Whether an input source currently owns intentional machine capture. */
export type CaptureState =
    | Readonly<{ status: 'inactive' }>
    | Readonly<{
          status: 'active'
          source: SessionInputSource
      }>

/**
 * The immutable source of truth for one typing session.
 *
 * Interpretation is derived in the snapshot and is never stored alongside the
 * Braille document.
 */
export type TypingSessionState = Readonly<{
    engine: EngineState
    document: BrailleDocument
    profile: OrthographyProfile
    effectiveConfiguration: EffectiveSessionConfiguration
    capture: CaptureState
}>

/** A normalized request accepted by the typing session transition. */
export type SessionInput =
    | Readonly<{
          type: 'activate-capture'
          source: SessionInputSource
      }>
    | Readonly<{
          type: 'machine-intent'
          source: SessionInputSource
          intent: MachineIntent
      }>
    | Readonly<{
          type: 'interrupt-capture'
          cause: 'focus-loss' | 'page-hidden' | 'pause'
      }>
    | Readonly<{
          type: 'move-review'
          direction: ReviewDirection
      }>

/** A semantic fact exposed to presentation and feedback consumers. */
export type SessionEvent =
    | EngineEvent
    | Readonly<{
          type: 'capture-activated'
          source: SessionInputSource
      }>
    | Readonly<{
          type: 'session-input-rejected'
          reason: 'capture-inactive' | 'source-not-responsible'
      }>
    | Readonly<{
          type: 'capture-interrupted'
          cause: 'focus-loss' | 'page-hidden' | 'pause'
          policy: EffectiveSessionConfiguration['interruptionPolicy']
      }>
    | Readonly<{
          type: 'review-position-moved'
          direction: ReviewDirection
          position: BrailleDocument['reviewPosition']
      }>

/** The immutable observable projection returned to session consumers. */
export type TypingSessionSnapshot = Readonly<{
    document: BrailleDocument
    interpretation: BrailleInterpretation
    effectiveConfiguration: EffectiveSessionConfiguration
    capture: CaptureState
}>

/** The state, observable projection, and facts produced by one transition. */
export type TypingSessionResult = Readonly<{
    state: TypingSessionState
    snapshot: TypingSessionSnapshot
    events: readonly SessionEvent[]
}>

/** Required initial document and effective policy choices for a session. */
export type TypingSessionOptions = Readonly<{
    paper: PaperConfiguration
    profile: OrthographyProfile
    effectiveConfiguration: EffectiveSessionConfiguration
}>

const inactiveCapture = (): CaptureState =>
    Object.freeze({ status: 'inactive' })

const freezeState = (
    engine: EngineState,
    document: BrailleDocument,
    profile: OrthographyProfile,
    effectiveConfiguration: EffectiveSessionConfiguration,
    capture: CaptureState,
): TypingSessionState =>
    Object.freeze({
        engine,
        document,
        profile,
        effectiveConfiguration,
        capture,
    })

const createSnapshot = (state: TypingSessionState): TypingSessionSnapshot =>
    Object.freeze({
        document: state.document,
        interpretation: interpretBrailleDocument(state.document, state.profile),
        effectiveConfiguration: state.effectiveConfiguration,
        capture: state.capture,
    })

/** Returns the immutable observable projection of a typing session. */
export const getTypingSessionSnapshot = createSnapshot

const createResult = (
    state: TypingSessionState,
    events: readonly SessionEvent[] = [],
): TypingSessionResult =>
    Object.freeze({
        state,
        snapshot: createSnapshot(state),
        events: Object.freeze([...events]),
    })

const applyMachineTransition = (
    state: TypingSessionState,
    intent: MachineIntent,
    capture: CaptureState,
    sessionEvents: readonly SessionEvent[] = [],
): TypingSessionResult => {
    const engineResult = applyIntent(state.engine, intent)
    const document = engineResult.events.reduce(
        (current, event) =>
            event.type === 'operation-produced'
                ? applyDocumentOperation(current, event.operation)
                : current,
        state.document,
    )
    return createResult(
        freezeState(
            engineResult.state,
            document,
            state.profile,
            state.effectiveConfiguration,
            capture,
        ),
        [...engineResult.events, ...sessionEvents],
    )
}

/**
 * Creates an inactive typing session at the first writable document position.
 *
 * Capture must be activated intentionally before machine intents can change the
 * engine or document.
 */
export const createTypingSession = (
    options: TypingSessionOptions,
): TypingSessionState =>
    freezeState(
        createEngineState(),
        createBrailleDocument(options.paper),
        options.profile,
        Object.freeze({ ...options.effectiveConfiguration }),
        inactiveCapture(),
    )

/**
 * Applies one session input as a pure transition.
 *
 * Machine operations update the Braille document before the snapshot is
 * derived. Inputs from an inactive or non-responsible source preserve state and
 * produce `session-input-rejected`. Interruption applies the effective policy,
 * clears every active control, and deactivates capture.
 */
export const applySessionInput = (
    state: TypingSessionState,
    input: SessionInput,
): TypingSessionResult => {
    if (input.type === 'activate-capture') {
        if (state.capture.status === 'active') {
            if (state.capture.source === input.source)
                return createResult(state)
            return createResult(state, [
                Object.freeze({
                    type: 'session-input-rejected',
                    reason: 'source-not-responsible',
                }),
            ])
        }
        const capture = Object.freeze({
            status: 'active' as const,
            source: input.source,
        })
        return createResult(
            freezeState(
                state.engine,
                state.document,
                state.profile,
                state.effectiveConfiguration,
                capture,
            ),
            [
                Object.freeze({
                    type: 'capture-activated',
                    source: input.source,
                }),
            ],
        )
    }

    if (input.type === 'interrupt-capture') {
        if (state.capture.status === 'inactive') return createResult(state)

        const policy = state.effectiveConfiguration.interruptionPolicy
        return applyMachineTransition(
            state,
            { type: 'interrupt-capture', policy },
            inactiveCapture(),
            [
                Object.freeze({
                    type: 'capture-interrupted',
                    cause: input.cause,
                    policy,
                }),
            ],
        )
    }

    if (input.type === 'move-review') {
        const document = moveReviewPosition(state.document, input.direction)
        return createResult(
            freezeState(
                state.engine,
                document,
                state.profile,
                state.effectiveConfiguration,
                state.capture,
            ),
            [
                Object.freeze({
                    type: 'review-position-moved',
                    direction: input.direction,
                    position: document.reviewPosition,
                }),
            ],
        )
    }

    if (state.capture.status === 'inactive') {
        return createResult(state, [
            Object.freeze({
                type: 'session-input-rejected',
                reason: 'capture-inactive',
            }),
        ])
    }
    if (state.capture.source !== input.source) {
        return createResult(state, [
            Object.freeze({
                type: 'session-input-rejected',
                reason: 'source-not-responsible',
            }),
        ])
    }

    return applyMachineTransition(state, input.intent, state.capture)
}
