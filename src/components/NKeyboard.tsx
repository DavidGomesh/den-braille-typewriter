import React from 'react'
import { Key } from '../domain/Key.ts'
import NKey from './NKey.tsx'

export interface KeyStatus {
    [Key.DOT1]: boolean,
    [Key.DOT2]: boolean,
    [Key.DOT3]: boolean,
    [Key.DOT4]: boolean,
    [Key.DOT5]: boolean,
    [Key.DOT6]: boolean,
    [Key.SPACE]: boolean,
    [Key.ENTER]: boolean,
    [Key.BACKSPACE]: boolean,
}

interface NKeyboardProps {
    keyStatus: KeyStatus
}

export default function NKeyboard({ keyStatus }: NKeyboardProps) {

    const defaultBootstrapClasses = getDefaultBootstrapClasses()

    return (<>
        <div className={`${defaultBootstrapClasses}`}>
            <NKey typewriterKey={Key.ENTER} pressed={keyStatus[Key.ENTER]} />

            <NKey typewriterKey={Key.DOT3} pressed={keyStatus[Key.DOT3]} />
            <NKey typewriterKey={Key.DOT2} pressed={keyStatus[Key.DOT2]} />
            <NKey typewriterKey={Key.DOT1} pressed={keyStatus[Key.DOT1]} />

            <NKey typewriterKey={Key.SPACE} pressed={keyStatus[Key.SPACE]} />

            <NKey typewriterKey={Key.DOT4} pressed={keyStatus[Key.DOT4]} />
            <NKey typewriterKey={Key.DOT5} pressed={keyStatus[Key.DOT5]} />
            <NKey typewriterKey={Key.DOT6} pressed={keyStatus[Key.DOT6]} />

            <NKey typewriterKey={Key.BACKSPACE} pressed={keyStatus[Key.BACKSPACE]} />
        </div>
    </>)
}

function getDefaultBootstrapClasses() {
    return 'container d-flex justify-content-center'
}
