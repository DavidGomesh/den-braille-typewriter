import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import AudioProvider from '../../src/providers/AudioProvider'
import {
    createDefaultSimulatorPreferences,
    simulatorPreferencesStorageKey,
} from '../../src/preferences/public'
import { FreePage } from '../../src/app/public'

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
                <FreePage />
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
    globalThis.localStorage.clear()
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

test('Free Mode preserves presentation preferences between typing sessions', async () => {
    const firstSession = renderFreeMode()
    const firstTypewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })

    fireEvent.focus(firstTypewriter)
    press(firstTypewriter, 'KeyT')
    press(firstTypewriter, 'KeyO')
    press(firstTypewriter, 'KeyM')
    expect(screen.getByRole('textbox')).not.toHaveClass('braille')

    firstSession.unmount()
    AudioStub.instances = []
    renderFreeMode()
    const secondTypewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })

    expect(screen.getByRole('textbox')).not.toHaveClass('braille')
    fireEvent.focus(secondTypewriter)
    press(secondTypewriter, 'KeyO')
    press(secondTypewriter, 'KeyM')

    await waitFor(() => {
        expect(
            audioEndingWith('conversor-desmutado.mp3')?.play,
        ).toHaveBeenCalled()
        expect(
            audioEndingWith('teclado-desmutado.mp3')?.play,
        ).toHaveBeenCalled()
    })
})

test('Free Mode keeps the current session usable when persistence fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage denied')
    })
    renderFreeMode()
    const typewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })

    fireEvent.focus(typewriter)
    press(typewriter, 'KeyT')
    press(typewriter, 'KeyF')

    expect(screen.getByRole('textbox')).not.toHaveClass('braille')
    expect(screen.getByRole('textbox')).toHaveValue('a')
    expect(screen.getByRole('alert')).toHaveTextContent(
        'A preferência foi aplicada nesta sessão, mas não pôde ser salva.',
    )
})

test('Free Mode uses persisted keyboard bindings in a new session', () => {
    const defaults = createDefaultSimulatorPreferences()
    globalThis.localStorage.setItem(
        simulatorPreferencesStorageKey,
        JSON.stringify({
            ...defaults,
            keyboardBindings: {
                ...defaults.keyboardBindings,
                dot1: 'KeyA',
            },
        }),
    )
    renderFreeMode()
    const typewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })

    fireEvent.focus(typewriter)
    press(typewriter, 'KeyF')
    expect(screen.getByRole('textbox')).toHaveValue('')
    press(typewriter, 'KeyA')
    expect(screen.getByRole('textbox')).toHaveValue('a')
})
