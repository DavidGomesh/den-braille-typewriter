import type { BrailleInterpretation } from '../braille/public'
import type { SessionEvent } from '../session/public'

const interpretedText = (interpretation: BrailleInterpretation): string =>
    interpretation.lines
        .flatMap((line) => line.segments)
        .filter(
            (segment) =>
                segment.status === 'interpreted' && segment.role === 'symbol',
        )
        .map((segment) => segment.text)
        .join('')

/**
 * Resolves the smallest textual reading introduced by one production batch.
 *
 * Editing operations produce no reading. A blank cell receives an explicit
 * name because whitespace alone is not intelligible in speech.
 */
export const resolveAutomaticReading = (
    previous: BrailleInterpretation,
    current: BrailleInterpretation,
    events: readonly SessionEvent[],
): string | undefined => {
    const operation = [...events]
        .reverse()
        .find((event) => event.type === 'operation-produced')
    if (operation?.type !== 'operation-produced') return undefined
    if (operation.operation.type === 'space') return 'espaço'
    if (operation.operation.type !== 'confirm-cell') return undefined

    const before = interpretedText(previous)
    const after = interpretedText(current)
    if (!after.startsWith(before) || after.length <= before.length)
        return undefined
    return after.slice(before.length)
}
