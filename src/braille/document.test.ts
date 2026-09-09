import { describe, expect, test } from 'vitest'

import {
    applyIntent,
    confirmBrailleDocumentReformat,
    createBrailleCell,
    createBrailleDot,
    createBrailleGrid,
    createBrailleDocument,
    createCellImpression,
    createEngineState,
    createGridPosition,
    createPaperConfiguration,
    eraseCellDots,
    getCellImpression,
    getDocumentCellImpression,
    moveReviewPosition,
    applyDocumentOperation,
    prepareBrailleDocumentReformat,
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

describe('Braille document grid', () => {
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
            createBrailleGrid(),
            createGridPosition(0, 0),
            createCellImpression(event.operation.cell),
        )

        expect(result).toMatchObject({
            status: 'recorded',
            grid: {
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
        const unusedGrid = createBrailleGrid()
        const impression = createCellImpression(createBrailleCell([1, 4]))

        expect(getCellImpression(unusedGrid, position)).toBeUndefined()

        const result = recordCellImpression(unusedGrid, position, impression)

        expect(result).toMatchObject({ status: 'recorded' })
        if (result.status !== 'recorded') throw new Error('Expected recording')
        expect(getCellImpression(result.grid, position)).toEqual(impression)
        expect(getCellImpression(unusedGrid, position)).toBeUndefined()
    })

    test('preserves explicit space and erased traces as occupied positions', () => {
        const emptyPosition = createGridPosition(0, 0)
        const tracedPosition = createGridPosition(0, 1)
        const unusedPosition = createGridPosition(0, 2)
        const emptyResult = recordCellImpression(
            createBrailleGrid(),
            emptyPosition,
            createCellImpression(),
        )
        if (emptyResult.status !== 'recorded') {
            throw new Error('Expected explicit space recording')
        }
        const tracedResult = recordCellImpression(
            emptyResult.grid,
            tracedPosition,
            createCellImpression(createBrailleCell(), [createBrailleDot(3)]),
        )
        if (tracedResult.status !== 'recorded') {
            throw new Error('Expected erased trace recording')
        }

        expect(getCellImpression(tracedResult.grid, emptyPosition)).toEqual({
            cell: { dots: [] },
            erasedDots: [],
        })
        expect(getCellImpression(tracedResult.grid, tracedPosition)).toEqual({
            cell: { dots: [] },
            erasedDots: [3],
        })
        expect(
            getCellImpression(tracedResult.grid, unusedPosition),
        ).toBeUndefined()
    })

    test('exposes a rejection without replacing an occupied position', () => {
        const position = createGridPosition(1, 1)
        const firstImpression = createCellImpression(createBrailleCell([1]))
        const firstResult = recordCellImpression(
            createBrailleGrid(),
            position,
            firstImpression,
        )
        if (firstResult.status !== 'recorded') {
            throw new Error('Expected initial recording')
        }

        const rejected = recordCellImpression(
            firstResult.grid,
            position,
            createCellImpression(createBrailleCell([2])),
        )

        expect(rejected).toEqual({
            status: 'rejected',
            grid: firstResult.grid,
            error: { type: 'position-already-used', position },
        })
        expect(getCellImpression(firstResult.grid, position)).toEqual(
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

    test('keeps grid state immutable and serializable', () => {
        const result = recordCellImpression(
            createBrailleGrid(),
            createGridPosition(0, 0),
            createCellImpression(createBrailleCell([1, 2])),
        )
        if (result.status !== 'recorded') throw new Error('Expected recording')

        expect(Object.isFrozen(result)).toBe(true)
        expect(Object.isFrozen(result.grid)).toBe(true)
        expect(Object.isFrozen(result.grid.impressions)).toBe(true)
        expect(JSON.parse(JSON.stringify(result.grid))).toEqual({
            impressions: [
                {
                    position: { row: 0, column: 0 },
                    impression: { cell: { dots: [1, 2] }, erasedDots: [] },
                },
            ],
        })
    })
})

describe('Braille document editing and review', () => {
    test('moves editing and review positions independently', () => {
        const document = createBrailleDocument(
            createPaperConfiguration({
                type: 'sheet',
                rows: 4,
                columns: 6,
                margins: { top: 1, right: 1, bottom: 1, left: 1 },
            }),
        )

        const edited = applyDocumentOperation(document, {
            type: 'confirm-cell',
            cell: createBrailleCell([1, 4]),
        })
        const reviewed = moveReviewPosition(edited, 'down')

        expect(edited.editingPosition).toEqual({ sheet: 0, row: 1, column: 2 })
        expect(edited.reviewPosition).toEqual({ sheet: 0, row: 1, column: 1 })
        expect(reviewed.editingPosition).toBe(edited.editingPosition)
        expect(reviewed.reviewPosition).toEqual({
            sheet: 0,
            row: 2,
            column: 1,
        })
        expect(
            getDocumentCellImpression(reviewed, {
                sheet: 0,
                row: 1,
                column: 1,
            }),
        ).toEqual({ cell: { dots: [1, 4] }, erasedDots: [] })
    })

    test('applies machine movements without conflating their meanings', () => {
        const initial = createBrailleDocument(
            createPaperConfiguration({
                type: 'continuous',
                columns: 4,
                margins: { left: 1, right: 1 },
            }),
        )
        const spaced = applyDocumentOperation(initial, { type: 'space' })
        const backed = applyDocumentOperation(spaced, { type: 'backspace' })
        const fed = applyDocumentOperation(backed, { type: 'line-feed' })
        const returned = applyDocumentOperation(fed, {
            type: 'carriage-return',
        })

        expect(
            getDocumentCellImpression(returned, {
                sheet: 0,
                row: 0,
                column: 1,
            }),
        ).toEqual({ cell: { dots: [] }, erasedDots: [] })
        expect(backed.editingPosition).toEqual({
            sheet: 0,
            row: 0,
            column: 1,
        })
        expect(fed.editingPosition).toEqual({
            sheet: 0,
            row: 1,
            column: 1,
        })
        expect(returned.editingPosition).toEqual({
            sheet: 0,
            row: 1,
            column: 1,
        })
    })

    test('continues a finite sheet on a new sheet and continuous paper on a new row', () => {
        const sheet = createBrailleDocument(
            createPaperConfiguration({
                type: 'sheet',
                rows: 1,
                columns: 1,
            }),
        )
        const continuous = createBrailleDocument(
            createPaperConfiguration({ type: 'continuous', columns: 1 }),
        )

        const nextSheet = applyDocumentOperation(sheet, { type: 'space' })
        const nextContinuousRow = applyDocumentOperation(continuous, {
            type: 'space',
        })

        expect(nextSheet.editingPosition).toEqual({
            sheet: 1,
            row: 0,
            column: 0,
        })
        expect(nextSheet.grids).toHaveLength(2)
        expect(nextContinuousRow.editingPosition).toEqual({
            sheet: 0,
            row: 1,
            column: 0,
        })
        expect(nextContinuousRow.grids).toHaveLength(1)
    })

    test('physical erasure preserves traces and allows erased dots to be raised again', () => {
        const initial = createBrailleDocument(
            createPaperConfiguration({ type: 'continuous', columns: 3 }),
        )
        const recorded = applyDocumentOperation(initial, {
            type: 'confirm-cell',
            cell: createBrailleCell([1, 2, 4]),
        })
        const position = { sheet: 0, row: 0, column: 0 } as const
        const erased = eraseCellDots(recorded, position, [
            createBrailleDot(2),
            createBrailleDot(4),
        ])
        const repositioned = applyDocumentOperation(
            applyDocumentOperation(erased, { type: 'backspace' }),
            { type: 'confirm-cell', cell: createBrailleCell([2, 5]) },
        )

        expect(getDocumentCellImpression(erased, position)).toEqual({
            cell: { dots: [1] },
            erasedDots: [2, 4],
        })
        expect(getDocumentCellImpression(repositioned, position)).toEqual({
            cell: { dots: [1, 2, 5] },
            erasedDots: [4],
        })
    })

    test('reformats each old line separately without losing impressions', () => {
        const initial = createBrailleDocument(
            createPaperConfiguration({ type: 'continuous', columns: 4 }),
        )
        const firstLine = [1, 2, 3, 4].reduce(
            (document, dot) =>
                applyDocumentOperation(document, {
                    type: 'confirm-cell',
                    cell: createBrailleCell([dot]),
                }),
            initial,
        )
        const secondLine = applyDocumentOperation(
            applyDocumentOperation(firstLine, { type: 'line-feed' }),
            { type: 'carriage-return' },
        )
        const completed = applyDocumentOperation(secondLine, {
            type: 'confirm-cell',
            cell: createBrailleCell([5]),
        })

        const reformat = prepareBrailleDocumentReformat(
            completed,
            createPaperConfiguration({ type: 'continuous', columns: 3 }),
        )
        const reformatted = confirmBrailleDocumentReformat(reformat)

        expect(completed.paper.columns).toBe(4)
        expect(reformat.document).toBe(completed)
        expect(
            reformatted.grids[0]?.impressions.map(
                ({ position, impression }) => [
                    position.row,
                    position.column,
                    impression.cell.dots,
                ],
            ),
        ).toEqual([
            [0, 0, [1]],
            [0, 1, [2]],
            [0, 2, [3]],
            [1, 0, [4]],
            [3, 0, [5]],
        ])
        expect(reformatted.paper).toMatchObject({
            type: 'continuous',
            columns: 3,
        })
    })

    test('preserves empty sheet boundaries when reformatting to continuous paper', () => {
        const initial = createBrailleDocument(
            createPaperConfiguration({
                type: 'sheet',
                rows: 1,
                columns: 1,
            }),
        )
        const firstSheet = applyDocumentOperation(initial, {
            type: 'confirm-cell',
            cell: createBrailleCell([1]),
        })
        const skippedSheet = applyDocumentOperation(firstSheet, {
            type: 'line-feed',
        })
        const thirdSheet = applyDocumentOperation(skippedSheet, {
            type: 'confirm-cell',
            cell: createBrailleCell([2]),
        })

        const reformatted = confirmBrailleDocumentReformat(
            prepareBrailleDocumentReformat(
                thirdSheet,
                createPaperConfiguration({
                    type: 'continuous',
                    columns: 3,
                    margins: { left: 1, right: 1 },
                }),
            ),
        )

        expect(
            reformatted.grids[0]?.impressions.map(
                ({ position, impression }) => [
                    position.row,
                    position.column,
                    impression.cell.dots,
                ],
            ),
        ).toEqual([
            [0, 1, [1]],
            [2, 1, [2]],
        ])
    })

    test('paginates continuous lines inside the writable area of finite sheets', () => {
        const initial = createBrailleDocument(
            createPaperConfiguration({ type: 'continuous', columns: 3 }),
        )
        const completed = [1, 2, 3].reduce(
            (document, dot) =>
                applyDocumentOperation(document, {
                    type: 'confirm-cell',
                    cell: createBrailleCell([dot]),
                }),
            initial,
        )

        const reformatted = confirmBrailleDocumentReformat(
            prepareBrailleDocumentReformat(
                completed,
                createPaperConfiguration({
                    type: 'sheet',
                    rows: 3,
                    columns: 3,
                    margins: { top: 1, right: 1, bottom: 1, left: 1 },
                    format: 'custom',
                    orientation: 'portrait',
                }),
            ),
        )

        expect(reformatted.grids).toHaveLength(3)
        expect(
            reformatted.grids.map((grid) => grid.impressions[0]?.position),
        ).toEqual([
            { row: 1, column: 1 },
            { row: 1, column: 1 },
            { row: 1, column: 1 },
        ])
        expect(reformatted.paper).toMatchObject({
            type: 'sheet',
            rows: 3,
            columns: 3,
            format: 'custom',
            orientation: 'portrait',
        })
    })

    test('validates that paper configuration leaves a writable grid', () => {
        expect(() =>
            createPaperConfiguration({
                type: 'sheet',
                rows: 2,
                columns: 2,
                margins: { top: 1, bottom: 1 },
            }),
        ).toThrowError('Paper margins leave no writable rows')
        expect(() =>
            createPaperConfiguration({
                type: 'continuous',
                columns: 2,
                margins: { left: 1, right: 1 },
            }),
        ).toThrowError('Paper margins leave no writable columns')
    })

    test('rejects a reformat confirmation that was not prepared', () => {
        const document = createBrailleDocument(
            createPaperConfiguration({ type: 'continuous', columns: 3 }),
        )
        const unprepared = {
            document,
            paper: createPaperConfiguration({
                type: 'continuous',
                columns: 2,
            }),
        }

        expect(() =>
            confirmBrailleDocumentReformat(
                unprepared as Parameters<
                    typeof confirmBrailleDocumentReformat
                >[0],
            ),
        ).toThrowError('Braille document reformat was not prepared')
    })
})
