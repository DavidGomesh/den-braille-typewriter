import React from 'react'
import NKey from './NKey.tsx'
import { Key } from '../domain/Key.ts'

import { useKeyboardAudioContext } from './KeyboardAudioPlayer.tsx'

export const status = {
    enter: true,
    space: false,
    backspace: false,
    dot1: true,
    dot2: false,
    dot3: false,
    dot4: false,
    dot5: false,
    dot6: false,
}

export default function NKeyboard({ keyStatus = status }) {

    const { playKeyPress } = useKeyboardAudioContext()

    const defaultBootstrapClasses = getDefaultBootstrapClasses()

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