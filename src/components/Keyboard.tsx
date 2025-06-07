import React from 'react'
import { Key } from '../domain/Key.ts'
import TypewriterKey from './TypewriterKey.tsx'

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

export default function Keyboard({ keyStatus }: NKeyboardProps) {

    const defaultBootstrapClasses = getDefaultBootstrapClasses()

    return (<>
        <div className={`${defaultBootstrapClasses}`}>
            <TypewriterKey referenceKey={Key.ENTER} pressed={keyStatus[Key.ENTER]} />

            <TypewriterKey referenceKey={Key.DOT3} pressed={keyStatus[Key.DOT3]} />
            <TypewriterKey referenceKey={Key.DOT2} pressed={keyStatus[Key.DOT2]} />
            <TypewriterKey referenceKey={Key.DOT1} pressed={keyStatus[Key.DOT1]} />

            <TypewriterKey referenceKey={Key.SPACE} pressed={keyStatus[Key.SPACE]} />

            <TypewriterKey referenceKey={Key.DOT4} pressed={keyStatus[Key.DOT4]} />
            <TypewriterKey referenceKey={Key.DOT5} pressed={keyStatus[Key.DOT5]} />
            <TypewriterKey referenceKey={Key.DOT6} pressed={keyStatus[Key.DOT6]} />

            <TypewriterKey referenceKey={Key.BACKSPACE} pressed={keyStatus[Key.BACKSPACE]} />
        </div>
    </>)
}

function getDefaultBootstrapClasses() {
    return 'container d-flex justify-content-center'
}
