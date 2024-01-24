import React, { useEffect, useState } from 'react'

import { List, Set } from 'immutable'
import { pipe } from 'fp-ts/lib/function'
import { fold as foldOption } from 'fp-ts/lib/Option'
import { keyCodeToKey, keysToCell } from '../service/BrailleKeyMap.ts'

import { cellToASCII } from '../service/BrailleASCII.ts'
import { cellToGlyph } from '../service/BrailleGlyph.ts'

import Keyboard, { allKeysReleased, pressKey } from '../components/keyboard/Keyboard.jsx'

export default function Typewriter() {

    const [currPressedKeys, setCurrPressedKeys] = useState(Set([]))
    const [pressedKeys, setPressedKeys] = useState(Set([]))

    const [metabraille, setMetabraille] = useState(List([]))
    const [glyphs, setGlyphs] = useState(List([]))

    const [keysState, setKeysState] = useState(allKeysReleased)

    const style = {
        backgroundColor: 'cyan',
        width: '500px', 
        height: '500px', 
        border: '1px solid red',
    }

    function keyPressed({keyCode}) {
        pipe(keyCode, keyCodeToKey, foldOption(() => null, key => {
            setPressedKeys(pressedKeys.add(key))
            setCurrPressedKeys(currPressedKeys.add(key))
            setKeysState(pressKey(keysState, key))
        }))
    }
    
    function keyReleased({keyCode}) {
        pipe(keyCode, keyCodeToKey, foldOption(() => null, key => {
            setCurrPressedKeys(currPressedKeys.remove(key))
        }))
    }
    
    useEffect(() => {
        console.log("Current Pressed Keys: ")
        console.log(currPressedKeys.reduce((acc, d) => acc.concat(d), ""))

        if (currPressedKeys.isEmpty()) {
            pipe(pressedKeys, keysToCell, foldOption(() => null, cell => {
                pipe(cell, cellToASCII, foldOption(() => "", _ => setMetabraille(metabraille.concat(_))))
                pipe(cell, cellToGlyph, foldOption(() => "", _ => setGlyphs(glyphs.concat(_))))
            }))

            setPressedKeys(Set([]))
            setKeysState(allKeysReleased)
        }
    }, [currPressedKeys])

    return (<>
        <div onKeyDown={keyPressed} onKeyUp={keyReleased} style={style} tabIndex={0}>
            <div style={{fontFamily: 'monospace', fontSize: '18pt'}}>{metabraille.reduce((acc, t) => acc.concat(t), "")}</div>
            <div style={{fontFamily: 'monospace', fontSize: '18pt'}}>{glyphs.reduce((acc, g) => acc.concat(g), "")}</div>
        </div>
        <Keyboard keysState={keysState}/>
    </>)
}