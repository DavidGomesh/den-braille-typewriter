import React from 'react'
import Typewriter from '../../components/Typewriter.tsx'

import '../../styles/views/modes/Free.css'
import CellAudioPlayer from '../../components/CellAudioPlayer.tsx'

export default function Free() {
    return (<>
        <main>
            <CellAudioPlayer>
                <Typewriter />
            </CellAudioPlayer>
        </main>
    </>)
}
