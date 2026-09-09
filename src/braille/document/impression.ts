import {
    createBrailleCell,
    type BrailleCell,
    type BrailleDot,
} from '../machine/values'

/**
 * The physical state recorded at one used grid position.
 *
 * Raised dots and erased traces are disjoint. A cell with neither still records
 * an explicit space and is not equivalent to an absent grid position.
 */
export type CellImpression = Readonly<{
    cell: BrailleCell
    erasedDots: readonly BrailleDot[]
}>

/**
 * Creates an immutable cell impression with canonical erased traces.
 *
 * Duplicate erased dots are removed and the remainder are sorted.
 *
 * @throws RangeError
 * Thrown when a dot is both raised in `cell` and present in `erasedDots`.
 */
export const createCellImpression = (
    cell: BrailleCell = createBrailleCell(),
    erasedDots: readonly BrailleDot[] = [],
): CellImpression => {
    const overlappingDot = erasedDots.find((dot) => cell.dots.includes(dot))
    if (overlappingDot !== undefined) {
        throw new RangeError(
            `A Braille dot cannot be both raised and erased: ${overlappingDot}`,
        )
    }

    return Object.freeze({
        cell,
        erasedDots: Object.freeze([...new Set(erasedDots)].sort()),
    })
}
