import { Set } from "immutable";
import { A, B, C, D, E, F, G, H, I, J } from "./Alphabet";
import { Cell } from "./Cell";

export const Number: Cell = Cell.C3456
export const NUM: Cell = Number

export const _1: Cell = A
export const _2: Cell = B
export const _3: Cell = C
export const _4: Cell = D
export const _5: Cell = E
export const _6: Cell = F
export const _7: Cell = G
export const _8: Cell = H
export const _9: Cell = I
export const _0: Cell = J

export const numbers: Set<Cell> = Set([
    _1, _2, _3, _4, _5, _6, _7, _8, _9, _0,
])

export function isNumber(cell: Cell): boolean {
    return numbers.contains(cell)
}