import React, { createContext, useContext, useRef, useState } from 'react'

const KeyboardAudioContext = createContext({
    playKeyPress: () => { return }
})

export function useKeyboardAudioContext() {
    return useContext(KeyboardAudioContext)
}


export default function KeyboardAudioProvider({ children }) {
    const keyPressedAudios = [
        useRef(new Audio('assets/audio/keys/key-pressed-1.mp3')),
        useRef(new Audio('assets/audio/keys/key-pressed-2.mp3')),
        useRef(new Audio('assets/audio/keys/key-pressed-3.mp3')),
        useRef(new Audio('assets/audio/keys/key-pressed-4.mp3')),
    ]

    const [currentPlaying, setCurrentPlaying] = useState<HTMLAudioElement | null>(null)

    async function playKeyPress() {
        const idx = Math.floor(Math.random() * keyPressedAudios.length)
        const audio = keyPressedAudios[idx].current

        await stopCurrentAudio()

        try {
            await audio.play()
            setCurrentPlaying(audio)
        } catch (error) {
            console.error(error)
        }
    }

    async function stopCurrentAudio() {
        if (currentPlaying) {
            currentPlaying.pause()
            currentPlaying.currentTime = 0
        }
    }

    return (
        <KeyboardAudioContext.Provider value={{ playKeyPress }}>
            {children}
        </KeyboardAudioContext.Provider>
    )
}

