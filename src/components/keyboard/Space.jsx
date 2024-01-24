import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus } from "@fortawesome/free-solid-svg-icons"

import "../../styles/components/keyboard/Space.css"

export default function Space({keyboardKey}) {
    return (<>
        <div className="typewriter-space-key rounded-pill border d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faMinus} />
        </div>
    </>)
}