import { Cell } from "./Cell";

export const Empty: Cell = Cell.C0
export const EMP: Cell = Empty
export function isEmpty(cell: Cell): boolean {
    return cell == Empty
}
export function isNotEmpty(cell: Cell): boolean {
    return !isEmpty(cell)
}


export const Capital: Cell = Cell.C46
export const CAP: Cell = Capital
export function isCapital(cell: Cell): boolean {
    return cell == Capital
}