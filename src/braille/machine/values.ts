export type BrailleDot = 1 | 2 | 3 | 4 | 5 | 6

export type BrailleCell = Readonly<{
    dots: readonly BrailleDot[]
}>

export const createBrailleDot = (position: number): BrailleDot => {
    if (!Number.isInteger(position) || position < 1 || position > 6) {
        throw new RangeError(`Invalid Braille dot position: ${position}`)
    }

    return position as BrailleDot
}

export const createBrailleCell = (
    positions: readonly number[] = [],
): BrailleCell => {
    const dots = [...new Set(positions.map(createBrailleDot))].sort(
        (a, b) => a - b,
    )

    return Object.freeze({ dots: Object.freeze(dots) })
}
