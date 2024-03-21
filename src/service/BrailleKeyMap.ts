import { Option } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/function"
import { Map, Set } from "immutable"

import { Cell } from "../domain/Cell.ts"
import { Key } from "../domain/Key.ts"
import { getOption } from "../utils/Map.ts"

export const defaultKeyCodeMap: Map<number, Key> = Map([
    [8,  Key.BACKSPACE], // Backspace
    [81, Key.ENTER],     // Enter
    [32, Key.SPACE],     // Space
    [70, Key.DOT1],      // F
    [68, Key.DOT2],      // D
    [83, Key.DOT3],      // S
    [74, Key.DOT4],      // J
    [75, Key.DOT5],      // K
    [76, Key.DOT6],      // L
])

export function numberToKey(n: number): (m: Map<number, Key>) => Option<Key> {
    return m => pipe(m, getOption(n))
}

export function keysToCell(keys: Set<Key>): Option<Cell> {
    return pipe(Map([
        [Set([Key.SPACE]),                                                  Cell.C0],
        [Set([Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT6]),                     Cell.C2346],
        [Set([Key.DOT5]),                                                   Cell.C5],
        [Set([Key.DOT3, Key.DOT4, Key.DOT5, Key.DOT6]),                     Cell.C3456],
        [Set([Key.DOT1, Key.DOT2, Key.DOT4, Key.DOT6]),                     Cell.C1246],
        [Set([Key.DOT1, Key.DOT4, Key.DOT6]),                               Cell.C146],
        [Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT6]),           Cell.C12346],
        [Set([Key.DOT3]),                                                   Cell.C3],
        [Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT5, Key.DOT6]),           Cell.C12356],
        [Set([Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT5, Key.DOT6]),           Cell.C23456],
        [Set([Key.DOT1, Key.DOT6]),                                         Cell.C16],
        [Set([Key.DOT3, Key.DOT4, Key.DOT6]),                               Cell.C346],
        [Set([Key.DOT6]),                                                   Cell.C6],
        [Set([Key.DOT3, Key.DOT6]),                                         Cell.C36],
        [Set([Key.DOT4, Key.DOT6]),                                         Cell.C46],
        [Set([Key.DOT3, Key.DOT4]),                                         Cell.C34],
        [Set([Key.DOT3, Key.DOT5, Key.DOT6]),                               Cell.C356],
        [Set([Key.DOT2]),                                                   Cell.C2],
        [Set([Key.DOT2, Key.DOT3]),                                         Cell.C23],
        [Set([Key.DOT2, Key.DOT5]),                                         Cell.C25],
        [Set([Key.DOT2, Key.DOT5, Key.DOT6]),                               Cell.C256],
        [Set([Key.DOT2, Key.DOT6]),                                         Cell.C26],
        [Set([Key.DOT2, Key.DOT3, Key.DOT5]),                               Cell.C235],
        [Set([Key.DOT2, Key.DOT3, Key.DOT5, Key.DOT6]),                     Cell.C2356],
        [Set([Key.DOT2, Key.DOT3, Key.DOT6]),                               Cell.C236],
        [Set([Key.DOT3, Key.DOT5]),                                         Cell.C35],
        [Set([Key.DOT1, Key.DOT5, Key.DOT6]),                               Cell.C156],
        [Set([Key.DOT5, Key.DOT6]),                                         Cell.C56],
        [Set([Key.DOT1, Key.DOT2, Key.DOT6]),                               Cell.C126],
        [Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT5, Key.DOT6]), Cell.C123456],
        [Set([Key.DOT3, Key.DOT4, Key.DOT5]),                               Cell.C345],
        [Set([Key.DOT1, Key.DOT4, Key.DOT5, Key.DOT6]),                     Cell.C1456],
        [Set([Key.DOT4]),                                                   Cell.C4],
        [Set([Key.DOT1]),                                                   Cell.C1],
        [Set([Key.DOT1, Key.DOT2]),                                         Cell.C12],
        [Set([Key.DOT1, Key.DOT4]),                                         Cell.C14],
        [Set([Key.DOT1, Key.DOT4, Key.DOT5]),                               Cell.C145],
        [Set([Key.DOT1, Key.DOT5]),                                         Cell.C15],
        [Set([Key.DOT1, Key.DOT2, Key.DOT4]),                               Cell.C124],
        [Set([Key.DOT1, Key.DOT2, Key.DOT4, Key.DOT5]),                     Cell.C1245],
        [Set([Key.DOT1, Key.DOT2, Key.DOT5]),                               Cell.C125],
        [Set([Key.DOT2, Key.DOT4]),                                         Cell.C24],
        [Set([Key.DOT2, Key.DOT4, Key.DOT5]),                               Cell.C245],
        [Set([Key.DOT1, Key.DOT3]),                                         Cell.C13],
        [Set([Key.DOT1, Key.DOT2, Key.DOT3]),                               Cell.C123],
        [Set([Key.DOT1, Key.DOT3, Key.DOT4]),                               Cell.C134],
        [Set([Key.DOT1, Key.DOT3, Key.DOT4, Key.DOT5]),                     Cell.C1345],
        [Set([Key.DOT1, Key.DOT3, Key.DOT5]),                               Cell.C135],
        [Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT4]),                     Cell.C1234],
        [Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT5]),           Cell.C12345],
        [Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT5]),                     Cell.C1235],
        [Set([Key.DOT2, Key.DOT3, Key.DOT4]),                               Cell.C234],
        [Set([Key.DOT2, Key.DOT3, Key.DOT4, Key.DOT5]),                     Cell.C2345],
        [Set([Key.DOT1, Key.DOT3, Key.DOT6]),                               Cell.C136],
        [Set([Key.DOT1, Key.DOT2, Key.DOT3, Key.DOT6]),                     Cell.C1236],
        [Set([Key.DOT2, Key.DOT4, Key.DOT5, Key.DOT6]),                     Cell.C2456],
        [Set([Key.DOT1, Key.DOT3, Key.DOT4, Key.DOT6]),                     Cell.C1346],
        [Set([Key.DOT1, Key.DOT3, Key.DOT4, Key.DOT5, Key.DOT6]),           Cell.C13456],
        [Set([Key.DOT1, Key.DOT3, Key.DOT5, Key.DOT6]),                     Cell.C1356],
        [Set([Key.DOT2, Key.DOT4, Key.DOT6]),                               Cell.C246],
        [Set([Key.DOT1, Key.DOT2, Key.DOT5, Key.DOT6]),                     Cell.C1256],
        [Set([Key.DOT1, Key.DOT2, Key.DOT4, Key.DOT5, Key.DOT6]),           Cell.C12456],
        [Set([Key.DOT4, Key.DOT5]),                                         Cell.C45],
        [Set([Key.DOT4, Key.DOT5, Key.DOT6]),                               Cell.C456],
    ]), getOption(keys))
}