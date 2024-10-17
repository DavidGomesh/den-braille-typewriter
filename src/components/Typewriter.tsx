import { List, Set } from 'immutable'
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Cell, cellToString, findCell } from '../domain/Cell.ts'
import { canConvertKeysToCell, codeToKey, isActionKey, isArrowKey, isDotKey, isMappedKey, Key, keysToCell } from '../domain/Key.ts'
import NKeyboard from './Keyboard.tsx'
import NOutput, { addTextToTextArea, getPreviousCharacter } from './Output.tsx'
import { useAudioContext } from '../providers/AudioProvider.tsx'
import { RandomWord } from '../views/modes/Challenge.tsx'

interface TypewriterProps {
    challengeMode: boolean,
    randomWord: RandomWord | undefined
    onEnterPressed: (outputValue: string) => void | undefined
}

export default function Typewriter({ challengeMode = false, randomWord = undefined, onEnterPressed }: TypewriterProps) {

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

    function muteOutput() {
        setOutputMuted(true)
    }

    function unmuteOutput() {
        setOutputMuted(false)
    }

    const { 
        playKeyPress, playKeyboardMuted, playKeyboardUnmuted,
        playCellAudio, playOutputMuted, playOutputUnmuted, playEnterAudio, playBrailleViewAudio, playInkViewAudio
    } = useAudioContext()

    const output = useRef<HTMLTextAreaElement>()
    const [showBraille, setShowBraille] = useState(true)

    const [typedCells, setTypedCells] = useState(List<Cell>())

    function handleKeyPressed(event: KeyboardEvent<HTMLElement>) {
        console.info('Key Pressed: ' + event.code)

        if (!wasKeyPressedWithCtrl(event)) {
            if (isMappedKey(event.code)) {
                handleMappedKeyPressed(event)
            } else {
                handleUnmappedKeyPressed(event)
            }
        }

        console.info('---------------------------')
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
        [Key.TOOGLE_VIEW_MODE]: handleToogleViewModeKeyPressed,
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
        onEnterPressed((output.current as HTMLTextAreaElement).value)
    }
    
    function handleToogleViewModeKeyPressed() {
        console.info('Toogle View Mode Key Pressed')

        if (showBraille) {
            setShowBraille(false)
            playInkViewAudio()

        } else {
            setShowBraille(true)
            playBrailleViewAudio()
        }

    }

    function handleMuteOutputSoundsKeyPressed() {
        console.info('Mute Output Sounds Key Pressed')
        
        if (isOutputMuted()) {
            unmuteOutput()
            playOutputUnmuted()
            console.info('Output muted')
            
        } else {
            muteOutput()
            playOutputMuted()
            console.info('Output unmuted')
        }
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

        if (noKeysPressed() || !pressedKeysContainsDots()) {
            setCurrPressedKeys(currPressedKeys.add(key))
            setPressedKeys(pressedKeys.add(key))

            blankKeyHandlerFunctions[key](event)
            updatePressedKeyStatus(key)

            if (!isKeyboardMuted()) {
                playKeyPress()
            }
        } else {
            event.preventDefault()
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
        addTextToTextArea('\n', output.current as HTMLTextAreaElement)

        if (!isOutputMuted()) {
            playEnterAudio()
        }
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

        console.info('----------------------------')
    }

    function handleMappedKeyReleased(event: KeyboardEvent<HTMLElement>) {
        const key = codeToKey(event.code)
        console.info(`Mapped Key Released: ${event.code}(${key})`)

        if (isActionKey(key)) {
            handleActionKeyReleased(key)
        } else {
            handleTypewriterKeyReleased(key)  
        }
    }

    function handleActionKeyReleased(key: Key) {
        console.info(`Action Key Released: ${key}`)

        if (isArrowKey(key)) {
            handleArrowKeyReleased(key)
        }
    }

    function handleArrowKeyReleased(key: Key) {
        console.info(`Arrow Key Released: ${key}`)
        playPreviousCharacterAudio()
    }

    function handleTypewriterKeyReleased(key: Key) {
        console.info(`Typewriter Key Released: ${key}`)

        setCurrPressedKeys(currPressedKeys.remove(key))
        updateReleasedKeyStatus(key)

        if (!isDotKey(key)) {
            handleBlankKeyReleased(key)
        }
    }

    const blankKeyReleasedHandlerFunctions = {
        [Key.SPACE]: handleSpaceKeyReleased,
        [Key.ENTER]: handleEnterKeyReleased,
        [Key.BACKSPACE]: handleBackspaceKeyReleased,
    }

    function handleBlankKeyReleased(key: Key) {
        console.info(`Blank Key Released ${key}`)
        blankKeyReleasedHandlerFunctions[key]()
    }

    function handleSpaceKeyReleased() {
        console.info('Space Key Released')
    }

    function handleEnterKeyReleased() {
        console.info('Enter Key Released')
    }

    function handleBackspaceKeyReleased() {
        console.info('Backspace Key Released')
        playPreviousCharacterAudio()
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
        console.info('Key status updated to pressed')
        setKeyStatus({
            ...keyStatus,
            [key]: true
        })
    }

    function updateReleasedKeyStatus(key: Key) {
        console.info('Key status updated released')
        setKeyStatus({
            ...keyStatus,
            [key]: false
        })
    }

    function playPreviousCharacterAudio() {
        const previousCharacter = getPreviousCharacter(output.current as HTMLTextAreaElement)
        console.info('Previous character: ' + previousCharacter)
        
        if (previousCharacter) {
            const previousCell = findCell(previousCharacter)
            console.info('Previous cell: ' + previousCell)

            if (previousCell && !isOutputMuted()) {
                playCellAudio(previousCell[0])
            }
        }
    }

    useEffect(() => {
        if (noKeyPressedCurrently()) {
            console.info('All keys released')

            if (canConvertKeysToCell(pressedKeys)) {
                console.info('Previous pressed keys can be converted to a cell')
                console.info('Previous pressed keys: ' + pressedKeys)

                const cell = keysToCell(pressedKeys)
                console.info('Keys converted to cell: ' + cell)

                const char = cellToString(cell)
                console.info('Cell converted to string: ' + char)
                addTextToTextArea(char, output.current as HTMLTextAreaElement)

                console.info('Cell included in typed cell: ' + cell)
                setTypedCells(typedCells?.concat(cell))
                
                if (!isOutputMuted()) {
                    playCellAudio(cell)
                }
            }

            console.info('Pressed Keys was reseted')
            console.info('------------------------')
            setPressedKeys(pressedKeys.clear())
        }
    }, [currPressedKeys])

    function noKeyPressedCurrently() {
        return currPressedKeys.isEmpty()
    }

    function getTitle() {
        return challengeMode ? 'MODO DESAFIO' : 'MODO LIVRE'
    }

    function showRandomWord() {
        return challengeMode ? 'Palavra: ' + randomWord?.word : ''
    }

    return (<>
        <div
            id='typewriter'
            className='container d-flex flex-column justify-content-center align-items-center'
            onKeyDown={ handleKeyPressed } onKeyUp={ handleKeyReleased }
            autoFocus
            >

            <div className='fs-1'>{ getTitle() }</div>
            <div className='fs-3 mb-3'>{ showRandomWord() }</div>

            <div className='d-flex justify-content-center w-100 fs-5 gap-3 mb-3'>
                <div><strong>(i)</strong> Instruções</div>
                <div><strong>(t)</strong> Ver texto a tinta ou em Braille</div>
                <div><strong>(o)</strong> Liga/desliga áudio do conversor</div>
                <div><strong>(m)</strong> Liga/desliga áudio do teclado</div>
                {/* <div><strong>(enter)</strong> Confirma</div> */}
            </div>

            <NOutput reference={output} showBraille={showBraille} />
            <NKeyboard keyStatus={keyStatus} />
        </div>
    </>)
}
