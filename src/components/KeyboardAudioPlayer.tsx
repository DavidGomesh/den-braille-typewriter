import React, { createContext, useContext, useRef, useState } from 'react'

const KeyboardAudioContext = createContext({
    playKeyPress: () => { return }
})

export function useKeyboardAudioContext() {
    return useContext(KeyboardAudioContext)
}

function getRandomKeyboardAudio() {
    const audioPaths = [
        'assets/audio/keys/key-pressed-1.mp3',
        'assets/audio/keys/key-pressed-2.mp3',
        'assets/audio/keys/key-pressed-3.mp3',
        'assets/audio/keys/key-pressed-4.mp3',
    ]

    const index = Math.floor(Math.random() * audioPaths.length)
    return new Audio(audioPaths[index])
}

export default function KeyboardAudioProvider({ children }) {

    const [currentPlaying, setCurrentPlaying] = useState<HTMLAudioElement | null>(null)

    async function playKeyPress() {
        const audio = getRandomKeyboardAudio()

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
            // currentPlaying.remove()
        }
    }

    return (
        <KeyboardAudioContext.Provider value={{ playKeyPress }}>
            {children}
        </KeyboardAudioContext.Provider>
    )
}

