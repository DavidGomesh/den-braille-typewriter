import React from 'react'

import '../../styles/views/modes/Free.css'

import NTypewriter from '../../components/NTypewriter.tsx'
import KeyboardAudioProvider from '../../providers/KeyboardAudioProvider.tsx'
import CellAudioProvider from '../../providers/CellAudioProvider.tsx'

export default function NFree() {
    
    return (<>  
        <main>
            <KeyboardAudioProvider>
                <CellAudioProvider>
                    <NTypewriter/>
                </CellAudioProvider>
            </KeyboardAudioProvider>
        </main>
    </>)
}
