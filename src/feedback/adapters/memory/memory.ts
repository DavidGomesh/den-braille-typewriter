import type { FeedbackDelivery, FeedbackOutput } from '../../output'

export type MemoryFeedbackOutput = Readonly<{
    output: FeedbackOutput
    deliveries: readonly FeedbackDelivery[]
}>

/** Creates an inspectable deterministic feedback output for tests and tools. */
export const createMemoryFeedbackOutput = (
    id: string,
    behavior: Readonly<{
        outcome?: 'delivered' | 'cancelled'
        error?: Error
    }> = {},
): MemoryFeedbackOutput => {
    const deliveries: FeedbackDelivery[] = []
    return Object.freeze({
        deliveries,
        output: Object.freeze({
            id,
            deliver: (delivery: FeedbackDelivery) => {
                deliveries.push(delivery)
                if (behavior.error !== undefined) throw behavior.error
                return behavior.outcome ?? 'delivered'
            },
        }),
    })
}
