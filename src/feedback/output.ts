import { resolvePortugueseFeedbackMessage } from './catalogs/portuguese'
import type { FeedbackPlan, MessageFeedbackPlan } from './feedback'

export type FeedbackDelivery = Readonly<{
    content: string
    priority: MessageFeedbackPlan['priority']
    repetition: MessageFeedbackPlan['repetition']
    interruption: MessageFeedbackPlan['interruption']
}>

export type FeedbackOutput = Readonly<{
    id: string
    deliver(
        delivery: FeedbackDelivery,
    ): Promise<'delivered' | 'cancelled'> | 'delivered' | 'cancelled'
}>

export type FeedbackExecutionResult = Readonly<{
    outputs: readonly Readonly<{
        id: string
        status: 'delivered' | 'cancelled' | 'failed'
    }>[]
}>

/** Executes independent outputs without allowing one failure to block another. */
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
