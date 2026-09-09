/** One of the six numbered positions in a Braille cell. */
export type BrailleDot = 1 | 2 | 3 | 4 | 5 | 6

/** An immutable Braille cell with distinct dots in ascending order. */
export type BrailleCell = Readonly<{
    dots: readonly BrailleDot[]
}>

/**
 * Validates a numeric position as one of the six Braille dots.
 *
 * @throws RangeError
 * Thrown when `position` is not an integer from 1 through 6.
 */
export const createBrailleDot = (position: number): BrailleDot => {
    if (!Number.isInteger(position) || position < 1 || position > 6) {
        throw new RangeError(`Invalid Braille dot position: ${position}`)
    }

    return position as BrailleDot
}

/**
 * Creates the canonical, immutable representation of a Braille cell.
 *
 * Duplicate dots are removed and the remaining dots are sorted. An empty cell
 * is valid and remains distinct from a never-used document position.
 *
 * @throws RangeError
 * Thrown when any position is not an integer from 1 through 6.
 */
export const createBrailleCell = (
    positions: readonly number[] = [],
): BrailleCell => {
    const dots = [...new Set(positions.map(createBrailleDot))].sort(
        (a, b) => a - b,
    )

    return Object.freeze({ dots: Object.freeze(dots) })
}
