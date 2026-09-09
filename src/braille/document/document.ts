import type { CellImpression } from './impression'

export type GridPosition = Readonly<{
    row: number
    column: number
}>

export type PositionedCellImpression = Readonly<{
    position: GridPosition
    impression: CellImpression
}>

export type BrailleDocument = Readonly<{
    impressions: readonly PositionedCellImpression[]
}>

export type DocumentResult =
    | Readonly<{
          status: 'recorded'
          document: BrailleDocument
      }>
    | Readonly<{
          status: 'rejected'
          document: BrailleDocument
          error: Readonly<{
              type: 'position-already-used'
              position: GridPosition
          }>
      }>

const assertCoordinate = (name: string, value: number) => {
    if (!Number.isInteger(value) || value < 0) {
        throw new RangeError(`Invalid grid ${name}: ${value}`)
    }
}

export const createGridPosition = (
    row: number,
    column: number,
): GridPosition => {
    assertCoordinate('row', row)
    assertCoordinate('column', column)
    return Object.freeze({ row, column })
}

export const createBrailleDocument = (): BrailleDocument =>
    Object.freeze({ impressions: Object.freeze([]) })

const positionsAreEqual = (left: GridPosition, right: GridPosition) =>
    left.row === right.row && left.column === right.column

export const getCellImpression = (
    document: BrailleDocument,
    position: GridPosition,
): CellImpression | undefined =>
    document.impressions.find((entry) =>
        positionsAreEqual(entry.position, position),
    )?.impression

export const recordCellImpression = (
    document: BrailleDocument,
    position: GridPosition,
    impression: CellImpression,
): DocumentResult => {
    if (getCellImpression(document, position) !== undefined) {
        return Object.freeze({
            status: 'rejected',
            document,
            error: Object.freeze({
                type: 'position-already-used',
                position,
            }),
        })
    }

    const entry = Object.freeze({ position, impression })
    return Object.freeze({
        status: 'recorded',
        document: Object.freeze({
            impressions: Object.freeze([...document.impressions, entry]),
        }),
    })
}
