import { List, Set } from 'immutable'
import React, { useEffect, useState } from 'react'
import { dotsToCell, keyToDot } from '../braille/BrailleKeyMap.ts'
import { pipe } from 'fp-ts/lib/function'
import { fold as foldOption } from 'fp-ts/lib/Option'
import { cellToGlyph } from '../braille/BrailleGlyph.ts'
import { cellToASCII } from '../braille/BrailleASCII.ts'

export default function Typewriter() {

    const [currPressedDots, setCurrPressedDots] = useState(Set([]))
    const [pressedDots, setPressedDots] = useState(Set([]))

    const [metabraille, setMetabraille] = useState(List([]))
    const [glyphs, setGlyphs] = useState(List([]))

    const style = {
        backgroundColor: 'cyan',
        width: '500px', 
        height: '500px', 
        border: '1px solid red',
    }

    function keyPressed({keyCode}) {
        pipe(keyCode, keyToDot, foldOption(() => null, dot => {
            setPressedDots(pressedDots.add(dot))
            setCurrPressedDots(currPressedDots.add(dot))
        }))
    }
    
    function keyReleased({keyCode}) {
        pipe(keyCode, keyToDot, foldOption(() => null, dot => {
            setCurrPressedDots(currPressedDots.remove(dot))
        }))
    }
    
    useEffect(() => {
        console.log("Current Pressed Dots: ")
        console.log(currPressedDots.reduce((acc, d) => acc.concat(d), ""))

        if (currPressedDots.isEmpty()) {
            const dots = pressedDots.toList().sort().reduce((acc, d) => acc.concat(d), "")
            pipe(dots, dotsToCell, foldOption(() => null, cell => {
                pipe(cellToASCII(cell), foldOption(() => "", _ => setMetabraille(metabraille.concat(_))))
                pipe(cellToGlyph(cell), foldOption(() => "", _ => setGlyphs(glyphs.concat(_))))
            }))

            setPressedDots(Set([]))
        }
    }, [currPressedDots])

    return (<>
        <div onKeyDown={keyPressed} onKeyUp={keyReleased} style={style} tabIndex={0}>
            <div style={{fontFamily: 'monospace', fontSize: '18pt'}}>{metabraille.reduce((acc, t) => acc.concat(t), "")}</div>
            <div style={{fontFamily: 'monospace', fontSize: '18pt'}}>{glyphs.reduce((acc, g) => acc.concat(g), "")}</div>
        </div>
    </>)
}