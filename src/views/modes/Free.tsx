import React, { useCallback, useEffect, useMemo, useState } from 'react'

import '../../styles/views/modes/Free.css'

import { useAudioContext } from '../../providers/AudioProvider'
import {
    createOrthographyProfile,
    createPaperConfiguration,
} from '../../braille/public'
import {
    applySessionInput,
    createDefaultWebKeyboardBindings,
    createTypingSession,
    getTypingSessionSnapshot,
    type SessionInput,
} from '../../session/public'
import { FreeTypingSession, type LegacyFreeModeAction } from '../../ui/public'

const createFreeSession = () =>
    createTypingSession({
        paper: createPaperConfiguration({
            type: 'continuous',
            columns: 40,
        }),
        profile: createOrthographyProfile('portuguese-braille-2018'),
        effectiveConfiguration: { interruptionPolicy: 'discard' },
    })

export default function Free() {
    const [session, setSession] = useState(createFreeSession)
    const snapshot = useMemo(() => getTypingSessionSnapshot(session), [session])
    const keyboardBindings = useMemo(createDefaultWebKeyboardBindings, [])
    const {
        playHowToAccessInstructionsAudio,
        playFreeModeInstructionsAudio,
        playKeyPress,
        playKeyboardMuted,
        playKeyboardUnmuted,
        playOutputMuted,
        playOutputUnmuted,
        playBrailleViewAudio,
        playInkViewAudio,
    } = useAudioContext()
    const [showingBraille, setShowingBraille] = useState(true)
    const [outputMuted, setOutputMuted] = useState(false)
    const [keyboardMuted, setKeyboardMuted] = useState(false)

    useEffect(() => {
        playHowToAccessInstructionsAudio(() => {})
    }, [])

    const dispatch = useCallback((input: SessionInput) => {
        setSession((current) => applySessionInput(current, input).state)
    }, [])

    const handlePresentationAction = useCallback(
        (action: LegacyFreeModeAction) => {
            if (action === 'instructions-requested') {
                playFreeModeInstructionsAudio()
            } else if (action === 'view-toggled') {
                showingBraille ? playInkViewAudio() : playBrailleViewAudio()
                setShowingBraille((current) => !current)
            } else if (action === 'output-audio-toggled') {
                outputMuted ? playOutputUnmuted() : playOutputMuted()
                setOutputMuted((current) => !current)
            } else {
                keyboardMuted ? playKeyboardUnmuted() : playKeyboardMuted()
                setKeyboardMuted((current) => !current)
            }
        },
        [
            keyboardMuted,
            outputMuted,
            playBrailleViewAudio,
            playFreeModeInstructionsAudio,
            playInkViewAudio,
            playKeyboardMuted,
            playKeyboardUnmuted,
            playOutputMuted,
            playOutputUnmuted,
            showingBraille,
        ],
    )

    return (
        <>
            <main>
                <FreeTypingSession
                    snapshot={snapshot}
                    dispatch={dispatch}
                    keyboardBindings={keyboardBindings}
                    onPresentationAction={handlePresentationAction}
                    onMachineKeyPressed={playKeyPress}
                />
            </main>
        </>
    )
}
