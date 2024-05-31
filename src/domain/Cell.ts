import { Option, fromNullable } from "fp-ts/lib/Option";
import { Map } from "immutable";

export enum Cell {
    C0,

    C1, C2, C3, C4, C5, C6,

    C12, C13, C14, C15, C16,
    C23, C24, C25, C26,
    C34, C35, C36,
    C45, C46,
    C56,

    C123, C124, C125, C126, C134, C135, C136, C145, C146, C156,
    C234, C235, C236, C245, C246, C256,
    C345, C346, C356,
    C456,

    C1234, C1235, C1236, C1245, C1246, C1256, C1345, C1346, C1356, C1456,
    C2345, C2346, C2356, C2456,
    C3456,

    C12345, C12346, C12356, C12456, C13456,
    C23456,

    C123456,
}

export const defaultCellStringMap = Map<Cell, string>([
    [Cell.C0,      `_`],

    [Cell.C1,      `a`],
    [Cell.C12,     `b`],
    [Cell.C14,     `c`],
    [Cell.C145,    `d`],
    [Cell.C15,     `e`],
    [Cell.C124,    `f`],
    [Cell.C1245,   `g`],
    [Cell.C125,    `h`],
    [Cell.C24,     `i`],
    [Cell.C245,    `j`],

    [Cell.C13,     `k`],
    [Cell.C123,    `l`],
    [Cell.C134,    `m`],
    [Cell.C1345,   `n`],
    [Cell.C135,    `o`],
    [Cell.C1234,   `p`],
    [Cell.C12345,  `q`],
    [Cell.C1235,   `r`],
    [Cell.C234,    `s`],
    [Cell.C2345,   `t`],

    [Cell.C136,    `u`],
    [Cell.C1236,   `v`],
    [Cell.C1346,   `x`],
    [Cell.C13456,  `y`],
    [Cell.C1356,   `z`],
    [Cell.C12346,  `ç`],
    [Cell.C123456, `é`],
    [Cell.C12356,  `á`],
    [Cell.C2346,   `è`],
    [Cell.C23456,  `ú`],

    [Cell.C16,     `â`],
    [Cell.C126,    `ê`],
    [Cell.C146,    `ì`],
    [Cell.C1456,   `ô`],
    [Cell.C156,    `ù`],
    [Cell.C1246,   `à`],
    [Cell.C12456,  `ñ`],
    [Cell.C1256,   `ü`],
    [Cell.C246,    `õ`],
    [Cell.C2456,   `w`],

    [Cell.C2,      `,`],
    [Cell.C23,     `;`],
    [Cell.C25,     `:`],
    [Cell.C256,    `÷`],
    [Cell.C26,     `?`],
    [Cell.C235,    `!`],
    [Cell.C2356,   `=`],
    [Cell.C236,    `"`],
    [Cell.C35,     `*`],
    [Cell.C356,    `°`],
    
    [Cell.C34,     `í`],
    [Cell.C345,    `ã`],
    [Cell.C346,    `ó`],
    [Cell.C3456,   `#`],
    [Cell.C3,      `.`],
    [Cell.C36,     `-`],

    [Cell.C4,      `^`],
    [Cell.C45,     `~`],
    [Cell.C456,    `|`],
    [Cell.C5,      `D`],
    [Cell.C46,     `M`],
    [Cell.C56,     `$`],
    [Cell.C6,      `'`],
])

export function cellToString(cellStringMap: Map<Cell, string>): (cell: Cell) => Option<string> {
    return cell => fromNullable(cellStringMap.get(cell))
}
