import { List } from "immutable"
import { Cell } from "../Cell.ts"

export default interface Converter {
    convert(cells: List<Cell>): string
}