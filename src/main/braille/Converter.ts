import List from "../fp/List"
import { Alphabet, Cell, isCapital, isEmpty, isNotEmpty } from "./Cell"

export function toText(text: List<Cell>): string { 
    function loop(result: string, text: List<Cell>): string {
        return text.htOption().fold(() => result, t => {
            
            const cell: Cell = t.first
            const remaining: List<Cell> = t.second

            if (Alphabet.isAlphabet(cell)) { 
                return loop(concat(result, toAlphabet(cell)), remaining) 
            }

            if (isCapital(cell)) {
                return remaining.htOption().fold(() => loop(result, remaining), t => t.fold(
                    (nc, rem) => !isCapital(nc) ? 
                        loop(result.concat(toUpper(toText(List.of([nc])))), rem) : (
                        rem.span(_ => !isEmpty(_)).fold(
                            (ut, rt) => loop(result.concat(toUpper(toText(ut))), rt)
                        )
                    )
                ))
            }

            if (cell == Cell.C0) {
                return loop(concat(result, " "), remaining)
            }

            return loop(result, remaining)
            
        })
    }
    return loop("", text)
}

function concat(str1: string, str2: string): string {
    return str1.concat(str2)
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

