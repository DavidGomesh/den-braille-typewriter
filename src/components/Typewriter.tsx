import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { constVoid, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Option } from 'fp-ts/lib/Option'

import { Map, Set } from 'immutable'

import { codeToKey, codeKeyMap, defaultKeyEmptyStringMap, keysCellMap, DOTS, isDotKey, Key, keysToCell2, keyToString, codeToKey_OLD } from '../domain/Key.ts'

import Keyboard from './Keyboard.tsx'
import Output, { addText } from './Output.tsx'

import { codeToActionKey, defaultCodeActionKeyMap } from '../domain/ActionKey.ts'
import { Cell, cellToString, cellStringMap } from '../domain/Cell.ts'

export default function Typewriter({ keyboardSound = true }) {

    const backspaceRef = useRef()
    const enterRef = useRef()
    const spaceRef = useRef()
    const dot1Ref = useRef()
    const dot2Ref = useRef()
    const dot3Ref = useRef()
    const dot4Ref = useRef()
    const dot5Ref = useRef()
    const dot6Ref = useRef()

    const keyRefMap: Map<Key, any> = Map([
        [Key.BACKSPACE, backspaceRef],
        [Key.ENTER, enterRef],
        [Key.SPACE, spaceRef],
        [Key.DOT1, dot1Ref],
        [Key.DOT2, dot2Ref],
        [Key.DOT3, dot3Ref],
        [Key.DOT4, dot4Ref],
        [Key.DOT5, dot5Ref],
        [Key.DOT6, dot6Ref],
    ])

    function performKeyAnimation(key: Key): void {
        pipe(
            O.fromNullable(keyRefMap.get(key)),
            O.map(keyRef => {
                keyRef.current.classList.add('bg-dark')
                keyRef.current.classList.add('text-light')
            })
        )
    }

    function cancelKeyAnimation(key: Key): void {
        pipe(
            O.fromNullable(keyRefMap.get(key)),
            O.map(keyRef => {
                keyRef.current.classList.remove('bg-dark')
                keyRef.current.classList.remove('text-light')
            })
        )
    }

    const [currPressedKeys, setCurrPressedKeys] = useState(Set<Key>())
    const [pressedKeys, setPressedKeys] = useState(Set<Key>())

    function playKeyPressed() {
    }


    function playCellAudioOld(cell: Cell): void {

        // pipe(
        //     O.fromNullable(cellPlayerMap.get(cell)),
        //     O.map(play => play())
        // )
    }

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
            codeToKey_OLD(codeKeyMap),
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
        // updateKeyHistory(key)
        performKeyAnimation(key)
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
        if (!pressedKeys.contains(key)) {
            playKeyPressed()
        }
        setCurrPressedKeys(currPressedKeys.add(key))
        setPressedKeys(pressedKeys.add(key))
        // updateTypedCells(key)
    }

    function rejectKeyPressed(): void {
        return constVoid()
    }

    function keyReleased(event: KeyboardEvent<HTMLElement>): void {
        event.preventDefault()
        pipe(
            event.code,
            codeToKey_OLD(codeKeyMap),
            O.map(key => {
                setCurrPressedKeys(currPressedKeys.remove(key))
                cancelKeyAnimation(key)
            })
        )
    }   

    useEffect(() => {
        pipe(
            O.Do,
            O.bind('_',    () => pipe(currPressedKeys, O.fromPredicate(_ => _.isEmpty()))),
            O.bind('cell', () => pipe(pressedKeys, keysToCell2(keysCellMap))),
            O.fold(
                ()         => handleNonCellCharacter(),
                ({ cell }) => handleCellCharacter(cell)
            )
        )
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
            cellToString(cellStringMap),
            O.map(addTextToOutput),
            O.map(_ => playCellAudioOld(cell))
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
        <div
            id='typewriter'
            onKeyDown={ keyPressed }
            onKeyUp={ keyReleased }
            className='container d-flex flex-column justify-content-center align-items-center'>
            <Output />
            <Keyboard
                backspaceRef={backspaceRef}
                enterRef={enterRef}
                spaceRef={spaceRef}
                dot1Ref={dot1Ref}
                dot2Ref={dot2Ref}
                dot3Ref={dot3Ref}
                dot4Ref={dot4Ref}
                dot5Ref={dot5Ref}
                dot6Ref={dot6Ref}
            />
        </div>
    </>)
}
