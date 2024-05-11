import React, { KeyboardEvent, useEffect, useState } from 'react'

import { constVoid, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Option } from 'fp-ts/lib/Option'

import { Set } from 'immutable'

import { codeToKey, defaultCodeKeyMap, defaultKeysCellMap, Key, keysToCell } from '../domain/Key.ts'

import Keyboard from '../components/Keyboard.tsx'
import Output, { addText } from '../components/Output.tsx'

import { codeToActionKey, defaultCodeActionKeyMap } from '../domain/ActionKey.ts'
import { cellToString, defaultCellStringMap } from '../domain/Cell.ts'
import '../styles/views/Typewriter.css'

export default function Typewriter() {

    const [currPressedKeys, setCurrPressedKeys] = useState(Set<Key>())
    const [pressedKeys, setPressedKeys] = useState(Set<Key>())

    function getElementById(id: string): Option<HTMLElement> {
        return O.fromNullable(document.getElementById(id))
    }

    function keyPressed(event: KeyboardEvent<HTMLElement>): void {
        pipe(
            O.Do,
            O.bind('_', () => pipe(event.code, codeToActionKey(defaultCodeActionKeyMap))),
            O.fold(
                () => {
                    event.preventDefault()
                    pipe(
                        O.Do,
                        O.bind('key', () => pipe(event.code, codeToKey(defaultCodeKeyMap))),
                        O.map( ({ key }) => {
                            console.log('Key pressed:', key, event.code)
                            setCurrPressedKeys(currPressedKeys.add(key))
                            setPressedKeys(pressedKeys.add(key))
                        })
                    )
                },
                constVoid   
            )
        )
    }

    function keyReleased(event: KeyboardEvent<HTMLElement>): void {
        event.preventDefault()
        pipe(
            O.Do,
            O.bind('key', () => pipe(event.code, codeToKey(defaultCodeKeyMap))),
            O.map( ({ key }) => setCurrPressedKeys(currPressedKeys.remove(key)))
        )
    }

    useEffect(() => {
        pipe(
            O.Do,
            O.bind('_',             () => pipe(currPressedKeys, O.fromPredicate(_ => _.isEmpty()))),
            O.bind('cell',          () => pipe(pressedKeys, keysToCell(defaultKeysCellMap))),
            O.bind('text',  ({ cell }) => pipe(cell, cellToString(defaultCellStringMap))),
            O.bind('textArea',      () => getElementById('test') as Option<HTMLTextAreaElement>),
            O.map(({ textArea, text }) => {
                pipe(textArea, addText(text))
                setPressedKeys(pressedKeys.clear())
            })
        )
    }, [currPressedKeys])

    return (<>
        <main 
            onKeyDown={ keyPressed } 
            onKeyUp={ keyReleased } 
            className='container d-flex flex-column justify-content-center align-items-center border'>
            <Output />
            <Keyboard />
        </main>
    </>)
}