import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLeftLong } from "@fortawesome/free-solid-svg-icons"

import "../../styles/components/keyboard/Backspace.css"

export default function Backspace({keyboardKey}) {
    return (<>
        <div className="typewriter-backspace-key rounded-4 border d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faLeftLong} />
        </div>
    </>)
}