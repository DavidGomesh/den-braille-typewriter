import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faD, faF, faJ, faK, faL, faLeftLong, faMinus, faS, faTurnDown } from '@fortawesome/free-solid-svg-icons'

import Key from './Key.tsx'
export default function Keyboard({ enterRef, spaceRef, backspaceRef, dot1Ref, dot2Ref, dot3Ref, dot4Ref, dot5Ref, dot6Ref }) {

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
            <Key reference={enterRef} className={`${ENTClasses} ${ENTRadius} ${borders} ${margins}`} content={ENTIcon}/>

            <Key reference={dot3Ref} className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT3Icon}/>
            <Key reference={dot2Ref} className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT2Icon}/>
            <Key reference={dot1Ref} className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT1Icon}/>

            <Key reference={spaceRef} className={`${SPCClasses} ${SPCRadius} ${borders} ${margins}`} content={SPCIcon}/>

            <Key reference={dot4Ref} className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT4Icon}/>
            <Key reference={dot5Ref} className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT5Icon}/>
            <Key reference={dot6Ref} className={`${DOTClasses} ${DOTRadius} ${borders} ${margins}`} content={DT6Icon}/>

            <Key reference={backspaceRef} className={`${BSPClasses} ${BSPRadius} ${borders} ${margins}`} content={BSPIcon}/>
        </div>
    </>)
}