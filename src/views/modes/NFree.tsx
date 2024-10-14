import React from 'react'
import Typewriter from '../../components/Typewriter.tsx'

import '../../styles/views/modes/Free.css'
import NKeyboard from '../../components/NKeyboard.tsx'

import KeyboardAudioProvider from '../../components/KeyboardAudioPlayer.tsx'

export default function NFree() {
    
    return (<>  
        <main>
            <KeyboardAudioProvider>
                <NKeyboard keyStatus={{
                    enter: true,
                    space: false,
                    backspace: false,
                    dot1: true,
                    dot2: false,
                    dot3: false,
                    dot4: false,
                    dot5: false,
                    dot6: false,
                }} />
            </KeyboardAudioProvider>
        </main>
    </>)
}
