import React from "react"

import { Map } from "immutable"

import { Backspace, Enter, Space, Dot1, Dot2, Dot3, Dot4, Dot5, Dot6 } from "./Keys.jsx"

export default function Keyboard({pressedKeys}) {
    return (<>
        <div className='d-flex justify-content-evenly border'>
            <Enter pressed={pressedKeys.get('enter', false)} />
            <Dot3 pressed={pressedKeys.get('dot3', false)} /> 
            <Dot2 pressed={pressedKeys.get('dot2', false)} /> 
            <Dot1 pressed={pressedKeys.get('dot1', false)} />
            <Space pressed={pressedKeys.get('space', false)} />
            <Dot4 pressed={pressedKeys.get('dot4', false)} /> 
            <Dot5 pressed={pressedKeys.get('dot5', false)} /> 
            <Dot6 pressed={pressedKeys.get('dot6', false)} />
            <Backspace pressed={pressedKeys.get('backspace', false)} />
        </div>
    </>)
}

export function releasedKeys() {
    return Map({
        enter: false,
        dot3: false,
        dot2: false,
        dot1: false,
        space: false,
        dot4: false,
        dot5: false,
        dot6: false,
        backspace: false,
    })
}

export function pressKey(dot, keys) {
    switch(dot) {
        case '0': return pressSpace(keys)
        case 'e': return pressEnter(keys)
        case '1': return pressDot1(keys)
        case '2': return pressDot2(keys)
        case '3': return pressDot3(keys)
        case '4': return pressDot4(keys)
        case '5': return pressDot5(keys)
        case '6': return pressDot6(keys)
    }
}

export function pressEnter(keys) {
    return keys.set('enter', true)
}

export function pressDot3(keys) {
    return keys.set('dot3', true)
}

export function pressDot2(keys) {
    return keys.set('dot2', true)
}

export function pressDot1(keys) {
    return keys.set('dot1', true)
}

export function pressSpace(keys) {
    return keys.set('space', true)
}

export function pressDot4(keys) {
    return keys.set('dot4', true)
}

export function pressDot5(keys) {
    return keys.set('dot5', true)
}

export function pressDot6(keys) {
    return keys.set('dot6', true)
}

export function pressBackspace(keys) {
    return keys.set('backspace', true)
}

export function releaseKey(dot, keys) {
    switch(dot) {
        case '0': return releaseSpace(keys)
        case 'e': return releaseEnter(keys)
        case '1': return releaseDot1(keys)
        case '2': return releaseDot2(keys)
        case '3': return releaseDot3(keys)
        case '4': return releaseDot4(keys)
        case '5': return releaseDot5(keys)
        case '6': return releaseDot6(keys)
    }
}

export function releaseEnter(keys) {
    return keys.set('enter', false)
}

export function releaseDot3(keys) {
    return keys.set('dot3', false)
}

export function releaseDot2(keys) {
    return keys.set('dot2', false)
}

export function releaseDot1(keys) {
    return keys.set('dot1', false)
}

export function releaseSpace(keys) {
    return keys.set('space', false)
}

export function releaseDot4(keys) {
    return keys.set('dot4', false)
}

export function releaseDot5(keys) {
    return keys.set('dot5', false)
}

export function releaseDot6(keys) {
    return keys.set('dot6', false)
}

export function releaseBackspace(keys) {
    return keys.set('backspace', false)
}