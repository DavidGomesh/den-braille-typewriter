import '@testing-library/jest-dom'

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import AudioProvider from '../providers/AudioProvider.tsx'
import Home from '../views/Home.tsx'
import Challenge from '../views/modes/Challenge.tsx'
import Free from '../views/modes/Free.tsx'

class AudioStub {
    static instances: AudioStub[] = []

    currentTime = 0
    onended: null | (() => void) = null
    pause = jest.fn()
    play = jest.fn().mockResolvedValue(undefined)

    constructor(public src: string) {
        AudioStub.instances.push(this)
    }
}

function renderWithAudio(component: React.ReactElement) {
    return render(
        <AudioProvider>
            <MemoryRouter>{component}</MemoryRouter>
        </AudioProvider>
    )
}

function press(target: Element, code: string) {
    fireEvent.keyDown(target, { code })
    fireEvent.keyUp(target, { code })
}

function chord(target: Element, codes: string[]) {
    for (const code of codes) fireEvent.keyDown(target, { code })
    for (const code of codes) fireEvent.keyUp(target, { code })
}

const letterChords = {
    a: ['KeyF'], b: ['KeyF', 'KeyD'], c: ['KeyF', 'KeyJ'],
    d: ['KeyF', 'KeyJ', 'KeyK'], e: ['KeyF', 'KeyK'],
    f: ['KeyF', 'KeyD', 'KeyJ'], g: ['KeyF', 'KeyD', 'KeyJ', 'KeyK'],
    h: ['KeyF', 'KeyD', 'KeyK'], i: ['KeyD', 'KeyJ'],
    j: ['KeyD', 'KeyJ', 'KeyK'], k: ['KeyF', 'KeyS'],
    l: ['KeyF', 'KeyD', 'KeyS'], m: ['KeyF', 'KeyS', 'KeyJ'],
    n: ['KeyF', 'KeyS', 'KeyJ', 'KeyK'], o: ['KeyF', 'KeyS', 'KeyK'],
    p: ['KeyF', 'KeyD', 'KeyS', 'KeyJ'],
    q: ['KeyF', 'KeyD', 'KeyS', 'KeyJ', 'KeyK'],
    r: ['KeyF', 'KeyD', 'KeyS', 'KeyK'], s: ['KeyD', 'KeyS', 'KeyJ'],
    t: ['KeyD', 'KeyS', 'KeyJ', 'KeyK'], u: ['KeyF', 'KeyS', 'KeyL'],
    v: ['KeyF', 'KeyD', 'KeyS', 'KeyL'],
    x: ['KeyF', 'KeyS', 'KeyJ', 'KeyL'],
    y: ['KeyF', 'KeyS', 'KeyJ', 'KeyK', 'KeyL'],
    z: ['KeyF', 'KeyS', 'KeyK', 'KeyL'],
    ç: ['KeyF', 'KeyD', 'KeyS', 'KeyJ', 'KeyL'],
    é: ['KeyF', 'KeyD', 'KeyS', 'KeyJ', 'KeyK', 'KeyL'],
    ã: ['KeyS', 'KeyJ', 'KeyK'],
}

function audioEndingWith(path: string) {
    return AudioStub.instances.find(audio => audio.src.endsWith(path))
}

beforeEach(() => {
    AudioStub.instances = []
    global.Audio = AudioStub as unknown as typeof Audio
})

afterEach(() => {
    jest.restoreAllMocks()
})

test('início oferece Modo livre e Modo desafio por links focáveis com áudio', async () => {
    renderWithAudio(<Home />)

    const freeMode = screen.getByRole('link', { name: 'Modo livre' })
    const challengeMode = screen.getByRole('link', { name: 'Modo desafio' })

    expect(freeMode).toHaveAttribute('href', '/free')
    expect(challengeMode).toHaveAttribute('href', '/lessons')

    fireEvent.focus(freeMode)
    fireEvent.focus(challengeMode)

    await waitFor(() => {
        expect(audioEndingWith('modo-livre.mp3')?.play).toHaveBeenCalled()
        expect(audioEndingWith('modo-desafio.mp3')?.play).toHaveBeenCalled()
    })
})

test('Modo livre produz conteúdo e mantém a saída ao alternar apresentação e áudio', async () => {
    const { container } = renderWithAudio(<Free />)
    const typewriter = container.querySelector('#typewriter') as HTMLElement
    const output = screen.getByRole('textbox') as HTMLTextAreaElement

    press(typewriter, 'KeyF')
    press(typewriter, 'Space')
    press(typewriter, 'KeyQ')
    press(typewriter, 'KeyT')
    press(typewriter, 'KeyO')
    press(typewriter, 'KeyM')
    press(typewriter, 'KeyI')

    expect(output).toHaveValue('a_\n')
    expect(output).not.toHaveClass('braille')
    await waitFor(() => {
        expect(audioEndingWith('instrucoes-modo-livre.mp3')?.play).toHaveBeenCalled()
    })
})

test('Modo desafio informa erro e avança após resposta correta por acordes', async () => {
    const random = jest.spyOn(Math, 'random').mockReturnValue(0)

    const { container } = renderWithAudio(<Challenge />)
    const typewriter = container.querySelector('#typewriter') as HTMLElement

    const wordLabel = await screen.findByText(/^Palavra: /)
    const word = wordLabel.textContent?.replace('Palavra: ', '') as keyof typeof letterChords
    press(typewriter, 'KeyR')
    press(typewriter, 'KeyI')
    press(typewriter, 'Enter')

    await waitFor(() => {
        expect(audioEndingWith('resposta-errada.mp3')?.play).toHaveBeenCalled()
        expect(audioEndingWith(`words/${word.replace('é', 'e').replace('ã', 'a')}.mp3`)?.play)
            .toHaveBeenCalled()
    })

    for (const letter of word) {
        chord(typewriter, letterChords[letter as keyof typeof letterChords])
    }
    press(typewriter, 'Enter')

    const successAudio = await waitFor(() => {
        const audio = audioEndingWith('certa-resposta.mp3')
        expect(audio?.play).toHaveBeenCalled()
        return audio as AudioStub
    })

    const selectionsBeforeSuccess = random.mock.calls.length
    random.mockReturnValue(0.1)
    await act(async () => successAudio.onended?.())

    await waitFor(() => expect(random.mock.calls.length).toBeGreaterThan(selectionsBeforeSuccess))
    expect(screen.getByText(/^Palavra: /)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('')
})
