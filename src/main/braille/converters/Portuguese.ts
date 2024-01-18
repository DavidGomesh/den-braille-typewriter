import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from "../Alphabet"
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