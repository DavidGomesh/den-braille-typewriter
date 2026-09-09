import React, { useEffect } from 'react'

import '../../styles/views/modes/Free.css'

import { useAudioContext } from '../../providers/AudioProvider'
import { FreeTypingSession } from '../../ui/public'

export default function Free() {
    const { playHowToAccessInstructionsAudio, playFreeModeInstructionsAudio } =
        useAudioContext()

    useEffect(() => {
        playHowToAccessInstructionsAudio(() => {})
    }, [])

    return (
        <>
            <main>
                <FreeTypingSession
                    onInstructionsRequested={playFreeModeInstructionsAudio}
                />
            </main>
        </>
    )
}
