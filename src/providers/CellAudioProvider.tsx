import React, { createContext, useContext, useState } from 'react'
import { Cell } from '../domain/Cell.ts'

const CellAudioContext = createContext({
    playCellAudio: (_: Cell) => { return },
    playOutputMuted: () => { return },
    playOutputUnmuted: () => { return },
    playEnterAudio: () => { return },
})

export function useCellAudioContext() {
    return useContext(CellAudioContext)
}

export default function CellAudioProvider({ children }) {

    const [currentPlaying, setCurrentPlaying] = useState<HTMLAudioElement | null>(null)

    async function playCellAudio(cell: Cell) {
        playAudio(getCellAudio(cell))
    }

    async function playOutputMuted() {
        playAudio(getOutputMutedAudio())
    }

    async function playOutputUnmuted() {
        playAudio(getOutputUnmutedAudio())
    }

    async function playEnterAudio() {
        playAudio(getEnterAudio())
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
        playCellAudio, 
        playOutputMuted, 
        playOutputUnmuted,
        playEnterAudio,
    }

    return (
        <CellAudioContext.Provider value={playerFunctions}>
            { children }
        </CellAudioContext.Provider>
    )
}

function getCellAudio(cell: Cell) {
    switch (cell) {
        case Cell.C0: return new Audio('assets/audio/cells/espaco.mp3')

        case Cell.C1: return new Audio('assets/audio/cells/a.mp3')
        case Cell.C12: return new Audio('assets/audio/cells/b.mp3')
        case Cell.C14: return new Audio('assets/audio/cells/c.mp3')
        case Cell.C145: return new Audio('assets/audio/cells/d.mp3')
        case Cell.C15: return new Audio('assets/audio/cells/e.mp3')
        case Cell.C124: return new Audio('assets/audio/cells/f.mp3')
        case Cell.C1245: return new Audio('assets/audio/cells/g.mp3')
        case Cell.C125: return new Audio('assets/audio/cells/h.mp3')
        case Cell.C24: return new Audio('assets/audio/cells/i.mp3')
        case Cell.C245: return new Audio('assets/audio/cells/j.mp3')

        case Cell.C13: return new Audio('assets/audio/cells/k.mp3')
        case Cell.C123: return new Audio('assets/audio/cells/l.mp3')
        case Cell.C134: return new Audio('assets/audio/cells/m.mp3')
        case Cell.C1345: return new Audio('assets/audio/cells/n.mp3')
        case Cell.C135: return new Audio('assets/audio/cells/o.mp3')
        case Cell.C1234: return new Audio('assets/audio/cells/p.mp3')
        case Cell.C12345: return new Audio('assets/audio/cells/q.mp3')
        case Cell.C1235: return new Audio('assets/audio/cells/r.mp3')
        case Cell.C234: return new Audio('assets/audio/cells/s.mp3')
        case Cell.C2345: return new Audio('assets/audio/cells/t.mp3')

        case Cell.C136: return new Audio('assets/audio/cells/u.mp3')
        case Cell.C1236: return new Audio('assets/audio/cells/v.mp3')
        case Cell.C1346: return new Audio('assets/audio/cells/x.mp3')
        case Cell.C13456: return new Audio('assets/audio/cells/y.mp3')
        case Cell.C1356: return new Audio('assets/audio/cells/z.mp3')
        case Cell.C12346: return new Audio('assets/audio/cells/cedilha.mp3')
        case Cell.C123456: return new Audio('assets/audio/cells/e-agudo.mp3')
        case Cell.C12356: return new Audio('assets/audio/cells/a-agudo.mp3')
        case Cell.C2346: return new Audio('assets/audio/cells/e-crase.mp3')
        case Cell.C23456: return new Audio('assets/audio/cells/u-agudo.mp3')

        case Cell.C16: return new Audio('assets/audio/cells/a-circunflexo.mp3')
        case Cell.C126: return new Audio('assets/audio/cells/e-circunflexo.mp3')
        case Cell.C146: return new Audio('assets/audio/cells/i-crase.mp3')
        case Cell.C1456: return new Audio('assets/audio/cells/o-circunflexo.mp3')
        case Cell.C156: return new Audio('assets/audio/cells/u-crase.mp3')
        case Cell.C1246: return new Audio('assets/audio/cells/a-crase.mp3')
        case Cell.C12456: return new Audio('assets/audio/cells/n-til.mp3')
        case Cell.C1256: return new Audio('assets/audio/cells/u-trema.mp3')
        case Cell.C246: return new Audio('assets/audio/cells/o-til.mp3')
        case Cell.C2456: return new Audio('assets/audio/cells/w.mp3')

        case Cell.C2: return new Audio('assets/audio/cells/virgula.mp3')
        case Cell.C23: return new Audio('assets/audio/cells/ponto-e-virgula.mp3')
        case Cell.C25: return new Audio('assets/audio/cells/dois-pontos.mp3')
        case Cell.C256: return new Audio('assets/audio/cells/divisao.mp3')
        case Cell.C26: return new Audio('assets/audio/cells/interrogacao.mp3')
        case Cell.C235: return new Audio('assets/audio/cells/exclamacao.mp3')
        case Cell.C2356: return new Audio('assets/audio/cells/igual.mp3')
        case Cell.C236: return new Audio('assets/audio/cells/aspa.mp3')
        case Cell.C35: return new Audio('assets/audio/cells/asterisco.mp3')
        case Cell.C356: return new Audio('assets/audio/cells/grau.mp3')

        case Cell.C34: return new Audio('assets/audio/cells/i-agudo.mp3')
        case Cell.C345: return new Audio('assets/audio/cells/a-til.mp3')
        case Cell.C346: return new Audio('assets/audio/cells/o-agudo.mp3')
        case Cell.C3456: return new Audio('assets/audio/cells/sinal-de-numero.mp3')
        case Cell.C3: return new Audio('assets/audio/cells/ponto.mp3')
        case Cell.C36: return new Audio('assets/audio/cells/hifen.mp3')

        case Cell.C4: return new Audio('assets/audio/cells/circunflexo.mp3')
        case Cell.C45: return new Audio('assets/audio/cells/sinal-de-negacao.mp3')
        case Cell.C456: return new Audio('assets/audio/cells/barra.mp3')
        case Cell.C5: return new Audio('assets/audio/cells/sinal-de-delimitador.mp3')
        case Cell.C46: return new Audio('assets/audio/cells/sinal-de-maiusculo.mp3')
        case Cell.C56: return new Audio('assets/audio/cells/cifrao.mp3')
        case Cell.C6: return new Audio('assets/audio/cells/apostrofo.mp3')
    }
}

function getOutputMutedAudio() {
    return new Audio('assets/audio/actions/conversor-mutado.mp3')
}

function getOutputUnmutedAudio() {
    return new Audio('assets/audio/actions/conversor-desmutado.mp3')
}

function getEnterAudio() {
    return new Audio('assets/audio/keys/enter.mp3')
}
