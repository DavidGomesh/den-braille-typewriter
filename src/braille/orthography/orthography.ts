import type {
    BrailleDocument,
    DocumentPosition,
    PositionedCellImpression,
} from '../document/document'

export type OrthographyProfileId = 'portuguese-braille-2018'

export type OrthographyProfile = Readonly<{
    id: OrthographyProfileId
    language: 'pt-BR'
    edition: '2018'
}>

type InterpretationSource = readonly DocumentPosition[]

export type InterpretedIndicatorSegment = Readonly<{
    status: 'interpreted'
    role: 'indicator'
    source: InterpretationSource
    meaning: 'capital-letter' | 'capital-word' | 'number'
}>

export type InterpretedSymbolSegment = Readonly<{
    status: 'interpreted'
    role: 'symbol'
    source: InterpretationSource
    text: string
}>

export type InterpretedSegment =
    InterpretedIndicatorSegment | InterpretedSymbolSegment

export type PendingSegment = Readonly<{
    status: 'pending'
    role: 'indicator'
    meaning: 'capital-letter' | 'capital-word' | 'number'
    source: InterpretationSource
}>

export type AmbiguousSegment = Readonly<{
    status: 'ambiguous'
    role: 'symbol'
    alternatives: readonly string[]
    source: InterpretationSource
}>

export type UnrecognizedSegment = Readonly<{
    status: 'unrecognized'
    source: InterpretationSource
}>

export type InterpretationSegment =
    InterpretedSegment | PendingSegment | AmbiguousSegment | UnrecognizedSegment

export type InterpretationLine = Readonly<{
    segments: readonly InterpretationSegment[]
}>

export type BrailleInterpretation = Readonly<{
    profile: OrthographyProfile
    lines: readonly InterpretationLine[]
}>

type SourceImpression = Readonly<{
    position: DocumentPosition
    impression: PositionedCellImpression['impression']
}>

const letters = new Map<string, string>([
    ['1', 'a'],
    ['12', 'b'],
    ['14', 'c'],
    ['145', 'd'],
    ['15', 'e'],
    ['124', 'f'],
    ['1245', 'g'],
    ['125', 'h'],
    ['24', 'i'],
    ['245', 'j'],
    ['13', 'k'],
    ['123', 'l'],
    ['134', 'm'],
    ['1345', 'n'],
    ['135', 'o'],
    ['1234', 'p'],
    ['12345', 'q'],
    ['1235', 'r'],
    ['234', 's'],
    ['2345', 't'],
    ['136', 'u'],
    ['1236', 'v'],
    ['2456', 'w'],
    ['1346', 'x'],
    ['13456', 'y'],
    ['1356', 'z'],
    ['12346', 'ç'],
    ['123456', 'é'],
    ['12356', 'á'],
    ['23456', 'ú'],
    ['16', 'â'],
    ['126', 'ê'],
    ['1456', 'ô'],
    ['1246', 'à'],
    ['246', 'õ'],
    ['34', 'í'],
    ['345', 'ã'],
    ['346', 'ó'],
])

const symbols = new Map<string, string>([
    ['2', ','],
    ['23', ';'],
    ['25', ':'],
    ['26', '?'],
    ['235', '!'],
    ['36', '-'],
])

const digits = new Map<string, string>([
    ['1', '1'],
    ['12', '2'],
    ['14', '3'],
    ['145', '4'],
    ['15', '5'],
    ['124', '6'],
    ['1245', '7'],
    ['125', '8'],
    ['24', '9'],
    ['245', '0'],
])

const cellKey = (entry: SourceImpression) => entry.impression.cell.dots.join('')

const areAdjacent = (left: SourceImpression, right: SourceImpression) =>
    left.position.sheet === right.position.sheet &&
    left.position.row === right.position.row &&
    left.position.column + 1 === right.position.column

const startsCompleteNumericClass = (
    entries: readonly SourceImpression[],
    separatorIndex: number,
) => {
    let previous = entries[separatorIndex]
    if (previous === undefined) return false

    for (let offset = 1; offset <= 3; offset += 1) {
        const digit = entries[separatorIndex + offset]
        if (
            digit === undefined ||
            !areAdjacent(previous, digit) ||
            !digits.has(cellKey(digit))
        ) {
            return false
        }
        previous = digit
    }

    const following = entries[separatorIndex + 4]
    return (
        following === undefined ||
        !areAdjacent(previous, following) ||
        !digits.has(cellKey(following))
    )
}

const freezeSource = (
    entries: readonly SourceImpression[],
): InterpretationSource => Object.freeze(entries.map((entry) => entry.position))

const interpretedIndicator = (
    meaning: InterpretedIndicatorSegment['meaning'],
    entries: readonly SourceImpression[],
): InterpretedIndicatorSegment =>
    Object.freeze({
        status: 'interpreted',
        role: 'indicator',
        meaning,
        source: freezeSource(entries),
    })

const interpretedSymbol = (
    text: string,
    entries: readonly SourceImpression[],
): InterpretedSymbolSegment =>
    Object.freeze({
        status: 'interpreted',
        role: 'symbol',
        text,
        source: freezeSource(entries),
    })

const pendingIndicator = (
    meaning: PendingSegment['meaning'],
    entries: readonly SourceImpression[],
): PendingSegment =>
    Object.freeze({
        status: 'pending',
        role: 'indicator',
        meaning,
        source: freezeSource(entries),
    })

const sourceLines = (document: BrailleDocument): SourceImpression[][] => {
    const lines: SourceImpression[][] = []
    document.grids.forEach((grid, sheet) => {
        const grouped = new Map<number, PositionedCellImpression[]>()
        grid.impressions.forEach((entry) => {
            const line = grouped.get(entry.position.row) ?? []
            line.push(entry)
            grouped.set(entry.position.row, line)
        })
        const orderedLines = [...grouped.entries()]
        orderedLines
            .sort(([left], [right]) => left - right)
            .forEach(([row, entries]) => {
                lines.push(
                    entries
                        .sort(
                            (left, right) =>
                                left.position.column - right.position.column,
                        )
                        .map((entry) =>
                            Object.freeze({
                                position: Object.freeze({
                                    sheet,
                                    row,
                                    column: entry.position.column,
                                }),
                                impression: entry.impression,
                            }),
                        ),
                )
            })
    })
    return lines
}

const interpretLine = (
    entries: readonly SourceImpression[],
): InterpretationLine => {
    const segments: InterpretationSegment[] = []
    let index = 0

    while (index < entries.length) {
        const current = entries[index]
        if (current === undefined) break
        const key = cellKey(current)

        if (key === '46') {
            const next = entries[index + 1]
            if (
                next !== undefined &&
                areAdjacent(current, next) &&
                cellKey(next) === '46'
            ) {
                const wordEntries: SourceImpression[] = []
                let cursor = index + 2
                while (cursor < entries.length) {
                    const entry = entries[cursor]
                    const previous = entries[cursor - 1]
                    if (
                        entry === undefined ||
                        previous === undefined ||
                        !areAdjacent(previous, entry) ||
                        !letters.has(cellKey(entry))
                    ) {
                        break
                    }
                    wordEntries.push(entry)
                    cursor += 1
                }
                if (wordEntries.length === 0) {
                    segments.push(
                        pendingIndicator('capital-word', [current, next]),
                    )
                    index += 2
                    continue
                }
                segments.push(
                    interpretedIndicator('capital-word', [current, next]),
                )
                wordEntries.forEach((entry) => {
                    const letter = letters.get(cellKey(entry))
                    if (letter !== undefined) {
                        segments.push(
                            interpretedSymbol(letter.toUpperCase(), [
                                current,
                                next,
                                entry,
                            ]),
                        )
                    }
                })
                index = cursor
                continue
            }
            const letter =
                next === undefined || !areAdjacent(current, next)
                    ? undefined
                    : letters.get(cellKey(next))
            if (letter === undefined) {
                segments.push(pendingIndicator('capital-letter', [current]))
                index += 1
                continue
            }
            segments.push(interpretedIndicator('capital-letter', [current]))
            segments.push(
                interpretedSymbol(letter.toUpperCase(), [current, next]),
            )
            index += 2
            continue
        }

        if (key === '3456') {
            const numberEntries: SourceImpression[] = []
            let numberText = ''
            let hasDecimalSeparator = false
            let hasClassSeparator = false
            let digitsInCurrentClass = 0
            let cursor = index + 1
            while (cursor < entries.length) {
                const entry = entries[cursor]
                const previous = entries[cursor - 1]
                if (
                    entry === undefined ||
                    previous === undefined ||
                    !areAdjacent(previous, entry)
                ) {
                    break
                }
                const digit = digits.get(cellKey(entry))
                if (digit !== undefined) {
                    numberEntries.push(entry)
                    numberText += digit
                    digitsInCurrentClass += 1
                    cursor += 1
                    continue
                }
                const following = entries[cursor + 1]
                if (
                    cellKey(entry) === '2' &&
                    numberText.length > 0 &&
                    !hasDecimalSeparator &&
                    (!hasClassSeparator || digitsInCurrentClass === 3) &&
                    following !== undefined &&
                    areAdjacent(entry, following) &&
                    digits.has(cellKey(following))
                ) {
                    numberEntries.push(entry)
                    numberText += ','
                    hasDecimalSeparator = true
                    cursor += 1
                    continue
                }
                if (
                    cellKey(entry) === '3' &&
                    numberText.length > 0 &&
                    !hasDecimalSeparator &&
                    digitsInCurrentClass <= 3 &&
                    startsCompleteNumericClass(entries, cursor) &&
                    following !== undefined &&
                    areAdjacent(entry, following) &&
                    digits.has(cellKey(following))
                ) {
                    numberEntries.push(entry)
                    numberText += ' '
                    hasClassSeparator = true
                    digitsInCurrentClass = 0
                    cursor += 1
                    continue
                }
                break
            }
            if (numberEntries.length === 0) {
                segments.push(pendingIndicator('number', [current]))
                index += 1
                continue
            }
            segments.push(interpretedIndicator('number', [current]))
            segments.push(
                interpretedSymbol(numberText, [current, ...numberEntries]),
            )
            index = cursor
            continue
        }

        if (key === '') {
            segments.push(interpretedSymbol(' ', [current]))
            index += 1
            continue
        }

        if (key === '3') {
            segments.push(
                Object.freeze({
                    status: 'ambiguous',
                    role: 'symbol',
                    alternatives: Object.freeze(['.', "'"]),
                    source: freezeSource([current]),
                }),
            )
            index += 1
            continue
        }

        const text = letters.get(key) ?? symbols.get(key)
        segments.push(
            text === undefined
                ? Object.freeze({
                      status: 'unrecognized',
                      source: freezeSource([current]),
                  })
                : interpretedSymbol(text, [current]),
        )
        index += 1
    }

    return Object.freeze({ segments: Object.freeze(segments) })
}

export const createOrthographyProfile = (
    id: OrthographyProfileId,
): OrthographyProfile => {
    if (id !== 'portuguese-braille-2018') {
        throw new RangeError(`Unknown Braille orthography profile: ${id}`)
    }
    return Object.freeze({ id, language: 'pt-BR', edition: '2018' })
}

export const interpretBrailleDocument = (
    document: BrailleDocument,
    profile: OrthographyProfile,
): BrailleInterpretation =>
    Object.freeze({
        profile,
        lines: Object.freeze(sourceLines(document).map(interpretLine)),
    })
