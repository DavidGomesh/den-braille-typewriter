import { describe, expect, test } from 'vitest'

import {
    applyDocumentOperation,
    createBrailleCell,
    createBrailleDocument,
    createBrailleGrid,
    createCellImpression,
    createGridPosition,
    createOrthographyProfile,
    createPaperConfiguration,
    interpretBrailleDocument,
    recordCellImpression,
    type BrailleDocument,
} from './public'

const createDocument = (lines: readonly (readonly (readonly number[])[])[]) => {
    let document = createBrailleDocument(
        createPaperConfiguration({ type: 'continuous', columns: 20 }),
    )

    lines.forEach((cells, line) => {
        if (line > 0) {
            document = applyDocumentOperation(document, { type: 'line-feed' })
            document = applyDocumentOperation(document, {
                type: 'carriage-return',
            })
        }
        cells.forEach((dots) => {
            document = applyDocumentOperation(document, {
                type: 'confirm-cell',
                cell: createBrailleCell(dots),
            })
        })
    })

    return document
}

const source = (...columns: number[]) =>
    columns.map((column) => ({ sheet: 0, row: 0, column }))

describe('Braille orthography', () => {
    test('interprets symbols with an explicit profile and source positions', () => {
        const document = createDocument([[[1], [1, 2], [], [1, 4]]])
        const profile = createOrthographyProfile('portuguese-braille-2018')

        const interpretation = interpretBrailleDocument(document, profile)

        expect(interpretation.profile).toBe(profile)
        expect(interpretation.lines).toEqual([
            {
                segments: [
                    {
                        status: 'interpreted',
                        role: 'symbol',
                        text: 'a',
                        source: source(0),
                    },
                    {
                        status: 'interpreted',
                        role: 'symbol',
                        text: 'b',
                        source: source(1),
                    },
                    {
                        status: 'interpreted',
                        role: 'symbol',
                        text: ' ',
                        source: source(2),
                    },
                    {
                        status: 'interpreted',
                        role: 'symbol',
                        text: 'c',
                        source: source(3),
                    },
                ],
            },
        ])
    })

    test('interprets capital and number indicators as contextual sequences', () => {
        const document = createDocument([
            [[4, 6], [1], [], [3, 4, 5, 6], [1], [1, 2], [2], [1, 5]],
        ])

        const interpretation = interpretBrailleDocument(
            document,
            createOrthographyProfile('portuguese-braille-2018'),
        )

        expect(interpretation.lines[0]?.segments).toEqual([
            {
                status: 'interpreted',
                role: 'indicator',
                meaning: 'capital-letter',
                source: source(0),
            },
            {
                status: 'interpreted',
                role: 'symbol',
                text: 'A',
                source: source(0, 1),
            },
            {
                status: 'interpreted',
                role: 'symbol',
                text: ' ',
                source: source(2),
            },
            {
                status: 'interpreted',
                role: 'indicator',
                meaning: 'number',
                source: source(3),
            },
            {
                status: 'interpreted',
                role: 'symbol',
                text: '12,5',
                source: source(3, 4, 5, 6, 7),
            },
        ])
    })

    test('applies a two-cell capital indicator to a complete word', () => {
        const document = createDocument([
            [
                [4, 6],
                [4, 6],
                [1, 2],
                [1, 4],
            ],
        ])

        const interpretation = interpretBrailleDocument(
            document,
            createOrthographyProfile('portuguese-braille-2018'),
        )

        expect(interpretation.lines[0]?.segments).toEqual([
            {
                status: 'interpreted',
                role: 'indicator',
                meaning: 'capital-word',
                source: source(0, 1),
            },
            {
                status: 'interpreted',
                role: 'symbol',
                text: 'B',
                source: source(0, 1, 2),
            },
            {
                status: 'interpreted',
                role: 'symbol',
                text: 'C',
                source: source(0, 1, 3),
            },
        ])
    })

    test('does not compose a signal across a never-used grid position', () => {
        const base = createBrailleDocument(
            createPaperConfiguration({ type: 'continuous', columns: 4 }),
        )
        const indicator = recordCellImpression(
            createBrailleGrid(),
            createGridPosition(0, 0),
            createCellImpression(createBrailleCell([4, 6])),
        )
        if (indicator.status !== 'recorded') {
            throw new Error('Expected capital indicator recording')
        }
        const letter = recordCellImpression(
            indicator.grid,
            createGridPosition(0, 2),
            createCellImpression(createBrailleCell([1])),
        )
        if (letter.status !== 'recorded') {
            throw new Error('Expected separated letter recording')
        }
        const document: BrailleDocument = Object.freeze({
            ...base,
            grids: Object.freeze([letter.grid]),
        })

        const interpretation = interpretBrailleDocument(
            document,
            createOrthographyProfile('portuguese-braille-2018'),
        )

        expect(interpretation.lines[0]?.segments).toEqual([
            {
                status: 'pending',
                role: 'indicator',
                meaning: 'capital-letter',
                source: source(0),
            },
            {
                status: 'interpreted',
                role: 'symbol',
                text: 'a',
                source: source(2),
            },
        ])
    })

    test('interprets dot three as a class separator inside a number', () => {
        const document = createDocument([
            [
                [3, 4, 5, 6],
                [1],
                [2, 4, 5],
                [3],
                [2, 4, 5],
                [2, 4, 5],
                [2, 4, 5],
            ],
        ])

        const interpretation = interpretBrailleDocument(
            document,
            createOrthographyProfile('portuguese-braille-2018'),
        )

        expect(interpretation.lines[0]?.segments).toEqual([
            {
                status: 'interpreted',
                role: 'indicator',
                meaning: 'number',
                source: source(0),
            },
            {
                status: 'interpreted',
                role: 'symbol',
                text: '10 000',
                source: source(0, 1, 2, 3, 4, 5, 6),
            },
        ])
    })

    test('keeps invalid numeric class separators ambiguous', () => {
        const document = createDocument([
            [[3, 4, 5, 6], [1], [3], [1, 2]],
            [[3, 4, 5, 6], [1], [2], [1, 2], [3], [1, 4]],
        ])

        const interpretation = interpretBrailleDocument(
            document,
            createOrthographyProfile('portuguese-braille-2018'),
        )

        expect(interpretation.lines.map(({ segments }) => segments)).toEqual([
            [
                {
                    status: 'interpreted',
                    role: 'indicator',
                    meaning: 'number',
                    source: source(0),
                },
                {
                    status: 'interpreted',
                    role: 'symbol',
                    text: '1',
                    source: source(0, 1),
                },
                {
                    status: 'ambiguous',
                    role: 'symbol',
                    alternatives: ['.', "'"],
                    source: source(2),
                },
                {
                    status: 'interpreted',
                    role: 'symbol',
                    text: 'b',
                    source: source(3),
                },
            ],
            [
                {
                    status: 'interpreted',
                    role: 'indicator',
                    meaning: 'number',
                    source: [{ sheet: 0, row: 1, column: 0 }],
                },
                {
                    status: 'interpreted',
                    role: 'symbol',
                    text: '1,2',
                    source: [
                        { sheet: 0, row: 1, column: 0 },
                        { sheet: 0, row: 1, column: 1 },
                        { sheet: 0, row: 1, column: 2 },
                        { sheet: 0, row: 1, column: 3 },
                    ],
                },
                {
                    status: 'ambiguous',
                    role: 'symbol',
                    alternatives: ['.', "'"],
                    source: [{ sheet: 0, row: 1, column: 4 }],
                },
                {
                    status: 'interpreted',
                    role: 'symbol',
                    text: 'c',
                    source: [{ sheet: 0, row: 1, column: 5 }],
                },
            ],
        ])
    })

    test('keeps pending, ambiguous and unrecognized segments observable', () => {
        const document = createDocument([[[3]], [[4]], [[4, 6]]])
        const before = JSON.stringify(document)

        const interpretation = interpretBrailleDocument(
            document,
            createOrthographyProfile('portuguese-braille-2018'),
        )

        expect(interpretation.lines).toEqual([
            {
                segments: [
                    {
                        status: 'ambiguous',
                        role: 'symbol',
                        alternatives: ['.', "'"],
                        source: [{ sheet: 0, row: 0, column: 0 }],
                    },
                ],
            },
            {
                segments: [
                    {
                        status: 'unrecognized',
                        source: [{ sheet: 0, row: 1, column: 0 }],
                    },
                ],
            },
            {
                segments: [
                    {
                        status: 'pending',
                        role: 'indicator',
                        meaning: 'capital-letter',
                        source: [{ sheet: 0, row: 2, column: 0 }],
                    },
                ],
            },
        ])
        expect(JSON.stringify(document)).toBe(before)
    })

    test('rejects an unknown orthography profile', () => {
        expect(() =>
            createOrthographyProfile('portuguese-braille-2025' as never),
        ).toThrowError('Unknown Braille orthography profile')
    })
})
