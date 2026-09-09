import {
    createBrailleCell,
    type BrailleCell,
    type BrailleDot,
} from '../machine/values'

export type CellImpression = Readonly<{
    cell: BrailleCell
    erasedDots: readonly BrailleDot[]
}>

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
