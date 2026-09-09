import { describe, expect, test } from 'vitest'

import {
    createMemoryFeedbackOutput,
    executeFeedbackPlan,
    planSessionFeedback,
} from '../../src/feedback/public'

describe('feedback output contract', () => {
    test('one cancelled or failed output does not prevent another output', async () => {
        const delivered = createMemoryFeedbackOutput('visual')
        const cancelled = createMemoryFeedbackOutput('accessible', {
            outcome: 'cancelled',
        })
        const failed = createMemoryFeedbackOutput('secondary-visual', {
            error: new Error('output unavailable'),
        })
        const plan = planSessionFeedback({ type: 'capture-activated' })

        const result = await executeFeedbackPlan(plan, [
            cancelled.output,
            failed.output,
            delivered.output,
        ])

        expect(result.outputs).toEqual([
            { id: 'accessible', status: 'cancelled' },
            { id: 'secondary-visual', status: 'failed' },
            { id: 'visual', status: 'delivered' },
        ])
        expect(delivered.deliveries).toEqual([
            {
                content: 'Captura de acordes ativada.',
                priority: 'normal',
                repetition: 'replace',
                interruption: 'none',
            },
        ])
    })

    test('does not call outputs for a silent plan', async () => {
        const output = createMemoryFeedbackOutput('visual')
        const plan = planSessionFeedback({
            type: 'operation-produced',
            operation: { type: 'space' },
        })

        const result = await executeFeedbackPlan(plan, [output.output])

        expect(result.outputs).toEqual([])
        expect(output.deliveries).toEqual([])
    })
})
