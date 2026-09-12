import React, { createContext, useContext, useMemo, useRef } from 'react'
import type { PropsWithChildren } from 'react'
import { Cell, cellToString } from '../domain/Cell'
import {
    challengeModeInstructionsPortuguese,
    createBrowserSpeechOutput,
    freeModeInstructionsPortuguese,
    type SpeechRequest,
} from '../feedback/public'

const AudioContext = createContext({
    // Menu players
    playMainMenuAudio: () => Promise.reject<void>(),
    playFreeModeAudio: () => Promise.reject<void>(),
    playChallengeModeAudio: () => Promise.reject<void>(),
    playAboutModeAudio: () => Promise.reject<void>(),
    playFreeModeInstructionsAudio: () => Promise.reject<void>(),
    playChallengeModeInstructionsAudio: () => Promise.reject<void>(),
    playHowToAccessInstructionsAudio: (_: () => void) => Promise.reject<void>(),

    // Cell players
    playCellAudio: (_: Cell) => Promise.reject<void>(),
    playOutputMuted: () => Promise.reject<void>(),
    playOutputUnmuted: () => Promise.reject<void>(),
    playEnterAudio: () => Promise.reject<void>(),
    playBrailleViewAudio: () => Promise.reject<void>(),
    playInkViewAudio: () => Promise.reject<void>(),

    // Keyboard players
    playKeyPress: () => Promise.reject<void>(),
    playKeyboardMuted: () => Promise.reject<void>(),
    playKeyboardUnmuted: () => Promise.reject<void>(),

    // Challenge players
    playWordAudio: (_: string) => Promise.reject<void>(),
    playRightAnswer: (_: () => void) => Promise.reject<void>(),
    playWrongAnswer: () => Promise.reject<void>(),
    stopAllAudio: () => {},
})

export function useAudioContext() {
    return useContext(AudioContext)
}

export default function AudioProvider({ children }: PropsWithChildren) {
    const currentPlaying = useRef<HTMLAudioElement | null>(null)
    const speechOutput = useMemo(createBrowserSpeechOutput, [])

    const speak = async (
        text: string,
        purpose: SpeechRequest['purpose'],
        onEnded = () => {},
    ) => {
        stopAllAudio()
        if (speechOutput === undefined) return
        const result = await speechOutput.speak({
            text,
            locale: 'pt-BR',
            purpose,
            voicePreference: 'default',
            rate: 0.9,
            pitch: 1,
            volume: 1,
        })
        if (result === 'completed') onEnded()
    }

    // Menu players
    async function playMainMenuAudio() {
        return speak('Menu principal da Máquina Den Braille', 'status')
    }

    async function playFreeModeAudio() {
        return speak('Modo livre', 'status')
    }

    async function playChallengeModeAudio() {
        return speak('Modo desafio', 'status')
    }

    async function playAboutModeAudio() {
        return speak('Sobre', 'status')
    }

    async function playFreeModeInstructionsAudio() {
        return speak(freeModeInstructionsPortuguese, 'instruction')
    }

    async function playChallengeModeInstructionsAudio() {
        return speak(challengeModeInstructionsPortuguese, 'instruction')
    }

    async function playHowToAccessInstructionsAudio(onEnded: () => void) {
        return speak(
            'Pressione I para ouvir as instruções.',
            'instruction',
            onEnded,
        )
    }

    // Cell players
    async function playCellAudio(cell: Cell) {
        return speak(
            cell === Cell.C0 ? 'espaço' : cellToString(cell),
            'reading',
        )
    }

    async function playOutputMuted() {
        return speak('Leitura falada desativada', 'status')
    }

    async function playOutputUnmuted() {
        return speak('Leitura falada ativada', 'status')
    }

    async function playEnterAudio() {
        return playAudio(getEnterAudio())
    }

    async function playBrailleViewAudio() {
        return speak('Visualização em Braille', 'status')
    }

    async function playInkViewAudio() {
        return speak('Visualização a tinta', 'status')
    }

    // Keyboard players
    async function playKeyPress() {
        return playAudio(getRandomKeyboardAudio())
    }

    async function playKeyboardMuted() {
        return speak('Sons da máquina desativados', 'status')
    }

    async function playKeyboardUnmuted() {
        return speak('Sons da máquina ativados', 'status')
    }

    // Challenge players
    async function playWordAudio(word: string) {
        return speak(word, 'reading')
    }

    async function playRightAnswer(onEnded: () => void) {
        return speak('Resposta correta', 'result', onEnded)
    }

    async function playWrongAnswer() {
        return speak('Resposta incorreta', 'result')
    }

    async function playAudio(audio: HTMLAudioElement, onEnded = () => {}) {
        await stopCurrentAudio()
        try {
            await audio.play()
            currentPlaying.current = audio
            audio.onended = onEnded
        } catch (error) {
            console.error(error)
        }
    }

    async function stopCurrentAudio() {
        if (currentPlaying.current) {
            currentPlaying.current.pause()
            currentPlaying.current.currentTime = 0
            currentPlaying.current = null
        }
    }

    function stopAllAudio() {
        speechOutput?.cancel()
        void stopCurrentAudio()
    }

    const playerFunctions = {
        // Menu players
        playMainMenuAudio,
        playFreeModeAudio,
        playChallengeModeAudio,
        playAboutModeAudio,
        playFreeModeInstructionsAudio,
        playChallengeModeInstructionsAudio,
        playHowToAccessInstructionsAudio,

        // Cell players
        playCellAudio,
        playOutputMuted,
        playOutputUnmuted,
        playEnterAudio,
        playBrailleViewAudio,
        playInkViewAudio,

        // Keyboard players
        playKeyPress,
        playKeyboardMuted,
        playKeyboardUnmuted,

        // Challenge players
        playWordAudio,
        playRightAnswer,
        playWrongAnswer,
        stopAllAudio,
    }

    return (
        <AudioContext.Provider value={playerFunctions}>
            {children}
        </AudioContext.Provider>
    )
}

function getEnterAudio() {
    return new Audio('assets/audio/keys/enter.mp3')
}

// Keyboard audio loaders
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
