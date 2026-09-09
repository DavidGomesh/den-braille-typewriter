import { resolvePortugueseFeedbackMessage } from './catalog/portuguese'
import type { MessageFeedbackPlan } from './feedback'

export { createMemoryFeedbackOutput } from './adapters/memory/memory'
export {
    coordinateSessionFeedback,
    createFeedbackCoordinatorState,
    planSessionFeedback,
    type FeedbackCoordinationResult,
    type FeedbackCoordinatorState,
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

/** Resolves a presentable plan into the current product locale. */
export const resolveFeedbackMessage = (plan: MessageFeedbackPlan): string =>
    resolvePortugueseFeedbackMessage(plan.message)
