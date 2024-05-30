import { Option, fromNullable } from "fp-ts/lib/Option"
import { Map } from "immutable"

export enum ActionKey {
    ARROW_UP, 
    ARROW_DOWN, 
    ARROW_RIGHT, 
    ARROW_LEFT,
    BACKSPACE,
    ENTER,
    TAB
}

export const defaultCodeActionKeyMap = Map<string, ActionKey>([
    ['ArrowUp', ActionKey.ARROW_UP],
    ['ArrowDown', ActionKey.ARROW_DOWN],
    ['ArrowRight', ActionKey.ARROW_RIGHT],
    ['ArrowLeft', ActionKey.ARROW_LEFT],
    ['Backspace', ActionKey.BACKSPACE],
    // ['Enter', ActionKey.ENTER],
    ['Tab', ActionKey.TAB],
])

export function codeToActionKey(codeActionKeyMap: Map<string, ActionKey>): (code: string) => Option<ActionKey> {
    return code => fromNullable(codeActionKeyMap.get(code))
}