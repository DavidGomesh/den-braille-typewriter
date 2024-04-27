import React, { KeyboardEvent, useEffect, useState } from 'react'

import { pipe } from 'fp-ts/lib/function'
import { fold as foldOption, none } from 'fp-ts/lib/Option'

import { Set } from 'immutable'

import { Key } from '../domain/Key.ts'
import { defaultKeyCodeMap, codeToKey, keysToCell } from '../service/BrailleKeyMap.ts'

import Keyboard from '../components/Keyboard.tsx'
import Output, { insertAtSelectionStart, keyToCursorMoviment, moveCursorBy } from '../components/Output.tsx'

import '../styles/views/Typewriter.css'
import { doNothing } from '../utils/Utils.ts'
import { cellToString } from '../service/BrailleASCII.ts'

export default function Typewriter() {

    
    const keyCodeMap = codeToKey(defaultKeyCodeMap)
    
    const [currPressedKeys, setCurrPressedKeys] = useState(Set<Key>())
    const [pressedKeys, setPressedKeys] = useState(Set<Key>())
    
    const [text, setText] = useState("")
    
    const output = <Output text={text} />

    function keyPressed({ code }: KeyboardEvent<HTMLElement>) {
        pipe(code, keyCodeMap, foldOption(doNothing, key => {
            pipe(key, keyToCursorMoviment, foldOption(
                () => {
                    setCurrPressedKeys(currPressedKeys.add(key))
                    setPressedKeys(pressedKeys.add(key))
                },

                cursorMoviment => {
                    pipe(document.getElementById('test') as HTMLTextAreaElement, moveCursorBy(cursorMoviment))
                }
            ))
        }))
    }

    function keyReleased(event: KeyboardEvent<HTMLElement>) {
        // event.preventDefault()
        pipe(event.code, keyCodeMap, foldOption(doNothing, key => {
            setCurrPressedKeys(currPressedKeys.remove(key))
        }))
    }

    useEffect(() => {
        if (currPressedKeys.isEmpty()) {
            pipe(pressedKeys, keysToCell, foldOption(doNothing, cell => 
                pipe(cell, cellToString, foldOption(doNothing, str => {
                    const textarea = document.getElementById('test') as HTMLTextAreaElement
                    pipe(str, insertAtSelectionStart(textarea))
                }))
            ))

            setPressedKeys(Set())
        }
    }, [currPressedKeys])

    return (<>
        <main onKeyDown={ keyPressed } onKeyUp={ keyReleased } className='container d-flex flex-column justify-content-center align-items-center'>
            {output}
            <Keyboard />
        </main>
    </>)
}