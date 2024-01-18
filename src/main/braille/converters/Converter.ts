
import { List } from "immutable"

import { Cell } from "../Cell.ts"
import { pipe } from "fp-ts/lib/function"
import { Option, fold, none, some } from "fp-ts/lib/Option"
import { fold as foldTuple } from "../../fp/Tuples.ts"
import { span, htOption } from "../../fp/utils/List.ts"
import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, isAlphabetical } from "../Alphabet.ts"
import { isCapital, isNotEmpty } from "../Identifiers.ts"
import { isSpace } from "../Symbols.ts"

export function toText(text: List<Cell>): string { 
    function loop(result: string, text: List<Cell>): string {
        return pipe(text, htOption, fold(() => result, t => {

            const cell: Cell = t.first
            const remaing: List<Cell> = t.second

            if (isAlphabetical(cell)) {
                return loop(result.concat(pipe(toAlphabet(cell), fold(() => "", _ => _))), remaing)
            }

            if (isCapital(cell)) {
                return pipe(remaing, htOption, fold(() => loop(result, remaing), foldTuple(
                    (nc, rem) => (!isCapital(nc) ? 
                        loop(result.concat(toUpper(toText(List([nc])))), rem) : (
                            pipe(rem, span(_ => isNotEmpty(_)), foldTuple(
                                (ut, rt) => loop(result.concat(toUpper(toText(ut))), rt)
                            ))
                        )
                    )
                )))
            }

            if (isSpace(cell)) {
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

function toAlphabet(cell: Cell): Option<string> {
    return !isAlphabetical(cell) ? none : pipe(cell, _ => { switch (_) {
        case A: return some("a"); case B: return some("b"); case C: return some("c");
        case D: return some("d"); case E: return some("e"); case F: return some("f");
        case G: return some("g"); case H: return some("h"); case I: return some("i");
        case J: return some("j"); case K: return some("k"); case L: return some("l");
        case M: return some("m"); case N: return some("n"); case O: return some("o");
        case P: return some("p"); case Q: return some("q"); case R: return some("r");
        case S: return some("s"); case T: return some("t"); case U: return some("u");
        case V: return some("v"); case W: return some("w"); case X: return some("x");
        case Y: return some("y"); case Z: return some("z"); default: return none;
    }})
}

