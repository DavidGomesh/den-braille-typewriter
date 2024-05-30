import React, { KeyboardEvent, useEffect, useState } from 'react'

import { constVoid, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Option } from 'fp-ts/lib/Option'

import { Set } from 'immutable'

import { codeToKey, defaultCodeKeyMap, defaultKeyEmptyStringMap, defaultKeysCellMap, DOTS, isDotKey, Key, keysToCell, keyToString } from '../domain/Key.ts'

import Keyboard from '../components/Keyboard.tsx'
import Output, { addText } from '../components/Output.tsx'

import { codeToActionKey, defaultCodeActionKeyMap } from '../domain/ActionKey.ts'
import { Cell, cellToString, defaultCellStringMap } from '../domain/Cell.ts'
import '../styles/views/Typewriter.css'

export default function Typewriter() {

    const [currPressedKeys, setCurrPressedKeys] = useState(Set<Key>())
    const [pressedKeys, setPressedKeys] = useState(Set<Key>())

    function getElementById(id: string): Option<HTMLElement> {
        return O.fromNullable(document.getElementById(id))
    }

    function keyPressed(event: KeyboardEvent<HTMLElement>): void {
        console.log(event.code)
        pipe(
            event.code,
            codeToActionKey(defaultCodeActionKeyMap),
            O.fold(
                () => handleNonActionKeyPressed(event),
                () => handleActionKeyPressed(),
            )
        )
    }

    function handleActionKeyPressed(): void {
        return constVoid()
    }

    function handleNonActionKeyPressed(event: KeyboardEvent<HTMLElement>): void {
        event.preventDefault()
        pipe(
            event.code,
            codeToKey(defaultCodeKeyMap),
            O.fold(
                ()  => handleNotMappedKeyPressed(),
                key => handleTypewriterKeyPressed(key)
            )
        )
    }

    function handleNotMappedKeyPressed(): void {
        return constVoid()
    }

    function handleTypewriterKeyPressed(key: Key): void {
        pipe(
            key,
            O.fromPredicate(_ => isDotKey(_)),
            O.fold(
                () => handleNonDotKeyPressed(key),
                () => handleDotKeyPressed(key),
            )
        )
    }

    function handleNonDotKeyPressed(key: Key): void {
        pipe(
            constVoid(),
            O.fromPredicate(_ => pressedKeys.isEmpty()),
            O.fold(
                () => rejectKeyPressed(),
                () => acceptKeyPressed(key)
            )
        )
    }

    function handleDotKeyPressed(key: Key): void {
        pipe(
            constVoid(),
            O.fromPredicate(_ => pressedKeys.isEmpty() || pressedKeysContainsDots()),
            O.fold(
                () => rejectKeyPressed(),
                () => acceptKeyPressed(key)
            )
        )
    }

    function pressedKeysContainsDots(): boolean {
        return DOTS.some(_ => pressedKeys.contains(_))
    }
    
    function acceptKeyPressed(key: Key): void {
        setCurrPressedKeys(currPressedKeys.add(key))
        setPressedKeys(pressedKeys.add(key))
    }

    function rejectKeyPressed(): void {
        return constVoid()
    }

    function keyReleased(event: KeyboardEvent<HTMLElement>): void {
        event.preventDefault()
        pipe(
            event.code,
            codeToKey(defaultCodeKeyMap),
            O.map(key =>
                setCurrPressedKeys(currPressedKeys.remove(key))
            )
        )
    }

    useEffect(() => {
        // currPressedKeys.map(_ => console.log(_))
        // console.log("CPS:", currPressedKeys.reduce((acc, k) => acc + k, ""))
        // console.log("PS:", pressedKeys.reduce((acc, k) => acc + k, ""))

        pipe(
            O.Do,
            O.bind('_',    () => pipe(currPressedKeys, O.fromPredicate(_ => _.isEmpty()))),
            O.bind('cell', () => pipe(pressedKeys, keysToCell(defaultKeysCellMap))),
            O.fold(
                ()         => handleNonCellCharacter(),
                ({ cell }) => handleCellCharacter(cell)
            )
        )

        // pipe(
        //     O.Do,
        //     O.bind('_',             () => pipe(currPressedKeys, O.fromPredicate(_ => _.isEmpty()))),
        //     O.bind('cell',          () => pipe(pressedKeys, keysToCell(defaultKeysCellMap))),
        //     O.bind('text',  ({ cell }) => pipe(cell, cellToString(defaultCellStringMap))),
        //     O.bind('textArea',      () => getElementById('test') as Option<HTMLTextAreaElement>),
        //     O.map(({ textArea, text }) => {
        //         pipe(textArea, addText(text))
        //         setPressedKeys(pressedKeys.clear())
        //     })
        // )
    }, [currPressedKeys])

    function handleNonCellCharacter(): void {
        pipe(
            pressedKeys, 
            keyToString(defaultKeyEmptyStringMap),
            O.map(addTextToOutput)
        )
    }

    function handleCellCharacter(cell: Cell): void {
        pipe(
            cell, 
            cellToString(defaultCellStringMap),
            O.map(addTextToOutput)
        )
    }
    
    function addTextToOutput(text: string): void {
        pipe(
            getElementById('test') as Option<HTMLTextAreaElement>,
            O.map(textArea => {
                pipe(textArea, addText(text))
                setPressedKeys(pressedKeys.clear())
            })
        )
    }

    return (<>
        <main
            onKeyDown={ keyPressed }
            onKeyUp={ keyReleased }
            className='container d-flex flex-column justify-content-center align-items-center'>
            <Output />
            <Keyboard />
        </main>
    </>)
}