import { describe, expect, test } from 'vitest'

import { createBrailleCell } from '../braille/public'
import {
    coordinateSessionFeedback,
    createFeedbackCoordinatorState,
    planSessionFeedback,
    resolveFeedbackMessage,
    type FeedbackPlan,
} from './public'

const resolvePlannedMessage = (plan: FeedbackPlan): string => {
    if (plan.disposition === 'silent')
        throw new Error('Expected a message plan')
    return resolveFeedbackMessage(plan)
}

describe('session feedback planning', () => {
    test('plans equivalent visual and accessible capture feedback', () => {
        const plan = planSessionFeedback({ type: 'capture-activated' })

        expect(plan).toEqual({
            disposition: 'message',
            message: { id: 'capture-activated', parameters: {} },
            priority: 'normal',
            repetition: 'replace',
            interruption: 'none',
            channels: {
                visual: true,
                accessible: 'polite',
            },
        })
        expect(resolvePlannedMessage(plan)).toBe('Captura de acordes ativada.')
    })

    test('assigns interruption and repetition policies to important facts', () => {
        const interrupted = planSessionFeedback({
            type: 'capture-interrupted',
            cause: 'focus-loss',
            policy: 'discard',
        })
        const rejected = planSessionFeedback({
            type: 'session-input-rejected',
            reason: 'capture-inactive',
        })

        expect(interrupted).toMatchObject({
            disposition: 'message',
            priority: 'high',
            repetition: 'replace',
            interruption: 'lower-priority',
            channels: { visual: true, accessible: 'polite' },
        })
        expect(resolvePlannedMessage(interrupted)).toBe(
            'Captura interrompida porque a área de digitação perdeu o foco; o acorde incompleto foi descartado.',
        )
        expect(rejected).toMatchObject({
            priority: 'high',
            repetition: 'suppress',
            interruption: 'none',
        })
        expect(resolvePlannedMessage(rejected)).toBe(
            'Entrada ignorada porque a captura está inativa.',
        )
    })

    test('keeps frequent document production silent in status channels', () => {
        const plan = planSessionFeedback({
            type: 'operation-produced',
            operation: {
                type: 'confirm-cell',
                cell: createBrailleCell([1]),
            },
        })

        expect(plan).toEqual({
            disposition: 'silent',
            reason: 'frequent-production',
        })
    })

    test('describes review movement from the semantic position', () => {
        const plan = planSessionFeedback({
            type: 'review-position-moved',
            direction: 'right',
            position: { sheet: 0, row: 1, column: 2 },
        })

        expect(resolvePlannedMessage(plan)).toBe(
            'Revisão movida para linha 2, coluna 3.',
        )
        expect(plan).toMatchObject({
            priority: 'normal',
            repetition: 'replace',
            channels: { visual: true, accessible: 'polite' },
        })
    })

    test('keeps same-priority facts from one transition in semantic order', () => {
        const result = coordinateSessionFeedback(
            createFeedbackCoordinatorState(),
            [
                {
                    type: 'chord-discarded',
                    cause: 'interruption',
                    cell: createBrailleCell([1]),
                },
                {
                    type: 'capture-interrupted',
                    cause: 'focus-loss',
                    policy: 'discard',
                },
            ],
        )

        expect(result.plans.map(resolveFeedbackMessage)).toEqual([
            'Acorde incompleto descartado durante a interrupção.',
            'Captura interrompida porque a área de digitação perdeu o foco; o acorde incompleto foi descartado.',
        ])
    })

    test('suppresses repeated facts and lets higher priority interrupt lower priority', () => {
        const first = coordinateSessionFeedback(
            createFeedbackCoordinatorState(),
            [
                {
                    type: 'session-input-rejected',
                    reason: 'capture-inactive',
                },
            ],
        )
        const repeated = coordinateSessionFeedback(first.state, [
            {
                type: 'session-input-rejected',
                reason: 'capture-inactive',
            },
        ])
        const interrupted = coordinateSessionFeedback(repeated.state, [
            { type: 'capture-activated' },
            {
                type: 'capture-interrupted',
                cause: 'pause',
                policy: 'discard',
            },
        ])

        expect(first.plans).toHaveLength(1)
        expect(repeated.plans).toEqual([])
        expect(interrupted.plans.map(resolveFeedbackMessage)).toEqual([
            'Captura interrompida por solicitação da pessoa usuária; o acorde incompleto foi descartado.',
        ])
    })
})
