
import { List } from "immutable"

import { Alphabet, Cell, isCapital, isEmpty } from "./Cell"
import { pipe } from "fp-ts/lib/function"
import { fold } from "fp-ts/lib/Option"
import { fold as foldTuple } from "../fp/Tuples.ts"
import { span, htOption } from "../fp/utils/List.ts"

export function toText(text: List<Cell>): string { 
    function loop(result: string, text: List<Cell>): string {
        return pipe(text, htOption, fold(() => result, t => {

            const cell: Cell = t.first
            const remaing: List<Cell> = t.second

            if (Alphabet.isAlphabet(cell)) {
                return loop(result.concat(toAlphabet(cell)), remaing)
            }

            if (isCapital(cell)) {
                return pipe(remaing, htOption, fold(() => loop(result, remaing), foldTuple(
                    (nc, rem) => (!isCapital(nc) ? 
                        loop(result.concat(toUpper(toText(List([nc])))), rem) : (
                            pipe(rem, span(_ => !isEmpty(_)), foldTuple(
                                (ut, rt) => loop(result.concat(toUpper(toText(ut))), rt)
                            ))
                        )
                    )
                )))
            }

            if (isEmpty(cell)) {
                return loop(result.concat(" "), remaing)
            }

            return loop(result, remaing)
        }))
    }

    return loop("", text)
}

function toUpper(str: string): string {
    return str.toUpperCase()
}

function toAlphabet(cell: Cell): string {
    if (!Alphabet.isAlphabet(cell)) { return "" } else switch (cell) {
        case Alphabet.A: return "a"; case Alphabet.B: return "b"; case Alphabet.C: return "c";
        case Alphabet.D: return "d"; case Alphabet.E: return "e"; case Alphabet.F: return "f";
        case Alphabet.G: return "g"; case Alphabet.H: return "h"; case Alphabet.I: return "i";
        case Alphabet.J: return "j"; case Alphabet.K: return "k"; case Alphabet.L: return "l";
        case Alphabet.M: return "m"; case Alphabet.N: return "n"; case Alphabet.O: return "o";
        case Alphabet.P: return "p"; case Alphabet.Q: return "q"; case Alphabet.R: return "r";
        case Alphabet.S: return "s"; case Alphabet.T: return "t"; case Alphabet.U: return "u";
        case Alphabet.V: return "v"; case Alphabet.W: return "w"; case Alphabet.X: return "x";
        case Alphabet.Y: return "y"; case Alphabet.Z: return "z"; default: return "";
    }
}

