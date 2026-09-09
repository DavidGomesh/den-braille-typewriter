import type { SessionEvent } from '../session/public'

export type FeedbackMessageId =
    | 'capture-activated'
    | 'capture-interrupted'
    | 'chord-discarded'
    | 'input-rejected'
    | 'review-position-moved'

export type FeedbackMessage = Readonly<{
    id: FeedbackMessageId
    parameters: Readonly<Record<string, string | number>>
}>

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

export type SilentFeedbackPlan = Readonly<{
    disposition: 'silent'
    reason: 'frequent-production'
}>

export type FeedbackPlan = MessageFeedbackPlan | SilentFeedbackPlan

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
