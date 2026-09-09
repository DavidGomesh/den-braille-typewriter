import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import AudioProvider from '../../src/providers/AudioProvider'
import Free from '../../src/views/modes/Free'

class AudioStub {
    static instances: AudioStub[] = []

    currentTime = 0
    onended: null | (() => void) = null
    pause = vi.fn()
    play = vi.fn().mockResolvedValue(undefined)

    constructor(public src: string) {
        AudioStub.instances.push(this)
    }
}

const renderFreeMode = () =>
    render(
        <AudioProvider>
            <MemoryRouter>
                <Free />
            </MemoryRouter>
        </AudioProvider>,
    )

const press = (target: Element, code: string) => {
    fireEvent.keyDown(target, { code })
    fireEvent.keyUp(target, { code })
}

const chord = (target: Element, codes: string[]) => {
    codes.forEach((code) => fireEvent.keyDown(target, { code }))
    codes.forEach((code) => fireEvent.keyUp(target, { code }))
}

const audioEndingWith = (path: string) =>
    AudioStub.instances.find((audio) => audio.src.endsWith(path))

beforeEach(() => {
    AudioStub.instances = []
    globalThis.Audio = AudioStub as unknown as typeof Audio
})

afterEach(() => vi.restoreAllMocks())

test('Modo livre digita pelo teclado focado sem criar outra fonte de verdade', async () => {
    renderFreeMode()
    const typewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })
    const output = screen.getByRole('textbox') as HTMLTextAreaElement

    expect(fireEvent.keyDown(document.body, { code: 'KeyF' })).toBe(true)
    expect(output).toHaveValue('')

    fireEvent.focus(typewriter)
    press(typewriter, 'KeyF')
    press(typewriter, 'Space')
    press(typewriter, 'Backspace')
    chord(typewriter, ['KeyF', 'KeyD'])
    press(typewriter, 'Space')
    press(typewriter, 'KeyQ')
    press(typewriter, 'KeyJ')
    press(typewriter, 'KeyT')
    press(typewriter, 'KeyO')
    press(typewriter, 'KeyM')
    press(typewriter, 'KeyI')

    expect(output).toHaveValue('ab_\n^')
    expect(output).toHaveAttribute('readonly')
    expect(output).not.toHaveClass('braille')
    await waitFor(() => {
        expect(
            audioEndingWith('instrucoes-modo-livre.mp3')?.play,
        ).toHaveBeenCalled()
    })
})

test('Modo livre interrompe acorde incompleto e permite pausar a captura', () => {
    renderFreeMode()
    const typewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })
    const output = screen.getByRole('textbox')
    const captureStatus = screen.getByRole('status')

    expect(captureStatus).toHaveTextContent('Captura inativa')
    fireEvent.focus(typewriter)
    fireEvent.keyDown(typewriter, { code: 'KeyF' })
    fireEvent.blur(typewriter, { relatedTarget: document.body })
    fireEvent.keyUp(typewriter, { code: 'KeyF' })

    expect(captureStatus).toHaveTextContent('Captura inativa')
    expect(output).toHaveValue('')

    fireEvent.focus(typewriter)
    press(typewriter, 'KeyF')
    press(typewriter, 'ArrowRight')
    expect(output).toHaveValue('a')
    expect(captureStatus).toHaveTextContent('revisão: linha 1, coluna 2')

    press(typewriter, 'Escape')
    expect(captureStatus).toHaveTextContent('Captura inativa')
    press(typewriter, 'Escape')
    expect(captureStatus).toHaveTextContent('Captura ativa')
})
