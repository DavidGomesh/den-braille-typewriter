import React, { useEffect } from 'react'

import '../../styles/views/modes/Free.css'

import Typewriter from '../../components/Typewriter.tsx'
import { useAudioContext } from '../../providers/AudioProvider.tsx'

export default function Free() {
    const { playHowToAccessInstructionsAudio, playFreeModeInstructionsAudio } = useAudioContext()

    useEffect(() => {
        playHowToAccessInstructionsAudio(() => {})
    }, [])

    return (<>  
        <main>
            <Typewriter 
                challengeMode={false} 
                randomWord={undefined} 
                onEnterPressed={() => {}} 
                onInstructionsKeyPressed={() => { playFreeModeInstructionsAudio() }}
                onRepeatWordKeyPressed={() => {}}
            />
        </main>
    </>)
}
