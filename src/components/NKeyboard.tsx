import React from 'react'
import NKey from './NKey.tsx'
import { Key } from '../domain/Key.ts'

import { useKeyboardAudioContext } from './KeyboardAudioPlayer.tsx'

interface NKeyboardProps {
    keyStatus: {
        enter: boolean,
        space: boolean,
        backspace: boolean,
        dot1: boolean,
        dot2: boolean,
        dot3: boolean,
        dot4: boolean,
        dot5: boolean,
        dot6: boolean,
    }
}

export default function NKeyboard({ keyStatus }: NKeyboardProps) {

    const { playKeyPress } = useKeyboardAudioContext()

    const defaultBootstrapClasses = getDefaultBootstrapClasses()

    // playKeyPress()

    return (<>
        <div className={`${defaultBootstrapClasses}`} onMouseEnter={playKeyPress} onMouseLeave={playKeyPress}>
            <NKey typewriterKey={Key.ENTER} pressed={keyStatus.enter} />

            <NKey typewriterKey={Key.DOT3} pressed={keyStatus.dot3} />
            <NKey typewriterKey={Key.DOT2} pressed={keyStatus.dot2} />
            <NKey typewriterKey={Key.DOT1} pressed={keyStatus.dot1} />

            <NKey typewriterKey={Key.SPACE} pressed={keyStatus.space} />

            <NKey typewriterKey={Key.DOT4} pressed={keyStatus.dot4} />
            <NKey typewriterKey={Key.DOT5} pressed={keyStatus.dot5} />
            <NKey typewriterKey={Key.DOT6} pressed={keyStatus.dot6} />

            <NKey typewriterKey={Key.BACKSPACE} pressed={keyStatus.backspace} />
        </div>
    </>)
}

function getDefaultBootstrapClasses() {
    return 'container d-flex justify-content-center'
}