import { Cell } from "./Cell"
import { Empty } from "./Identifiers"

export const Space: Cell = Empty
export const SPC: Cell = Space
export function isSpace(cell: Cell): boolean {
    return cell == Space
}