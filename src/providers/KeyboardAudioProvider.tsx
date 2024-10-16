import React, { createContext, useContext, useState } from 'react'

const KeyboardAudioContext = createContext({
    playKeyPress: () => { return },
    playKeyboardMuted: () => { return },
    playKeyboardUnmuted: () => { return },
})

export function useKeyboardAudioContext() {
    return useContext(KeyboardAudioContext)
}

export default function KeyboardAudioProvider({ children }) {

    const [currentPlaying, setCurrentPlaying] = useState<HTMLAudioElement | null>(null)

    async function playKeyPress() {
        playAudio(getRandomKeyboardAudio())
    }

    async function playKeyboardMuted() {
        playAudio(getKeyboardMutedAudio())
    }

    async function playKeyboardUnmuted() {
        playAudio(getKeyboardUnmutedAudio())
    }
    
    async function playAudio(audio: HTMLAudioElement) {
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

    const playerFunctions = { 
        playKeyPress, 
        playKeyboardMuted, 
        playKeyboardUnmuted
    }

    return (
        <KeyboardAudioContext.Provider value={playerFunctions}>
            {children}
        </KeyboardAudioContext.Provider>
    )
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

function getKeyboardMutedAudio() {
    return new Audio('assets/audio/actions/teclado-mutado.mp3')
}

function getKeyboardUnmutedAudio() {
    return new Audio('assets/audio/actions/teclado-desmutado.mp3')
}
