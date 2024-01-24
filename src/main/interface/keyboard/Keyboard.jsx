import React from "react"
import Backspace from "./keys/Backspace"
import Dot from "./keys/Dot"
import Enter from "./keys/Enter"
import Space from "./keys/Space"

export default function Keyboard() {
    return (<>
        <div className='d-flex justify-content-evenly border'>
            <Enter keyboardKey={'q'} />
            <Dot description={3} keyboardKey={'s'} />
            <Dot description={2} keyboardKey={'d'} />
            <Dot description={1} keyboardKey={'f'} />
            <Space keyboardKey={'space'} />
            <Dot description={4} keyboardKey={'j'} />
            <Dot description={5} keyboardKey={'k'} />
            <Dot description={6} keyboardKey={'l'} />
            <Backspace keyboardKey={'backspace'} />
        </div>
    </>)
}