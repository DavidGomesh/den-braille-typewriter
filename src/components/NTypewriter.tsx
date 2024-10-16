import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useCellAudioContext } from '../providers/CellAudioProvider.tsx'
import { useKeyboardAudioContext } from '../providers/KeyboardAudioProvider.tsx'
import NKeyboard, { KeyStatus } from './NKeyboard.tsx'
import NOutput, { addText } from './NOutput.tsx'
import { canConvertKeysToCell, codeToKey, isActionKey, isArrowKey, isDotKey, isMappedKey, Key, keysToCell } from '../domain/Key.ts'
import { Set } from 'immutable'
import { cellToString } from '../domain/Cell.ts'


export default function NTypewriter() {

    const [keyboardMuted, setKeyboardMuted] = useState(false)
    const [outputMuted, setOutputMuted] = useState(false)

    function isKeyboardMuted() {
        return keyboardMuted
    }

    function muteKeyboard() {
        setKeyboardMuted(true)
    }

    function unmuteKeyboard() {
        setKeyboardMuted(false)
    }

    function isOutputMuted() {
        return outputMuted
    }

    function toogleOutputSounds() {
        setOutputMuted(!outputMuted)
    }

    const { playKeyPress, playKeyboardMuted, playKeyboardUnmuted } = useKeyboardAudioContext()
    const { playCellAudio } = useCellAudioContext()


    const output = useRef<HTMLTextAreaElement>()

    function handleKeyPressed(event: KeyboardEvent<HTMLElement>) {
        console.info('Key Pressed: ' + event.code)

        if (!wasKeyPressedWithCtrl(event)) {
            if (isMappedKey(event.code)) {
                handleMappedKeyPressed(event)
            } else {
                handleUnmappedKeyPressed(event)
            }
        }

        console.info('Done!')
    }

    function wasKeyPressedWithCtrl(event: KeyboardEvent<HTMLElement>) {
        return event.ctrlKey
    }

    function handleMappedKeyPressed(event: KeyboardEvent<HTMLElement>) {
        const key = codeToKey(event.code)
        console.info(`Mapped Key Pressed: ${event.code}(${key})`)

        if (isActionKey(key)) {
            handleActionKeyPressed(key, event)
        } else {
            handleTypewriterKeyPressed(key, event)
        }
    }

    function handleActionKeyPressed(key: Key, event: KeyboardEvent<HTMLElement>) {
        console.info(`Action Key Pressed: ${event.code}(${key})`)

        if (isArrowKey(key)) {
            handleArrowKeyPressed(key, event)
        } else {
            handleControlKeyPressed(key, event)
        }
    }

    function handleArrowKeyPressed(key: Key, event: KeyboardEvent<HTMLElement>) {
        console.info(`Arrow Key Pressed: ${event.code}(${key})`)
    }

    const controlKeyHandlerFunctions = {
        [Key.CONFIRM]: handleConfirmKeyPressed,
        [Key.MUTE_OUTPUT_SOUNDS]: handleMuteOutputSoundsKeyPressed,
        [Key.MUTE_KEYBOARD_SOUNDS]: handleMuteKeyboardSoundsKeyPressed,
    }

    function handleControlKeyPressed(key: Key, event: KeyboardEvent<HTMLElement>) {
        console.info(`Control Key Pressed ${event.code}(${key})`)

        event.preventDefault()
        controlKeyHandlerFunctions[key]()
    }

    function handleConfirmKeyPressed() {
        console.info('Confirm Key Pressed')
    }

    function handleMuteOutputSoundsKeyPressed() {
        console.info('Mute Output Sounds Key Pressed')
        toogleOutputSounds()
    }

    function handleMuteKeyboardSoundsKeyPressed() {
        console.info('Mute Keyboard Sounds Key Pressed')

        if (isKeyboardMuted()) {
            unmuteKeyboard()
            playKeyboardUnmuted()
            console.info('Keyboard muted')
            
        } else {
            muteKeyboard()
            playKeyboardMuted()
            console.info('Keyboard unmuted')
        }
    }

    function handleTypewriterKeyPressed(key: Key, event: KeyboardEvent<HTMLElement>) {
        console.info(`Typewriter Key Pressed ${event.code}(${key})`)

        if (isDotKey(key)) {
            handleDotKeyPressed(key, event)
        } else {
            handleBlankKeyPressed(key, event)
        }
    }

    function handleDotKeyPressed(key: Key, event: KeyboardEvent<HTMLElement>) {
        console.info(`Dot Key Pressed: ${key}`)
        event.preventDefault()

        if (noKeysPressed() || pressedKeysContainsDots()) {
            console.info(`Dot Key Pressed Accepted: ${key}`)

            setCurrPressedKeys(currPressedKeys.add(key))
            setPressedKeys(pressedKeys.add(key))

            updatePressedKeyStatus(key)

            if (!isKeyboardMuted()) {
                playKeyPress()
            }
        }
    }

    const blankKeyHandlerFunctions = {
        [Key.SPACE]: handleSpaceKeyPressed,
        [Key.ENTER]: handleEnterKeyPressed,
        [Key.BACKSPACE]: handleBackspaceKeyPressed,
    }

    function handleBlankKeyPressed(key: Key, event: KeyboardEvent<HTMLElement>) {
        console.info(`Blank Key Pressed ${key}`)

        updatePressedKeyStatus(key)
        if (noKeysPressed() || !pressedKeysContainsDots()) {
            setCurrPressedKeys(currPressedKeys.add(key))
            setPressedKeys(pressedKeys.add(key))
            blankKeyHandlerFunctions[key](event)
        }
    }

    function handleSpaceKeyPressed(event: KeyboardEvent<HTMLElement>) {
        event.preventDefault()
        console.info('Space Key Pressed')
        // addText('_', output.current as HTMLTextAreaElement)
    }

    function handleEnterKeyPressed(event: KeyboardEvent<HTMLElement>) {
        event.preventDefault()
        console.info('Enter Key Pressed')
        addText('\n', output.current as HTMLTextAreaElement)
    }

    function handleBackspaceKeyPressed(event: KeyboardEvent<HTMLElement>) {
        console.info('Backspace Key Pressed')
    }

    function handleUnmappedKeyPressed(event: KeyboardEvent<HTMLElement>) {
        console.info(`Unmapped Key Pressed: ${event.code}`)
        event.preventDefault()
    }



    function handleKeyReleased(event: KeyboardEvent<HTMLElement>) {
        console.info('Key Released: ' + event.code)

        if (isMappedKey(event.code)) {
            handleMappedKeyReleased(event)
        }

        console.info('Done!')
    }

    function handleMappedKeyReleased(event: KeyboardEvent<HTMLElement>) {
        const key = codeToKey(event.code)
        console.info(`Mapped Key Released: ${event.code}(${key})`)

        if (!isActionKey(key)) {
            handleTypewriterKeyReleased(key)
        }
    }

    function handleTypewriterKeyReleased(key: Key) {
        console.info(`Typewriter Key Released: ${key}`)

        setCurrPressedKeys(currPressedKeys.remove(key))
        updateReleasedKeyStatus(key)
    }

    const [currPressedKeys, setCurrPressedKeys] = useState(Set<Key>())
    const [pressedKeys, setPressedKeys] = useState(Set<Key>())

    function noKeysPressed() {
        return pressedKeys.isEmpty()
    }

    function pressedKeysContainsDots() {
        return pressedKeys.some(isDotKey)
    }

    function keyAlreadyPressed(key: Key) {
        return pressedKeys.contains(key)
    }

    const initialKeyStatus = {
        [Key.DOT1]: false,
        [Key.DOT2]: false,
        [Key.DOT3]: false,
        [Key.DOT4]: false,
        [Key.DOT5]: false,
        [Key.DOT6]: false,
        [Key.SPACE]: false,
        [Key.ENTER]: false,
        [Key.BACKSPACE]: false
    }

    const [keyStatus, setKeyStatus] = useState(initialKeyStatus)

    function updatePressedKeyStatus(key: Key) {
        console.info('Pressed Key Status Updated: ' + key)
        setKeyStatus({
            ...keyStatus,
            [key]: true
        })
    }

    function updateReleasedKeyStatus(key: Key) {
        console.info('Released Key Status Updated: ' + key)
        setKeyStatus({
            ...keyStatus,
            [key]: false
        })
    }

    useEffect(() => {
        if (noKeyPressedCurrently()) {
            console.info('All keys released')

            if (canConvertKeysToCell(pressedKeys)) {
                console.info('The keys previous pressed can be converted to a cell')
                console.info('Keys previous pressed: ' + pressedKeys)

                const cell = keysToCell(pressedKeys)
                console.info('Keys converted to cell: ' + cell)

                const char = cellToString(cell)
                console.info('Cell converted to string: ' + char)
                addText(char, output.current as HTMLTextAreaElement)
            }

            console.info('Pressed Keys was reseted')
            setPressedKeys(pressedKeys.clear())
        }
    }, [currPressedKeys])

    function noKeyPressedCurrently() {
        return currPressedKeys.isEmpty()
    }

    return (<>
        <div
            id='typewriter'
            className='container d-flex flex-column justify-content-center align-items-center'
            onKeyDown={ handleKeyPressed } onKeyUp={ handleKeyReleased }
            >
            <NOutput reference={output} />
            <NKeyboard keyStatus={keyStatus} />
        </div>
    </>)
}
