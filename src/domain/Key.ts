import { Map, Set } from "immutable";
import { Cell } from "./Cell.ts";

export enum Key {
    DOT1,
    DOT2,
    DOT3,
    DOT4,
    DOT5,
    DOT6,

    SPACE,
    ENTER,
    BACKSPACE,

    CONFIRM,
    TOOGLE_VIEW_MODE,
    INSTRUCTIONS,
    REPEAT_WORD,
    MUTE_OUTPUT_SOUNDS,
    MUTE_KEYBOARD_SOUNDS,

    ARROW_UP,
    ARROW_DOWN,
    ARROW_RIGHT,
    ARROW_LEFT,
}



export const codeKeyMap = Map<string, Key>([
    ['KeyF', Key.DOT1],
    ['KeyD', Key.DOT2],
    ['KeyS', Key.DOT3],
    ['KeyJ', Key.DOT4],
    ['KeyK', Key.DOT5],
    ['KeyL', Key.DOT6],
    
    ['Backspace', Key.BACKSPACE],
    ['KeyQ', Key.ENTER],
    ['Space', Key.SPACE],

    ['Enter', Key.CONFIRM],
    ['KeyT', Key.TOOGLE_VIEW_MODE],
    ['KeyI', Key.INSTRUCTIONS],
    ['KeyR', Key.REPEAT_WORD],
    ['KeyO', Key.MUTE_OUTPUT_SOUNDS],
    ['KeyM', Key.MUTE_KEYBOARD_SOUNDS],

    ['ArrowUp', Key.ARROW_UP],
    ['ArrowDown', Key.ARROW_DOWN],
    ['ArrowRight', Key.ARROW_RIGHT],
    ['ArrowLeft', Key.ARROW_LEFT],
])

export function isMappedKey(code: string) {
    return codeKeyMap.has(code)
}

export function codeToKey(code: string) {
    const key = codeKeyMap.get(code)

    if (key === null) {
        throw Error(`Can't to convert ${code} to a Key`)
    }

    return key as Key
}



const actionKeys = Set([
    Key.CONFIRM, Key.TOOGLE_VIEW_MODE, Key.INSTRUCTIONS, Key.REPEAT_WORD, Key.MUTE_OUTPUT_SOUNDS, Key.MUTE_KEYBOARD_SOUNDS,
    Key.ARROW_UP, Key.ARROW_DOWN, Key.ARROW_RIGHT, Key.ARROW_LEFT,
])

export function isActionKey(key: Key) {
    return actionKeys.contains(key)
}



const arrowKeys = Set([
    Key.ARROW_UP, Key.ARROW_DOWN, Key.ARROW_RIGHT, Key.ARROW_LEFT,
])

export function isArrowKey(key: Key) {
    return arrowKeys.contains(key)
}



const dotKeys = Set([
    Key.DOT1, Key.DOT2, Key.DOT3,
    Key.DOT4, Key.DOT5, Key.DOT6,
])

export function isDotKey(key: Key) {
    return dotKeys.contains(key)
}



export const keysCellMap = Map<Set<Key>, Cell>([
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
])

export function canConvertKeysToCell(keys: Set<Key>) {
    return keysCellMap.has(keys)
}

export function keysToCell(keys: Set<Key>) {
    const cell = keysCellMap.get(keys)

    if (cell === null) {
        throw Error(`Can't to convert ${keys} to a Cell`)
    }

    return cell as Cell
}
