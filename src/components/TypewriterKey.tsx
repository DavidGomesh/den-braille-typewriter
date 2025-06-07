import { faD, faF, faJ, faK, faL, faLeftLong, faMinus, faS, faTurnDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Key } from '../domain/Key.ts'

import '../styles/components/TypewriterKey.css'

interface TypewriterKeyPropos {
    referenceKey: Key,
    pressed: boolean
}

export default function TypewriterKey({ referenceKey, pressed }: TypewriterKeyPropos) {

    const keyType = getKeyType(referenceKey)

    const typewriterClass = getTypewriterClass(keyType)
    const keyPressedClass = getKeyPressedClass(pressed)
    const defaultBootstrapClasses = getDefaultBootstrapClasses()
    const specificBootstrapClasses = getSpecificBootstrapClasses(keyType)

    const keyIcon = getKeyIcon(referenceKey)
    const keyTip = getKeyTip(referenceKey)

    return (<>
        <div className='d-flex flex-column align-items-center'>
            <div className={`
                ${typewriterClass} ${keyPressedClass} 
                ${defaultBootstrapClasses} ${specificBootstrapClasses}`}>
                    
                {keyIcon}
            </div>

            { keyTip }
        </div>
    </>)
}

enum KeyType {
    DOT,
    SPACE,
    ENTER,
    BACKSPACE,
    ACTION_KEY,
}

function getKeyType(key: Key) {
    switch (key) {
        case Key.ENTER: return KeyType.ENTER
        case Key.SPACE: return KeyType.SPACE
        case Key.BACKSPACE: return KeyType.BACKSPACE
        case Key.DOT1: return KeyType.DOT
        case Key.DOT2: return KeyType.DOT
        case Key.DOT3: return KeyType.DOT
        case Key.DOT4: return KeyType.DOT
        case Key.DOT5: return KeyType.DOT
        case Key.DOT6: return KeyType.DOT
        default: return KeyType.ACTION_KEY
    }
}

function getTypewriterClass(keyType: KeyType): string {
    switch (keyType) {
        case KeyType.DOT: return 'typewriter-dot-key'
        case KeyType.SPACE: return 'typewriter-space-key'
        case KeyType.ENTER: return 'typewriter-enter-key'
        case KeyType.BACKSPACE: return 'typewriter-backspace-key'
        case KeyType.ACTION_KEY: return ''
    }
}

function getKeyPressedClass(pressed: boolean) {
    return pressed ? 'bg-dark text-light' : ''
}

function getDefaultBootstrapClasses() {
    return 'd-flex justify-content-center align-items-center'
}

function getSpecificBootstrapClasses(keyType: KeyType): string {
    switch (keyType) {
        case KeyType.DOT: return 'rounded-circle border border-dark mx-1'
        case KeyType.SPACE: return 'rounded-pill border border-dark mx-1'
        case KeyType.ENTER: return 'rounded-4 border border-dark mx-1'
        case KeyType.BACKSPACE: return 'rounded-4 border border-dark mx-1'
        case KeyType.ACTION_KEY: return ''
    }
}

function getKeyIcon(key: Key) {
    switch (key) {
        case Key.ENTER: return <FontAwesomeIcon icon={faTurnDown}/>
        case Key.SPACE: return <FontAwesomeIcon icon={faMinus}/>
        case Key.BACKSPACE: return <FontAwesomeIcon icon={faLeftLong}/>
        case Key.DOT1: return <FontAwesomeIcon icon={faF}/>
        case Key.DOT2: return <FontAwesomeIcon icon={faD}/>
        case Key.DOT3: return <FontAwesomeIcon icon={faS}/>
        case Key.DOT4: return <FontAwesomeIcon icon={faJ}/>
        case Key.DOT5: return <FontAwesomeIcon icon={faK}/>
        case Key.DOT6: return <FontAwesomeIcon icon={faL}/>
    }
}

function getKeyTip(key: Key) {
    switch (key) {
        case Key.SPACE: return <div>Espaço</div>
        case Key.ENTER: return <div>Q</div>
        case Key.BACKSPACE: return <div>Backspace</div>
        default: return <div></div>
    }
}
