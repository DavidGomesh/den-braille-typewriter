import type { SessionEvent } from '../session/public'

export type FeedbackMessageId =
    | 'capture-activated'
    | 'capture-interrupted'
    | 'chord-discarded'
    | 'input-rejected'
    | 'review-position-moved'

/** Localizable semantic content with parameters required by each message. */
export type FeedbackMessage =
    | Readonly<{
          id: 'capture-activated'
          parameters: Readonly<Record<string, never>>
      }>
    | Readonly<{
          id: 'capture-interrupted'
          parameters: Readonly<{
              cause: 'focus-loss' | 'page-hidden' | 'pause'
              policy: 'discard' | 'confirm'
          }>
      }>
    | Readonly<{
          id: 'chord-discarded'
          parameters: Readonly<{
              cause: 'cancellation' | 'interruption'
          }>
      }>
    | Readonly<{
          id: 'input-rejected'
          parameters: Readonly<{
              reason:
                  | 'capture-inactive'
                  | 'source-not-responsible'
                  | 'control-already-pressed'
                  | 'control-not-pressed'
          }>
      }>
    | Readonly<{
          id: 'review-position-moved'
          parameters: Readonly<{ row: number; column: number }>
      }>

/** Output policy for one presentable semantic message. */
export type MessageFeedbackPlan = Readonly<{
    disposition: 'message'
    message: FeedbackMessage
    priority: 'normal' | 'high' | 'urgent'
    repetition: 'replace' | 'repeat' | 'suppress'
    interruption: 'none' | 'lower-priority' | 'all'
    channels: Readonly<{
        visual: boolean
        accessible: 'off' | 'polite' | 'assertive'
    }>
}>

/** Deliberate omission of output for a semantic fact. */
export type SilentFeedbackPlan = Readonly<{
    disposition: 'silent'
    reason: 'frequent-production'
}>

/** Complete pure planning outcome for one semantic fact. */
export type FeedbackPlan = MessageFeedbackPlan | SilentFeedbackPlan

/** Minimal immutable history required to apply cross-event feedback policy. */
export type FeedbackCoordinatorState = Readonly<{
    lastMessage?: FeedbackMessage
}>

/** Presentable plans and updated coordinator history for one event batch. */
export type FeedbackCoordinationResult = Readonly<{
    state: FeedbackCoordinatorState
    plans: readonly MessageFeedbackPlan[]
}>

const messagePlan = (
    message: FeedbackMessage,
    options: Readonly<{
        priority: MessageFeedbackPlan['priority']
        repetition: MessageFeedbackPlan['repetition']
        interruption: MessageFeedbackPlan['interruption']
    }>,
): MessageFeedbackPlan =>
    Object.freeze({
        disposition: 'message',
        message: Object.freeze(message),
        ...options,
        channels: Object.freeze({ visual: true, accessible: 'polite' }),
    })

/** Plans modality-independent feedback for one semantic session fact. */
export const planSessionFeedback = (event: SessionEvent): FeedbackPlan => {
    switch (event.type) {
        case 'operation-produced':
            return Object.freeze({
                disposition: 'silent',
                reason: 'frequent-production',
            })
        case 'capture-activated':
            return messagePlan(
                { id: 'capture-activated', parameters: Object.freeze({}) },
                {
                    priority: 'normal',
                    repetition: 'replace',
                    interruption: 'none',
                },
            )
        case 'capture-interrupted':
            return messagePlan(
                {
                    id: 'capture-interrupted',
                    parameters: Object.freeze({
                        cause: event.cause,
                        policy: event.policy,
                    }),
                },
                {
                    priority: 'high',
                    repetition: 'replace',
                    interruption: 'lower-priority',
                },
            )
        case 'review-position-moved':
            return messagePlan(
                {
                    id: 'review-position-moved',
                    parameters: Object.freeze({
                        row: event.position.row + 1,
                        column: event.position.column + 1,
                    }),
                },
                {
                    priority: 'normal',
                    repetition: 'replace',
                    interruption: 'none',
                },
            )
        case 'session-input-rejected':
        case 'input-rejected':
            return messagePlan(
                {
                    id: 'input-rejected',
                    parameters: Object.freeze({ reason: event.reason }),
                },
                {
                    priority: 'high',
                    repetition: 'suppress',
                    interruption: 'none',
                },
            )
        case 'chord-discarded':
            return messagePlan(
                {
                    id: 'chord-discarded',
                    parameters: Object.freeze({ cause: event.cause }),
                },
                {
                    priority: 'high',
                    repetition: 'replace',
                    interruption: 'lower-priority',
                },
            )
    }
}

const priorityRank: Readonly<Record<MessageFeedbackPlan['priority'], number>> =
    Object.freeze({ normal: 0, high: 1, urgent: 2 })

const sameMessage = (left: FeedbackMessage, right: FeedbackMessage): boolean =>
    left.id === right.id &&
    JSON.stringify(left.parameters) === JSON.stringify(right.parameters)

/** Creates empty history for the pure feedback coordinator. */
export const createFeedbackCoordinatorState = (): FeedbackCoordinatorState =>
    Object.freeze({})

/**
 * Coordinates every semantic fact from one transition in source order.
 *
 * Repeated messages marked `suppress` are omitted across transitions.
 * Interruption removes only lower-priority plans still pending in the current
 * batch; same-priority facts remain ordered and observable.
 */
export const coordinateSessionFeedback = (
    state: FeedbackCoordinatorState,
    events: readonly SessionEvent[],
): FeedbackCoordinationResult => {
    let lastMessage = state.lastMessage
    let plans: MessageFeedbackPlan[] = []

    events.forEach((event) => {
        const plan = planSessionFeedback(event)
        if (plan.disposition === 'silent') return
        if (
            plan.repetition === 'suppress' &&
            lastMessage !== undefined &&
            sameMessage(lastMessage, plan.message)
        )
            return

        if (plan.interruption === 'lower-priority') {
            plans = plans.filter(
                (pending) =>
                    priorityRank[pending.priority] >=
                    priorityRank[plan.priority],
            )
        } else if (plan.interruption === 'all') {
            plans = []
        }
        if (plan.repetition === 'replace') {
            plans = plans.filter(
                (pending) => pending.message.id !== plan.message.id,
            )
        }
        plans.push(plan)
        lastMessage = plan.message
    })

    return Object.freeze({
        state:
            lastMessage === undefined
                ? Object.freeze({})
                : Object.freeze({ lastMessage }),
        plans: Object.freeze(plans),
    })
}
