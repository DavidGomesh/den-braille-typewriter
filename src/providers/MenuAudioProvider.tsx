import React, { createContext, useContext, useState } from 'react'

const MenuAudioContext = createContext({
    playMainMenuAudio: () => { return },
    playFreeModeAudio: () => { return },
    playChallengeModeAudio: () => { return },
    playAboutModeAudio: () => { return },
})

export function useMenuAudioContext() {
    return useContext(MenuAudioContext)
}

export default function MenuAudioProvider({ children }) {

    const [currentPlaying, setCurrentPlaying] = useState<HTMLAudioElement | null>(null)

    function playMainMenuAudio() {
        playAudio(getMainMenuAudio())
    }

    function playFreeModeAudio() {
        playAudio(getFreeModeAudio())
    }

    function playChallengeModeAudio() {
        playAudio(getChallengeModeAudio())
    }

    function playAboutModeAudio() {
        playAudio(getAboutAudio())
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
        playMainMenuAudio,
        playFreeModeAudio,
        playChallengeModeAudio,
        playAboutModeAudio,
    }

    return (
        <MenuAudioContext.Provider value={playerFunctions}>
            { children }
        </MenuAudioContext.Provider>
    )
}

function getMainMenuAudio() {
    return new Audio('assets/audio/views/menu/menu-principal-da-maquina-den-braille.mp3')
}

function getFreeModeAudio() {
    return new Audio('assets/audio/views/menu/modo-livre.mp3')
}

function getChallengeModeAudio() {
    return new Audio('assets/audio/views/menu/modo-desafio.mp3')
}

function getAboutAudio() {
    return new Audio('assets/audio/views/menu/sobre.mp3')
}
