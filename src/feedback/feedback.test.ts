import { describe, expect, test } from 'vitest'

import { createBrailleCell } from '../braille/public'
import { planSessionFeedback, resolveFeedbackMessage } from './public'

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
        expect(resolveFeedbackMessage(plan)).toBe('Captura de acordes ativada.')
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
        expect(resolveFeedbackMessage(interrupted)).toBe(
            'Captura interrompida porque a área de digitação perdeu o foco; o acorde incompleto foi descartado.',
        )
        expect(rejected).toMatchObject({
            priority: 'high',
            repetition: 'suppress',
            interruption: 'none',
        })
        expect(resolveFeedbackMessage(rejected)).toBe(
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

        expect(resolveFeedbackMessage(plan)).toBe(
            'Revisão movida para linha 2, coluna 3.',
        )
        expect(plan).toMatchObject({
            priority: 'normal',
            repetition: 'replace',
            channels: { visual: true, accessible: 'polite' },
        })
    })
})
