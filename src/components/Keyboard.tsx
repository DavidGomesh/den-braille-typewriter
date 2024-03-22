import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faMinus, faTurnDown } from '@fortawesome/free-solid-svg-icons'

import Key from './Key.tsx'

export default function Keyboard() {
    return (<>
        <div className='container d-flex justify-content-center'>
            <Key className='typewriter-enter-key rounded-4 border border-dark ms-1 me-1' content={<FontAwesomeIcon icon={faTurnDown}/>}/>
            <Key className='typewriter-dot-key rounded-circle border border-dark ms-1 me-1' content='S'/>
            <Key className='typewriter-dot-key rounded-circle border border-dark ms-1 me-1' content='D'/>
            <Key className='typewriter-dot-key rounded-circle border border-dark ms-1 me-1' content='F'/>
            <Key className='typewriter-space-key rounded-pill border border-dark ms-1 me-1' content={<FontAwesomeIcon icon={faMinus}/>}/>
            <Key className='typewriter-dot-key rounded-circle border border-dark ms-1 me-1' content='J'/>
            <Key className='typewriter-dot-key rounded-circle border border-dark ms-1 me-1' content='K'/>
            <Key className='typewriter-dot-key rounded-circle border border-dark ms-1 me-1' content='L'/>
            <Key className='typewriter-backspace-key rounded-4 border border-dark ms-1 me-1' content={<FontAwesomeIcon icon={faLeftLong}/>}/>
        </div>
    </>)
}