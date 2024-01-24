import { faD, faF, faJ, faK, faL, faLeftLong, faMinus, faS, faTurnDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "../../styles/components/keyboard/Keys.css"

export function Key({icon, pressed, className}) {
    const classes = `${className} ${!pressed || 'typewriter-pressed-key'} border d-flex justify-content-center align-items-center`
    return (<>
        <div className={classes}>
            <FontAwesomeIcon icon={icon} />
        </div>
    </>)
}

export function Backspace({pressed}) {
    return (<>
        <Key icon={faLeftLong} pressed={pressed} className={'typewriter-backspace-key'} />
    </>)
}

export function Dot({icon, pressed}) {
    return (<>
        <Key icon={icon} pressed={pressed} className={'typewriter-dot-key rounded-circle'} />
    </>)
}

export function Dot1({pressed}) {
    return (<>
        <Dot icon={faF} pressed={pressed} />
    </>)
}

export function Dot2({pressed}) {
    return (<>
        <Dot icon={faD} pressed={pressed} />
    </>)
}

export function Dot3({pressed}) {
    return (<>
        <Dot icon={faS} pressed={pressed} />
    </>)
}

export function Dot4({pressed}) {
    return (<>
        <Dot icon={faJ} pressed={pressed} />
    </>)
}

export function Dot5({pressed}) {
    return (<>
        <Dot icon={faK} pressed={pressed} />
    </>)
}

export function Dot6({pressed}) {
    return (<>
        <Dot icon={faL} pressed={pressed} />
    </>)
}

export function Enter({pressed}) {
    return (<>
        <Key icon={faTurnDown} pressed={pressed} className={'typewriter-enter-key rounded-4'} />
    </>)
}

export function Space({pressed}) {
    return (<>
        <Key icon={faMinus} pressed={pressed} className={'typewriter-space-key rounded-pill'} />
    </>)
}