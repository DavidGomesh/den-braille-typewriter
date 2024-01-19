import { Set } from "immutable";
import { Cell } from "./Cell";

export const A: Cell = Cell.C1
export const B: Cell = Cell.C12
export const C: Cell = Cell.C14
export const D: Cell = Cell.C145
export const E: Cell = Cell.C15
export const F: Cell = Cell.C124
export const G: Cell = Cell.C1245
export const H: Cell = Cell.C125
export const I: Cell = Cell.C24
export const J: Cell = Cell.C245
export const K: Cell = Cell.C13
export const L: Cell = Cell.C123
export const M: Cell = Cell.C134
export const N: Cell = Cell.C1345
export const O: Cell = Cell.C135
export const P: Cell = Cell.C1234
export const Q: Cell = Cell.C12345
export const R: Cell = Cell.C1235
export const S: Cell = Cell.C234
export const T: Cell = Cell.C2345
export const U: Cell = Cell.C136
export const V: Cell = Cell.C1236
export const W: Cell = Cell.C2456
export const X: Cell = Cell.C1346
export const Y: Cell = Cell.C13456
export const Z: Cell = Cell.C1356

export const letters: Set<Cell> = Set([
    A, B, C, D, E, F, G, H, I, J, 
    K, L, M, N, O, P, Q, R, S, T, 
    U, V, W, X, Y, Z,
])

export function isAlphabetical(cell: Cell): boolean {
    return letters.contains(cell)
}