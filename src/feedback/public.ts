import { resolvePortugueseFeedbackMessage } from './catalogs/portuguese'
import type { FeedbackPlan } from './feedback'

export { createMemoryFeedbackOutput } from './adapters/memory/memory'
export {
    planSessionFeedback,
    type FeedbackMessage,
    type FeedbackMessageId,
    type FeedbackPlan,
    type MessageFeedbackPlan,
    type SilentFeedbackPlan,
} from './feedback'
export {
    executeFeedbackPlan,
    type FeedbackDelivery,
    type FeedbackExecutionResult,
    type FeedbackOutput,
} from './output'

/** Resolves the current product locale for a planned feedback message. */
export const resolveFeedbackMessage = (plan: FeedbackPlan): string =>
    plan.disposition === 'message'
        ? resolvePortugueseFeedbackMessage(plan.message)
        : ''
