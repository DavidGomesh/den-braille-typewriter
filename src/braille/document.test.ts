import { describe, expect, test } from 'vitest'

import {
    applyIntent,
    createBrailleCell,
    createBrailleDot,
    createBrailleDocument,
    createCellImpression,
    createEngineState,
    createGridPosition,
    getCellImpression,
    recordCellImpression,
} from './public'

describe('cell impression', () => {
    test('distinguishes raised dots, erased traces and explicit space', () => {
        const impression = createCellImpression(createBrailleCell([1, 4]), [
            createBrailleDot(2),
            createBrailleDot(5),
        ])

        expect(impression).toEqual({
            cell: { dots: [1, 4] },
            erasedDots: [2, 5],
        })
        expect(createCellImpression()).toEqual({
            cell: { dots: [] },
            erasedDots: [],
        })
        expect(Object.isFrozen(impression)).toBe(true)
        expect(Object.isFrozen(impression.erasedDots)).toBe(true)
    })

    test('rejects a dot that is both raised and erased', () => {
        expect(() =>
            createCellImpression(createBrailleCell([1]), [createBrailleDot(1)]),
        ).toThrowError('A Braille dot cannot be both raised and erased: 1')
    })
})

describe('Braille document', () => {
    test('records a cell confirmed by the engine without textual conversion', () => {
        const dot = createBrailleDot(1)
        const pressed = applyIntent(createEngineState(), {
            type: 'press',
            control: { type: 'dot', dot },
        })
        const released = applyIntent(pressed.state, {
            type: 'release',
            control: { type: 'dot', dot },
        })
        const event = released.events[0]
        if (
            event?.type !== 'operation-produced' ||
            event.operation.type !== 'confirm-cell'
        ) {
            throw new Error('Expected a confirmed cell')
        }

        const result = recordCellImpression(
            createBrailleDocument(),
            createGridPosition(0, 0),
            createCellImpression(event.operation.cell),
        )

        expect(result).toMatchObject({
            status: 'recorded',
            document: {
                impressions: [
                    {
                        impression: {
                            cell: { dots: [1] },
                            erasedDots: [],
                        },
                    },
                ],
            },
        })
    })

    test('records a confirmed cell at an explicit grid position', () => {
        const position = createGridPosition(2, 3)
        const unusedDocument = createBrailleDocument()
        const impression = createCellImpression(createBrailleCell([1, 4]))

        expect(getCellImpression(unusedDocument, position)).toBeUndefined()

        const result = recordCellImpression(
            unusedDocument,
            position,
            impression,
        )

        expect(result).toMatchObject({ status: 'recorded' })
        if (result.status !== 'recorded') throw new Error('Expected recording')
        expect(getCellImpression(result.document, position)).toEqual(impression)
        expect(getCellImpression(unusedDocument, position)).toBeUndefined()
    })

    test('preserves explicit space and erased traces as occupied positions', () => {
        const emptyPosition = createGridPosition(0, 0)
        const tracedPosition = createGridPosition(0, 1)
        const unusedPosition = createGridPosition(0, 2)
        const emptyResult = recordCellImpression(
            createBrailleDocument(),
            emptyPosition,
            createCellImpression(),
        )
        if (emptyResult.status !== 'recorded') {
            throw new Error('Expected explicit space recording')
        }
        const tracedResult = recordCellImpression(
            emptyResult.document,
            tracedPosition,
            createCellImpression(createBrailleCell(), [createBrailleDot(3)]),
        )
        if (tracedResult.status !== 'recorded') {
            throw new Error('Expected erased trace recording')
        }

        expect(getCellImpression(tracedResult.document, emptyPosition)).toEqual(
            { cell: { dots: [] }, erasedDots: [] },
        )
        expect(
            getCellImpression(tracedResult.document, tracedPosition),
        ).toEqual({ cell: { dots: [] }, erasedDots: [3] })
        expect(
            getCellImpression(tracedResult.document, unusedPosition),
        ).toBeUndefined()
    })

    test('exposes a rejection without replacing an occupied position', () => {
        const position = createGridPosition(1, 1)
        const firstImpression = createCellImpression(createBrailleCell([1]))
        const firstResult = recordCellImpression(
            createBrailleDocument(),
            position,
            firstImpression,
        )
        if (firstResult.status !== 'recorded') {
            throw new Error('Expected initial recording')
        }

        const rejected = recordCellImpression(
            firstResult.document,
            position,
            createCellImpression(createBrailleCell([2])),
        )

        expect(rejected).toEqual({
            status: 'rejected',
            document: firstResult.document,
            error: { type: 'position-already-used', position },
        })
        expect(getCellImpression(firstResult.document, position)).toEqual(
            firstImpression,
        )
    })

    test('rejects invalid zero-based grid positions', () => {
        expect(() => createGridPosition(-1, 0)).toThrowError(
            'Invalid grid row: -1',
        )
        expect(() => createGridPosition(0, 1.5)).toThrowError(
            'Invalid grid column: 1.5',
        )
    })

    test('keeps document state immutable and serializable', () => {
        const result = recordCellImpression(
            createBrailleDocument(),
            createGridPosition(0, 0),
            createCellImpression(createBrailleCell([1, 2])),
        )
        if (result.status !== 'recorded') throw new Error('Expected recording')

        expect(Object.isFrozen(result)).toBe(true)
        expect(Object.isFrozen(result.document)).toBe(true)
        expect(Object.isFrozen(result.document.impressions)).toBe(true)
        expect(JSON.parse(JSON.stringify(result.document))).toEqual({
            impressions: [
                {
                    position: { row: 0, column: 0 },
                    impression: { cell: { dots: [1, 2] }, erasedDots: [] },
                },
            ],
        })
    })
})
