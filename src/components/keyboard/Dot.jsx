import { faD, faF, faJ, faK, faL, faQuestion, faS } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../../styles/components/keyboard/Dot.css"

export default function Dot({keyboardKey}) {
    const icon = (() => { 
        switch(keyboardKey) {
            case 's': return faS
            case 'd': return faD
            case 'f': return faF
            case 'j': return faJ
            case 'k': return faK
            case 'l': return faL
            default: return faQuestion
        }
    })()

    return (<>
        <div className="typewriter-dot-key rounded-circle border d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={icon} />
        </div>
    </>)
}