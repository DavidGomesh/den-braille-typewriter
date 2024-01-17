import React, { useEffect, useState } from 'react'
import List from '../fp/List.ts'

const validKeys = List.of([83, 68, 70, 74, 75, 76])

export default function Typewriter() {

    const [currPressedKeys, setCurrPressedKeys] = useState(List.empty())
    const [pressedKeys, setPressedKeys] = useState(List.empty())

    const style = {
        backgroundColor: 'cyan',
        width: '500px', 
        height: '500px', 
        border: '1px solid red',
    }

    function keyPressed({keyCode}) {
        if (validKeys.contains(keyCode)) {
            if (!pressedKeys.contains(keyCode)) {
                setPressedKeys(pressedKeys.appended(keyCode))
            }

            if (!currPressedKeys.contains(keyCode)) {
                setCurrPressedKeys(currPressedKeys.appended(keyCode))
            }
        }
    }

    function keyReleased({keyCode}) {
        if (validKeys.contains(keyCode)) {
            setCurrPressedKeys(currPressedKeys.filter(k => k !== keyCode))
        }

    }
    
    useEffect(() => {
        if (currPressedKeys.isEmpty()) {
            console.log("Result: " + pressedKeys.foldLeft("", (acc, k) => acc + ' ' + k))
            setPressedKeys(List.empty())
        }
    }, [currPressedKeys])

    return (<>
        <div onKeyDown={keyPressed} onKeyUp={keyReleased} style={style} tabIndex={0}></div>
    </>)
}