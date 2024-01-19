import { COMMA, SEMICOLON, COLON, DOT, APOSTROPHE, QUESTION, EXCLAMATION, HYPHEN, ASTERISK, OPEN_PARENTHESES, CLOSE_PARENTHESES, OPEN_BRACKETS, CLOSE_BRACKETS, QUOTES, DASH, OPEN_PARENTHESES_2, CLOSE_PARENTHESES_2, OPEN_BRACKETS_2, CLOSE_BRACKETS_2, SINGLE_QUOTES, isPunctuation, isCompositePunctuation } from "../Punctuation";
import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from "../Alphabet"
import { Á, À, Â, Ã, É, Ê, Í, Ó, Ô, Õ, Ú, Ç, isDiacritic } from "../Diacritics";
import { Tuple, fold as foldTuple } from "../../fp/Tuples";
import { htOption, span } from "../../fp/utils/List";
import { pipe } from "fp-ts/lib/function";
import { isSpace } from "../Symbols";
import TODO from "../../fp/Utils";
import { Cell } from "../Cell";
import Converter from "./Converter";
import { List, Map } from "immutable";
import { isAlphabetical } from "../Alphabet";
import { isCapital, isNotEmpty } from "../Identifiers";
import { fold as foldOption, none } from "fp-ts/lib/Option";

const empty = ""

export class Portuguese implements Converter {
    convert(cells: List<Cell>): string {
        return toText(empty, cells)
    }
}

function toText(result: string, next: List<Cell>): string {
    return pipe(next, htOption, foldOption(() => result, _ => 
        pipe(_, foldTuple((cell, remaining) => {

            if (isAlphabetical(cell)) {
                return toText(result.concat(toAlphabet(cell)), remaining)
            }

            if (isDiacritic(cell)) {
                return toText(result.concat(toDiacritic(cell)), remaining)
            }

            if (isPunctuation(cell)) {
                return pipe(toPunctuation(cell, remaining), foldTuple((r, nc) => toText(result.concat(r), nc)))
            }

            if (isSpace(cell)) {
                return toText(result.concat(toSpace()), remaining)
            }
            
            if (isCapital(cell)) {
                return pipe(toCapital(remaining), foldTuple((r, nc) => toText(result.concat(r), nc)))
            }


            return toText(result, remaining)
        }))
    ))
}

const alphabet = Map([
    [A, "a"], [B, "b"], [C, "c"], [D, "d"], [E, "e"], [F, "f"],
    [G, "g"], [H, "h"], [I, "i"], [J, "j"], [K, "k"], [L, "l"],
    [M, "m"], [N, "n"], [O, "o"], [P, "p"], [Q, "q"], [R, "r"],
    [S, "s"], [T, "t"], [U, "u"], [V, "v"], [W, "w"], [X, "x"],
    [Y, "y"], [Z, "z"]
])
function toAlphabet(cell: Cell): string {
    const letter = alphabet.get(cell, none)
    return letter == none ? empty : letter as string
}


const diacritics = Map([
    [Á, "á"], [À, "à"], [Â, "â"], [Ã, "ã"], 
    [É, "é"], [Ê, "ê"], [Í, "í"], [Ó, "ó"], 
    [Ô, "ô"], [Õ, "õ"], [Ú, "ú"], [Ç, "ç"],
])
function toDiacritic(cell: Cell): string {
    const diacritic = diacritics.get(cell, none)
    return diacritic == none ? empty : diacritic as string
}


const punctuations = Map([
    [COMMA, ","],
    [SEMICOLON, ";"],
    [COLON, ":"],
    [DOT, "."],
    // [APOSTROPHE, "'"],
    [QUESTION, "?"],
    [EXCLAMATION, "!"],
    [HYPHEN, "-"],
    [ASTERISK, "*"],
    [OPEN_PARENTHESES, "("],
    [CLOSE_PARENTHESES, ")"],
    [OPEN_BRACKETS, "["],
    [CLOSE_BRACKETS, "]"],
    [QUOTES, `"`],
])
const compositePunctuations = Map([
    [DASH, "—"],
    [OPEN_PARENTHESES_2, "("],
    [CLOSE_PARENTHESES_2, ")"],
    [OPEN_BRACKETS_2, "["],
    [CLOSE_BRACKETS_2, "]"],
    [SINGLE_QUOTES, "'"],
    // [QUOTES_VARIATION, "«"],
])
function toPunctuation(cell: Cell, next: List<Cell>): Tuple<string, List<Cell>> {
    return pipe(next, htOption, foldOption(() => Tuple(toSimplePunctuation(cell), next), _ => 
        pipe(_, foldTuple((nextCell, remaining) => {
            const cp = List([cell, nextCell])
            if (isCompositePunctuation(cp)) {
                return Tuple(toCompositePunctuation(cp), remaining)
            } else {
                return Tuple(toSimplePunctuation(cell), next)
            }
        }))
    ))
}

function toSimplePunctuation(cell: Cell): string {
    const punctuation = punctuations.get(cell, none)
    return punctuation == none ? empty : punctuation as string
}

function toCompositePunctuation(cells: List<Cell>): string {
    const punctuation = compositePunctuations.get(cells, none)
    return punctuation == none ? empty : punctuation as string
}







const space = " "
function toSpace(): string {
    return space
}

function toCapital(next: List<Cell>): Tuple<string, List<Cell>> {
    return pipe(next, htOption, foldOption(() => Tuple(empty, next), _ => 
        pipe(_, foldTuple((nextCell, remaining) => {
            
            if (isCapital(nextCell)) {
                return pipe(remaining, span(_ => isNotEmpty(_)), foldTuple((toCap, remaining) => 
                    Tuple(toText(empty, toCap).toUpperCase(), remaining)
                ))
            } else {
                return Tuple(toText(empty, List([nextCell])).toUpperCase(), remaining)
            }
        }))
    ))
}


