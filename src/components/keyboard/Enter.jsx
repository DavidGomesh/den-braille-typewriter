import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTurnDown } from "@fortawesome/free-solid-svg-icons"

import "../../styles/components/keyboard/Enter.css"

export default function Enter({keyboardKey}) {
    return (<>
        <div className="typewriter-enter-key rounded-4 border d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faTurnDown} />
        </div>
    </>)
}