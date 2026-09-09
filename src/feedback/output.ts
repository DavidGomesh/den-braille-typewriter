import { resolvePortugueseFeedbackMessage } from './catalog/portuguese'
import type { FeedbackPlan, MessageFeedbackPlan } from './feedback'

/** Resolved content and policies delivered unchanged to one output adapter. */
export type FeedbackDelivery = Readonly<{
    content: string
    priority: MessageFeedbackPlan['priority']
    repetition: MessageFeedbackPlan['repetition']
    interruption: MessageFeedbackPlan['interruption']
}>

/**
 * One independently executable feedback destination.
 *
 * Delivery may complete synchronously or asynchronously, report cancellation,
 * or throw/reject when unavailable. The coordinator isolates that outcome from
 * every other output.
 */
export type FeedbackOutput = Readonly<{
    id: string
    deliver(
        delivery: FeedbackDelivery,
    ): Promise<'delivered' | 'cancelled'> | 'delivered' | 'cancelled'
}>

/** Per-output outcomes in the same order as the requested adapters. */
export type FeedbackExecutionResult = Readonly<{
    outputs: readonly Readonly<{
        id: string
        status: 'delivered' | 'cancelled' | 'failed'
    }>[]
}>

/**
 * Executes outputs concurrently without allowing one failure to block another.
 *
 * A silent plan invokes no adapter. Message results preserve adapter order even
 * when completion order differs; thrown and rejected failures become `failed`.
 */
export const executeFeedbackPlan = async (
    plan: FeedbackPlan,
    outputs: readonly FeedbackOutput[],
): Promise<FeedbackExecutionResult> => {
    if (plan.disposition === 'silent') {
        return Object.freeze({ outputs: Object.freeze([]) })
    }

    const delivery = Object.freeze({
        content: resolvePortugueseFeedbackMessage(plan.message),
        priority: plan.priority,
        repetition: plan.repetition,
        interruption: plan.interruption,
    })
    const results = await Promise.all(
        outputs.map(async (output) => {
            try {
                return Object.freeze({
                    id: output.id,
                    status: await output.deliver(delivery),
                })
            } catch {
                return Object.freeze({
                    id: output.id,
                    status: 'failed' as const,
                })
            }
        }),
    )
    return Object.freeze({ outputs: Object.freeze(results) })
}
