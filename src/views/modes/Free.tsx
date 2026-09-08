import React, { useEffect, useRef } from 'react'

import '../../styles/views/modes/Free.css'

import Typewriter from '../../components/Typewriter'
import { useAudioContext } from '../../providers/AudioProvider'

export default function Free() {
    const output = useRef<HTMLTextAreaElement>()
    const { playHowToAccessInstructionsAudio, playFreeModeInstructionsAudio } =
        useAudioContext()

    useEffect(() => {
        playHowToAccessInstructionsAudio(() => {})
    }, [])

    return (
        <>
            <main>
                <Typewriter
                    outputReference={output}
                    challengeMode={false}
                    randomWord={undefined}
                    onEnterPressed={() => {}}
                    onInstructionsKeyPressed={() => {
                        playFreeModeInstructionsAudio()
                    }}
                    onRepeatWordKeyPressed={() => {}}
                />
            </main>
        </>
    )
}
