import { List, Set } from "immutable";
import { Cell } from "./Cell";

export const COMMA: Cell = Cell.C2
export const SEMICOLON: Cell = Cell.C23
export const COLON: Cell = Cell.C25
export const DOT: Cell = Cell.C3 // Special rules
export const APOSTROPHE: Cell = Cell.C3
export const QUESTION: Cell = Cell.C26
export const EXCLAMATION: Cell = Cell.C235
export const HYPHEN: Cell = Cell.C36 // Special rules
export const ASTERISK: Cell = Cell.C35
export const OPEN_PARENTHESES: Cell = Cell.C126 // Special rules
export const CLOSE_PARENTHESES: Cell = Cell.C345 // Special rules
export const OPEN_BRACKETS: Cell = Cell.C12356 // Special rules
export const CLOSE_BRACKETS: Cell = Cell.C23456 // Special rules
export const QUOTES: Cell = Cell.C236 // Special rules

export const SUSPENSION: List<Cell> = List([DOT, DOT, DOT])
export const DASH: List<Cell> = List([HYPHEN, HYPHEN])
export const OPEN_PARENTHESES_2: List<Cell> = List([OPEN_PARENTHESES, DOT])
export const CLOSE_PARENTHESES_2: List<Cell> = List([DOT, CLOSE_PARENTHESES])
export const OPEN_BRACKETS_2: List<Cell> = List([OPEN_BRACKETS, DOT])
export const CLOSE_BRACKETS_2: List<Cell> = List([DOT, CLOSE_BRACKETS])
export const SINGLE_QUOTES: List<Cell> = List([Cell.C56, QUOTES])
export const QUOTES_VARIATION: List<Cell> = List([Cell.C56, QUOTES])

export const punctuations: Set<Cell> = Set([
    COMMA, SEMICOLON, COLON, DOT, APOSTROPHE,
    QUESTION, EXCLAMATION, HYPHEN, ASTERISK, OPEN_PARENTHESES,
    CLOSE_PARENTHESES, OPEN_BRACKETS, CLOSE_BRACKETS, QUOTES,
    Cell.C56,
])

export const compositePunctuations: Set<List<Cell>> = Set([
    SUSPENSION, DASH, OPEN_PARENTHESES_2, CLOSE_PARENTHESES_2,
    OPEN_BRACKETS_2, CLOSE_BRACKETS_2, SINGLE_QUOTES, QUOTES_VARIATION,
])

export function isPunctuation(cell: Cell): boolean {
    return punctuations.contains(cell)
}

export function isCompositePunctuation(cells: List<Cell>): boolean {
    return compositePunctuations.contains(cells)
}