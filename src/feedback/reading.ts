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

const portugueseSpokenCharacters: Readonly<Record<string, string>> =
    Object.freeze({
        á: 'a agudo',
        à: 'a grave',
        â: 'a circunflexo',
        ã: 'a til',
        ç: 'c cedilha',
        é: 'e agudo',
        ê: 'e circunflexo',
        í: 'i agudo',
        ó: 'o agudo',
        ô: 'o circunflexo',
        õ: 'o til',
        ú: 'u agudo',
    })

const resolveSpokenCharacter = (text: string): string =>
    portugueseSpokenCharacters[text] ?? text

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
    return resolveSpokenCharacter(after.slice(before.length))
}
