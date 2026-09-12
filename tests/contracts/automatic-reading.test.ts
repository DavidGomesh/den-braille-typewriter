import { describe, expect, test } from 'vitest'

import type { BrailleInterpretation } from '../../src/braille/public'
import { resolveAutomaticReading } from '../../src/feedback/public'

const interpretation = (text: string): BrailleInterpretation => ({
    profile: {
        id: 'portuguese-braille-2018',
        language: 'pt-BR',
        edition: '2018',
    },
    lines: [
        {
            segments: [...text].map((symbol, column) => ({
                status: 'interpreted' as const,
                role: 'symbol' as const,
                source: [{ sheet: 0, row: 0, column }],
                text: symbol,
            })),
        },
    ],
})

describe('automatic production reading', () => {
    test('reads the newly interpreted symbol after cell production', () => {
        expect(
            resolveAutomaticReading(interpretation('a'), interpretation('ab'), [
                {
                    type: 'operation-produced',
                    operation: {
                        type: 'confirm-cell',
                        cell: { dots: [1, 2] },
                    },
                },
            ]),
        ).toBe('b')
    })

    test('names an explicit blank cell and ignores editing operations', () => {
        expect(
            resolveAutomaticReading(interpretation('a'), interpretation('a '), [
                { type: 'operation-produced', operation: { type: 'space' } },
            ]),
        ).toBe('espaço')
        expect(
            resolveAutomaticReading(interpretation('ab'), interpretation('a'), [
                {
                    type: 'operation-produced',
                    operation: { type: 'backspace' },
                },
            ]),
        ).toBeUndefined()
    })
})
