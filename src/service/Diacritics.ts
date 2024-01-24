import { Set } from "immutable";
import { Cell } from "./Cell";

export const Á: Cell = Cell.C12356
export const À: Cell = Cell.C1246
export const Â: Cell = Cell.C16
export const Ã: Cell = Cell.C345
export const É: Cell = Cell.C123456
export const Ê: Cell = Cell.C126
export const Í: Cell = Cell.C34
export const Ó: Cell = Cell.C346
export const Ô: Cell = Cell.C1456
export const Õ: Cell = Cell.C246
export const Ú: Cell = Cell.C23456
export const Ç: Cell = Cell.C12346

export const diacritics: Set<Cell> = Set([
    Á, À, Â, Ã, É, Ê, Í, Ó, Ô, Õ, Ú, Ç,
])

export function isDiacritic(cell: Cell): boolean {
    return diacritics.contains(cell)
}