import React from 'react'
import Typewriter from '../../components/Typewriter.tsx'

import '../../styles/views/modes/Free.css'
import CellAudioProvider from '../../providers/CellAudioProvider.tsx'

export default function Free() {
    return (<>
        <main>
            <CellAudioProvider>
                <Typewriter />
            </CellAudioProvider>
        </main>
    </>)
}
