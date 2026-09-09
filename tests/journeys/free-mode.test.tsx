import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

const machineKeyAudio = () =>
    AudioStub.instances.find((audio) =>
        audio.src.includes('assets/audio/keys/key-pressed-'),
    )

beforeEach(() => {
    AudioStub.instances = []
    globalThis.Audio = AudioStub as unknown as typeof Audio
    globalThis.localStorage.clear()
})

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

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
    press(secondTypewriter, 'KeyF')

    await waitFor(() => {
        expect(machineKeyAudio()?.play).toHaveBeenCalled()
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

test('Free Mode presents equivalent visual and accessible feedback without moving focus', () => {
    renderFreeMode()
    const typewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })

    act(() => typewriter.focus())

    const accessibleFeedback = screen.getByRole('status', {
        name: 'Feedback da sessão',
    })
    expect(accessibleFeedback).toHaveTextContent('Captura de acordes ativada.')
    expect(
        screen.getByText('Captura de acordes ativada.', { selector: 'p' }),
    ).toBeVisible()
    expect(typewriter).toHaveFocus()

    press(typewriter, 'ArrowRight')

    expect(accessibleFeedback).toHaveTextContent(
        'Revisão movida para linha 1, coluna 2.',
    )
    expect(
        screen.getByText('Revisão movida para linha 1, coluna 2.', {
            selector: 'p',
        }),
    ).toBeVisible()
    expect(typewriter).toHaveFocus()
})

test('Free Mode preserves every important fact from an interrupted chord', () => {
    renderFreeMode()
    const typewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })

    act(() => typewriter.focus())
    fireEvent.keyDown(typewriter, { code: 'KeyF' })
    fireEvent.blur(typewriter, { relatedTarget: document.body })

    const accessibleFeedback = screen.getByRole('status', {
        name: 'Feedback da sessão',
    })
    expect(accessibleFeedback).toHaveTextContent(
        'Acorde incompleto descartado durante a interrupção.',
    )
    expect(accessibleFeedback).toHaveTextContent(
        'Captura interrompida porque a área de digitação perdeu o foco; o acorde incompleto foi descartado.',
    )
})

test('Free Mode speaks canonical feedback and lets the user repeat or stop it', () => {
    class UtteranceStub {
        lang = ''
        voice: unknown
        rate = 1
        pitch = 1
        volume = 1
        onend?: () => void
        onerror?: (event: { error?: string }) => void

        constructor(public text: string) {}
    }
    const voice = {
        name: 'Português local',
        lang: 'pt-BR',
        default: true,
        localService: true,
    }
    const synthesis = {
        getVoices: vi.fn(() => [voice]),
        speak: vi.fn((utterance: UtteranceStub) => utterance.onend?.()),
        cancel: vi.fn(),
    }
    vi.stubGlobal('SpeechSynthesisUtterance', UtteranceStub)
    vi.stubGlobal('speechSynthesis', synthesis)
    const defaults = createDefaultSimulatorPreferences()
    globalThis.localStorage.setItem(
        simulatorPreferencesStorageKey,
        JSON.stringify({
            ...defaults,
            feedback: {
                ...defaults.feedback,
                speech: { ...defaults.feedback.speech, enabled: true },
            },
        }),
    )
    renderFreeMode()
    const typewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })

    act(() => typewriter.focus())

    expect(synthesis.speak).toHaveBeenCalledWith(
        expect.objectContaining({
            text: 'Captura de acordes ativada.',
            lang: 'pt-BR',
            voice,
        }),
    )
    press(typewriter, 'KeyR')
    expect(synthesis.speak).toHaveBeenCalledTimes(2)
    press(typewriter, 'KeyP')
    expect(synthesis.cancel).toHaveBeenCalledOnce()
    expect(typewriter).toHaveFocus()
})

test('Free Mode remains usable when speech and sounds are unavailable', () => {
    vi.stubGlobal('Audio', undefined)
    renderFreeMode()
    const typewriter = screen.getByRole('region', {
        name: 'Área de digitação Braille',
    })

    act(() => typewriter.focus())
    press(typewriter, 'KeyM')
    press(typewriter, 'KeyO')
    press(typewriter, 'KeyF')
    press(typewriter, 'Space')
    press(typewriter, 'Backspace')
    chord(typewriter, ['KeyF', 'KeyD'])
    press(typewriter, 'ArrowRight')

    expect(screen.getByRole('textbox')).toHaveValue('ab')
    expect(screen.getByText(/Leitura falada:/)).toHaveTextContent(
        'Leitura falada: ativada. Sons da máquina: desativados.',
    )
    expect(
        screen.getByRole('status', { name: 'Estado da sessão' }),
    ).toHaveTextContent('revisão: linha 1, coluna 2')
    expect(screen.getByRole('alert')).toHaveTextContent(
        'A leitura falada está indisponível; o texto e as mensagens acessíveis continuam ativos.',
    )
    expect(typewriter).toHaveFocus()
})
