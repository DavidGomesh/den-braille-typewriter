import type { CellImpression } from './impression'

export type GridPosition = Readonly<{
    row: number
    column: number
}>

export type PositionedCellImpression = Readonly<{
    position: GridPosition
    impression: CellImpression
}>

export type BrailleGrid = Readonly<{
    impressions: readonly PositionedCellImpression[]
}>

export type GridResult =
    | Readonly<{
          status: 'recorded'
          grid: BrailleGrid
      }>
    | Readonly<{
          status: 'rejected'
          grid: BrailleGrid
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

export const createBrailleGrid = (): BrailleGrid =>
    Object.freeze({ impressions: Object.freeze([]) })

const positionsAreEqual = (left: GridPosition, right: GridPosition) =>
    left.row === right.row && left.column === right.column

export const getCellImpression = (
    grid: BrailleGrid,
    position: GridPosition,
): CellImpression | undefined =>
    grid.impressions.find((entry) =>
        positionsAreEqual(entry.position, position),
    )?.impression

export const recordCellImpression = (
    grid: BrailleGrid,
    position: GridPosition,
    impression: CellImpression,
): GridResult => {
    if (getCellImpression(grid, position) !== undefined) {
        return Object.freeze({
            status: 'rejected',
            grid,
            error: Object.freeze({
                type: 'position-already-used',
                position,
            }),
        })
    }

    const entry = Object.freeze({ position, impression })
    return Object.freeze({
        status: 'recorded',
        grid: Object.freeze({
            impressions: Object.freeze([...grid.impressions, entry]),
        }),
    })
}
