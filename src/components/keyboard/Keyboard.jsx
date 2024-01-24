import React from "react"

import { Map } from "immutable"

import { Backspace, Enter, Space, Dot1, Dot2, Dot3, Dot4, Dot5, Dot6 } from "./Keys.jsx"
import { Key, KeyState } from "../../service/BrailleKeyMap.ts"
import { keys } from "fp-ts/lib/Record"

export default function Keyboard({keysState}) {
    return (<>
        <div className='d-flex justify-content-evenly border'>
            <Enter keyState={keysState.get(Key.ENTER, KeyState.RELEASED)} />
            <Dot3 keyState={keysState.get(Key.DOT3, KeyState.RELEASED)} /> 
            <Dot2 keyState={keysState.get(Key.DOT2, KeyState.RELEASED)} /> 
            <Dot1 keyState={keysState.get(Key.DOT1, KeyState.RELEASED)} />
            <Space keyState={keysState.get(Key.SPACE, KeyState.RELEASED)} />
            <Dot4 keyState={keysState.get(Key.DOT4, KeyState.RELEASED)} /> 
            <Dot5 keyState={keysState.get(Key.DOT5, KeyState.RELEASED)} /> 
            <Dot6 keyState={keysState.get(Key.DOT6, KeyState.RELEASED)} />
            <Backspace keyState={keysState.get(Key.BACKSPACE, KeyState.RELEASED)} />
        </div>
    </>)
}

export const allKeysReleased = Map([
    [Key.ENTER, KeyState.RELEASED],
    [Key.DOT3, KeyState.RELEASED],
    [Key.DOT2, KeyState.RELEASED],
    [Key.DOT1, KeyState.RELEASED],
    [Key.SPACE, KeyState.RELEASED],
    [Key.DOT4, KeyState.RELEASED],
    [Key.DOT5, KeyState.RELEASED],
    [Key.DOT6, KeyState.RELEASED],
    [Key.BACKSPACE, KeyState.RELEASED],
])

export function pressKey(keys, key) {
    return keys.set(key, KeyState.PRESSED)
}

export function releaseKey(keys, key) {
    return keys.set(key, KeyState.RELEASED)
}