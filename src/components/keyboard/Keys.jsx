import { faD, faF, faJ, faK, faL, faLeftLong, faMinus, faS, faTurnDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "../../styles/components/keyboard/Keys.css"
import { pipe } from "fp-ts/lib/function"
import { foldKeyState } from "../../service/BrailleKeyMap.ts"

export function Key({icon, keyState, className}) {
    const bootstrapClasses = 'border d-flex justify-content-center align-items-center'
    const classes = `${className} ${pipe(keyState, foldKeyState(() => 'typewriter-pressed-key', () => ''))} ${bootstrapClasses}`
    return (<>
        <div className={classes}>
            <FontAwesomeIcon icon={icon} />
        </div>
    </>)
}

export function Backspace({keyState}) {
    return (<>
        <Key icon={faLeftLong} keyState={keyState} className={'typewriter-backspace-key'} />
    </>)
}

export function Dot({icon, keyState}) {
    return (<>
        <Key icon={icon} keyState={keyState} className={'typewriter-dot-key rounded-circle'} />
    </>)
}

export function Dot1({keyState}) {
    return (<>
        <Dot icon={faF} keyState={keyState} />
    </>)
}

export function Dot2({keyState}) {
    return (<>
        <Dot icon={faD} keyState={keyState} />
    </>)
}

export function Dot3({keyState}) {
    return (<>
        <Dot icon={faS} keyState={keyState} />
    </>)
}

export function Dot4({keyState}) {
    return (<>
        <Dot icon={faJ} keyState={keyState} />
    </>)
}

export function Dot5({keyState}) {
    return (<>
        <Dot icon={faK} keyState={keyState} />
    </>)
}

export function Dot6({keyState}) {
    return (<>
        <Dot icon={faL} keyState={keyState} />
    </>)
}

export function Enter({keyState}) {
    return (<>
        <Key icon={faTurnDown} keyState={keyState} className={'typewriter-enter-key rounded-4'} />
    </>)
}

export function Space({keyState}) {
    return (<>
        <Key icon={faMinus} keyState={keyState} className={'typewriter-space-key rounded-pill'} />
    </>)
}