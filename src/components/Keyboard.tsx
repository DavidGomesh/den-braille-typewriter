import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faD, faF, faJ, faK, faL, faLeftLong, faMinus, faS, faTurnDown } from '@fortawesome/free-solid-svg-icons'

import Key from './Key.tsx'
export default function Keyboard() {

    const BSPClasses = 'typewriter-backspace-key'
    const SPCClasses = 'typewriter-space-key'
    const ENTClasses = 'typewriter-enter-key'
    const DOTClasses = 'typewriter-dot-key'

    const BSPRadius  = 'rounded-4'
    const SPCRadius  = 'rounded-pill'
    const ENTRadius  = 'rounded-4'
    const DOTRadius  = 'rounded-circle'

    const borders    = 'border border-dark'
    const margins    = 'mx-1'
    
    const BSPIcon    = <FontAwesomeIcon icon={faLeftLong}/>
    const SPCIcon    = <FontAwesomeIcon icon={faMinus}/>
    const ENTIcon    = <FontAwesomeIcon icon={faTurnDown}/>

    const DT1Icon    = <FontAwesomeIcon icon={faF}/>
    const DT2Icon    = <FontAwesomeIcon icon={faD}/>
    const DT3Icon    = <FontAwesomeIcon icon={faS}/>
    const DT4Icon    = <FontAwesomeIcon icon={faJ}/>
    const DT5Icon    = <FontAwesomeIcon icon={faK}/>
    const DT6Icon    = <FontAwesomeIcon icon={faL}/>

    return (<>
        <div className='container d-flex justify-content-center'>
            <Key className={`${ENTClasses} ${ENTRadius} ${borders} ${margins}`} content={ENTIcon}/>

            <Key className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT3Icon}/>
            <Key className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT2Icon}/>
            <Key className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT1Icon}/>

            <Key className={`${SPCClasses} ${SPCRadius} ${borders} ${margins}`} content={SPCIcon}/>

            <Key className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT4Icon}/>
            <Key className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT5Icon}/>
            <Key className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT6Icon}/>

            <Key className={`${BSPClasses} ${BSPRadius} ${borders} ${margins}`} content={BSPIcon}/>
        </div>
    </>)
}