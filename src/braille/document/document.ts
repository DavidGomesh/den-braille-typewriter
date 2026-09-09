import type { CellImpression } from './impression'
import { createCellImpression } from './impression'
import { createBrailleCell, type BrailleDot } from '../machine/values'
import type { MachineOperation } from '../machine/machine'

/** A zero-based, non-negative position within one Braille grid. */
export type GridPosition = Readonly<{
    row: number
    column: number
}>

/** A used grid position paired with its recorded physical impression. */
export type PositionedCellImpression = Readonly<{
    position: GridPosition
    impression: CellImpression
}>

/**
 * A sparse, immutable collection of used positions.
 *
 * Positions absent from `impressions` have never been used; explicit spaces
 * remain present as empty cell impressions.
 */
export type BrailleGrid = Readonly<{
    impressions: readonly PositionedCellImpression[]
}>

/** The observable result of attempting to occupy a grid position. */
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

/**
 * Creates a validated position within a grid.
 *
 * @throws RangeError
 * Thrown when either coordinate is negative or is not an integer.
 */
export const createGridPosition = (
    row: number,
    column: number,
): GridPosition => {
    assertCoordinate('row', row)
    assertCoordinate('column', column)
    return Object.freeze({ row, column })
}

/** Creates an empty immutable grid in which every position is never used. */
export const createBrailleGrid = (): BrailleGrid =>
    Object.freeze({ impressions: Object.freeze([]) })

const positionsAreEqual = (left: GridPosition, right: GridPosition) =>
    left.row === right.row && left.column === right.column

/**
 * Reads a used grid position without changing the grid.
 *
 * @returns The recorded impression, or `undefined` when the position has never
 * been used.
 */
export const getCellImpression = (
    grid: BrailleGrid,
    position: GridPosition,
): CellImpression | undefined =>
    grid.impressions.find((entry) =>
        positionsAreEqual(entry.position, position),
    )?.impression

/**
 * Records an impression only when the position has never been used.
 *
 * A conflict is returned as `position-already-used`; it preserves the original
 * grid and does not overwrite even an explicit space.
 */
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

/** Non-negative reserved rows and columns at each paper edge. */
export type PaperMargins = Readonly<{
    top: number
    right: number
    bottom: number
    left: number
}>

type PaperDetails = Readonly<{
    columns: number
    margins: PaperMargins
    format?: string
    orientation?: 'portrait' | 'landscape'
}>

/** A finite paper configuration that may continue onto additional sheets. */
export type SheetPaperConfiguration = PaperDetails &
    Readonly<{
        type: 'sheet'
        rows: number
    }>

/** A single-grid paper configuration with unbounded rows. */
export type ContinuousPaperConfiguration = PaperDetails &
    Readonly<{
        type: 'continuous'
    }>

/** The validated geometry shared by every grid in a Braille document. */
export type PaperConfiguration =
    SheetPaperConfiguration | ContinuousPaperConfiguration

type PaperConfigurationInput =
    | Readonly<{
          type: 'sheet'
          rows: number
          columns: number
          margins?: Partial<PaperMargins>
          format?: string
          orientation?: 'portrait' | 'landscape'
      }>
    | Readonly<{
          type: 'continuous'
          columns: number
          margins?: Pick<Partial<PaperMargins>, 'left' | 'right'>
      }>

/** A zero-based coordinate in the ordered grids of a Braille document. */
export type DocumentPosition = Readonly<{
    sheet: number
    row: number
    column: number
}>

/**
 * The immutable source of truth for Braille production and navigation.
 *
 * Editing and review positions evolve independently, and textual
 * interpretation is deliberately excluded.
 */
export type BrailleDocument = Readonly<{
    paper: PaperConfiguration
    grids: readonly BrailleGrid[]
    editingPosition: DocumentPosition
    reviewPosition: DocumentPosition
}>

export type ReviewDirection = 'up' | 'right' | 'down' | 'left'

const preparedReformat = Symbol('prepared Braille document reformat')

/**
 * An opaque, prepared reformat that must be confirmed explicitly.
 *
 * Consumers cannot construct this value without
 * `prepareBrailleDocumentReformat`.
 */
export type BrailleDocumentReformat = Readonly<{
    [preparedReformat]: true
    document: BrailleDocument
    paper: PaperConfiguration
}>

const assertPositiveInteger = (name: string, value: number) => {
    if (!Number.isInteger(value) || value <= 0) {
        throw new RangeError(`Invalid paper ${name}: ${value}`)
    }
}

const freezeMargins = (
    margins: Partial<PaperMargins> | undefined,
): PaperMargins =>
    Object.freeze({
        top: margins?.top ?? 0,
        right: margins?.right ?? 0,
        bottom: margins?.bottom ?? 0,
        left: margins?.left ?? 0,
    })

/**
 * Validates and canonicalizes the geometry for finite or continuous paper.
 *
 * Missing margins default to zero. Continuous paper accepts only horizontal
 * margins because its rows are unbounded.
 *
 * @throws RangeError
 * Thrown for non-positive dimensions, invalid margins, or margins that leave no
 * writable row or column.
 */
export const createPaperConfiguration = (
    input: PaperConfigurationInput,
): PaperConfiguration => {
    assertPositiveInteger('columns', input.columns)
    if (input.type === 'sheet') assertPositiveInteger('rows', input.rows)

    const margins = freezeMargins(input.margins)
    Object.entries(margins).forEach(([name, value]) =>
        assertCoordinate(`margin ${name}`, value),
    )

    if (margins.left + margins.right >= input.columns) {
        throw new RangeError('Paper margins leave no writable columns')
    }
    if (input.type === 'sheet' && margins.top + margins.bottom >= input.rows) {
        throw new RangeError('Paper margins leave no writable rows')
    }

    if (input.type === 'continuous') {
        return Object.freeze({
            type: input.type,
            columns: input.columns,
            margins,
        })
    }

    return Object.freeze({
        type: input.type,
        rows: input.rows,
        columns: input.columns,
        margins,
        ...(input.format === undefined ? {} : { format: input.format }),
        ...(input.orientation === undefined
            ? {}
            : { orientation: input.orientation }),
    })
}

const createDocumentPosition = (
    sheet: number,
    row: number,
    column: number,
): DocumentPosition => Object.freeze({ sheet, row, column })

const firstPosition = (paper: PaperConfiguration): DocumentPosition =>
    createDocumentPosition(0, paper.margins.top, paper.margins.left)

const freezeDocument = (
    paper: PaperConfiguration,
    grids: readonly BrailleGrid[],
    editingPosition: DocumentPosition,
    reviewPosition: DocumentPosition,
): BrailleDocument =>
    Object.freeze({
        paper,
        grids: Object.freeze([...grids]),
        editingPosition,
        reviewPosition,
    })

/**
 * Creates an empty document positioned at the first writable cell.
 *
 * The editing and review positions initially coincide, and the first grid is
 * present even though all its positions are never used.
 */
export const createBrailleDocument = (
    paper: PaperConfiguration,
): BrailleDocument => {
    const position = firstPosition(paper)
    return freezeDocument(paper, [createBrailleGrid()], position, position)
}

/**
 * Reads an impression by document coordinate without changing the document.
 *
 * @returns The recorded impression, or `undefined` for a missing grid or a
 * never-used position.
 *
 * @throws RangeError
 * Thrown when the row or column is negative or is not an integer in an existing
 * grid.
 */
export const getDocumentCellImpression = (
    document: BrailleDocument,
    position: DocumentPosition,
): CellImpression | undefined => {
    const grid = document.grids[position.sheet]
    return grid === undefined
        ? undefined
        : getCellImpression(
              grid,
              createGridPosition(position.row, position.column),
          )
}

const replaceGridImpression = (
    grid: BrailleGrid,
    position: GridPosition,
    impression: CellImpression,
): BrailleGrid => {
    const existing = grid.impressions.some((entry) =>
        positionsAreEqual(entry.position, position),
    )
    const impressions = existing
        ? grid.impressions.map((entry) =>
              positionsAreEqual(entry.position, position)
                  ? Object.freeze({ position, impression })
                  : entry,
          )
        : [...grid.impressions, Object.freeze({ position, impression })]
    return Object.freeze({
        impressions: Object.freeze(impressions),
    })
}

const withImpression = (
    document: BrailleDocument,
    position: DocumentPosition,
    impression: CellImpression,
): BrailleDocument => {
    const grids = [...document.grids]
    while (grids.length <= position.sheet) {
        grids.push(createBrailleGrid())
    }
    const gridPosition = createGridPosition(position.row, position.column)
    grids[position.sheet] = replaceGridImpression(
        grids[position.sheet] ?? createBrailleGrid(),
        gridPosition,
        impression,
    )
    return freezeDocument(
        document.paper,
        grids,
        document.editingPosition,
        document.reviewPosition,
    )
}

const lastColumn = (paper: PaperConfiguration) =>
    paper.columns - paper.margins.right - 1

const lastRow = (paper: SheetPaperConfiguration) =>
    paper.rows - paper.margins.bottom - 1

const advancePosition = (
    position: DocumentPosition,
    paper: PaperConfiguration,
): DocumentPosition => {
    if (position.column < lastColumn(paper)) {
        return createDocumentPosition(
            position.sheet,
            position.row,
            position.column + 1,
        )
    }

    if (paper.type === 'continuous' || position.row < lastRow(paper)) {
        return createDocumentPosition(
            position.sheet,
            position.row + 1,
            paper.margins.left,
        )
    }

    return createDocumentPosition(
        position.sheet + 1,
        paper.margins.top,
        paper.margins.left,
    )
}

const moveToNextLine = (
    position: DocumentPosition,
    paper: PaperConfiguration,
): DocumentPosition => {
    if (paper.type === 'continuous' || position.row < lastRow(paper)) {
        return createDocumentPosition(
            position.sheet,
            position.row + 1,
            position.column,
        )
    }
    return createDocumentPosition(
        position.sheet + 1,
        paper.margins.top,
        position.column,
    )
}

const withEditingPosition = (
    document: BrailleDocument,
    editingPosition: DocumentPosition,
): BrailleDocument => {
    const grids = [...document.grids]
    while (grids.length <= editingPosition.sheet) {
        grids.push(createBrailleGrid())
    }
    return freezeDocument(
        document.paper,
        grids,
        editingPosition,
        document.reviewPosition,
    )
}

const embossCell = (
    current: CellImpression | undefined,
    dots: readonly BrailleDot[],
): CellImpression => {
    const raisedDots = new Set(current?.cell.dots ?? [])
    dots.forEach((dot) => raisedDots.add(dot))
    return createCellImpression(
        createBrailleCell([...raisedDots]),
        (current?.erasedDots ?? []).filter((dot) => !raisedDots.has(dot)),
    )
}

/**
 * Applies a semantic machine operation as an immutable document transition.
 *
 * Confirming a cell raises its dots at the editing position and restores any
 * matching erased traces before advancing. Space records an explicit empty
 * impression. Backspace, line feed, and carriage return move the editing
 * position according to their distinct mechanical meanings.
 */
export const applyDocumentOperation = (
    document: BrailleDocument,
    operation: MachineOperation,
): BrailleDocument => {
    const position = document.editingPosition
    if (operation.type === 'backspace') {
        if (position.column === document.paper.margins.left) return document
        return withEditingPosition(
            document,
            createDocumentPosition(
                position.sheet,
                position.row,
                position.column - 1,
            ),
        )
    }
    if (operation.type === 'line-feed') {
        return withEditingPosition(
            document,
            moveToNextLine(position, document.paper),
        )
    }
    if (operation.type === 'carriage-return') {
        return withEditingPosition(
            document,
            createDocumentPosition(
                position.sheet,
                position.row,
                document.paper.margins.left,
            ),
        )
    }

    const impression =
        operation.type === 'confirm-cell'
            ? embossCell(
                  getDocumentCellImpression(document, position),
                  operation.cell.dots,
              )
            : (getDocumentCellImpression(document, position) ??
              createCellImpression())
    return withEditingPosition(
        withImpression(document, position, impression),
        advancePosition(position, document.paper),
    )
}

/**
 * Physically erases selected raised dots while preserving their traces.
 *
 * Dots that are absent or already erased have no additional effect. A
 * never-used position preserves the original document.
 */
export const eraseCellDots = (
    document: BrailleDocument,
    position: DocumentPosition,
    dots: readonly BrailleDot[],
): BrailleDocument => {
    const current = getDocumentCellImpression(document, position)
    if (current === undefined) return document

    const erased = new Set(current.erasedDots)
    const dotsToErase = new Set(dots)
    current.cell.dots.forEach((dot) => {
        if (dotsToErase.has(dot)) erased.add(dot)
    })
    return withImpression(
        document,
        position,
        createCellImpression(
            createBrailleCell(
                current.cell.dots.filter((dot) => !dotsToErase.has(dot)),
            ),
            [...erased],
        ),
    )
}

/**
 * Moves only the review position within the currently reachable document.
 *
 * Horizontal movement stays inside writable columns. Vertical movement may
 * cross existing finite sheets, but it never creates a sheet or changes the
 * editing position or content.
 */
export const moveReviewPosition = (
    document: BrailleDocument,
    direction: ReviewDirection,
): BrailleDocument => {
    const current = document.reviewPosition
    let next = current
    if (direction === 'left' && current.column > document.paper.margins.left) {
        next = createDocumentPosition(
            current.sheet,
            current.row,
            current.column - 1,
        )
    } else if (
        direction === 'right' &&
        current.column < lastColumn(document.paper)
    ) {
        next = createDocumentPosition(
            current.sheet,
            current.row,
            current.column + 1,
        )
    } else if (direction === 'up') {
        if (current.row > document.paper.margins.top) {
            next = createDocumentPosition(
                current.sheet,
                current.row - 1,
                current.column,
            )
        } else if (current.sheet > 0 && document.paper.type === 'sheet') {
            next = createDocumentPosition(
                current.sheet - 1,
                lastRow(document.paper),
                current.column,
            )
        }
    } else if (direction === 'down') {
        if (
            document.paper.type === 'continuous' ||
            current.row < lastRow(document.paper)
        ) {
            next = createDocumentPosition(
                current.sheet,
                current.row + 1,
                current.column,
            )
        } else if (current.sheet + 1 < document.grids.length) {
            next = createDocumentPosition(
                current.sheet + 1,
                document.paper.margins.top,
                current.column,
            )
        }
    }

    if (next === current) return document
    return freezeDocument(
        document.paper,
        document.grids,
        document.editingPosition,
        next,
    )
}

const writableColumns = (paper: PaperConfiguration) =>
    paper.columns - paper.margins.left - paper.margins.right

const sourceLines = (document: BrailleDocument) => {
    const lines: PositionedCellImpression[][] = []
    document.grids.forEach((grid, sheet) => {
        const grouped = new Map<number, PositionedCellImpression[]>()
        grid.impressions.forEach((entry) => {
            const line = grouped.get(entry.position.row) ?? []
            line.push(entry)
            grouped.set(entry.position.row, line)
        })
        const populatedRows = [...grouped.keys()]
        const isBeforeLastSheet = sheet < document.grids.length - 1
        if (populatedRows.length === 0 && !isBeforeLastSheet) return
        const first = document.paper.margins.top
        const last =
            isBeforeLastSheet && document.paper.type === 'sheet'
                ? lastRow(document.paper)
                : Math.max(...populatedRows)
        for (let row = first; row <= last; row += 1) {
            lines.push(
                (grouped.get(row) ?? []).sort(
                    (left, right) =>
                        left.position.column - right.position.column,
                ),
            )
        }
    })
    return lines
}

const positionForReformattedCell = (
    paper: PaperConfiguration,
    logicalRow: number,
    columnOffset: number,
): DocumentPosition => {
    if (paper.type === 'continuous') {
        return createDocumentPosition(
            0,
            paper.margins.top + logicalRow,
            paper.margins.left + columnOffset,
        )
    }
    const rows = paper.rows - paper.margins.top - paper.margins.bottom
    return createDocumentPosition(
        Math.floor(logicalRow / rows),
        paper.margins.top + (logicalRow % rows),
        paper.margins.left + columnOffset,
    )
}

const reformatBrailleDocument = (
    document: BrailleDocument,
    paper: PaperConfiguration,
): BrailleDocument => {
    let reformatted = createBrailleDocument(paper)
    let logicalRow = 0
    const columns = writableColumns(paper)

    sourceLines(document).forEach((line) => {
        if (line.length === 0) {
            logicalRow += 1
            return
        }
        const sourceLeft = document.paper.margins.left
        let rowsUsed = 1
        line.forEach((entry) => {
            const offset = entry.position.column - sourceLeft
            const rowOffset = Math.floor(offset / columns)
            rowsUsed = Math.max(rowsUsed, rowOffset + 1)
            reformatted = withImpression(
                reformatted,
                positionForReformattedCell(
                    paper,
                    logicalRow + rowOffset,
                    offset % columns,
                ),
                entry.impression,
            )
        })
        logicalRow += rowsUsed
    })

    const position = firstPosition(paper)
    return freezeDocument(paper, reformatted.grids, position, position)
}

/**
 * Prepares an explicit paper change without modifying the source document.
 *
 * The opaque result records both the original document and validated target
 * paper for later confirmation.
 */
export const prepareBrailleDocumentReformat = (
    document: BrailleDocument,
    paper: PaperConfiguration,
): BrailleDocumentReformat =>
    Object.freeze({ [preparedReformat]: true, document, paper })

/**
 * Confirms a prepared reformat and returns a new immutable document.
 *
 * Each old line is wrapped independently into the target writable area. Used
 * impressions and internal empty lines are preserved; content from separate
 * old lines is never recombined.
 */
export const confirmBrailleDocumentReformat = (
    reformat: BrailleDocumentReformat,
): BrailleDocument => {
    if (reformat[preparedReformat] !== true) {
        throw new TypeError('Braille document reformat was not prepared')
    }
    return reformatBrailleDocument(reformat.document, reformat.paper)
}
