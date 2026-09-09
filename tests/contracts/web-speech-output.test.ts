import { describe, expect, test, vi } from 'vitest'

import { createWebSpeechOutput } from '../../src/feedback/public'

describe('Web Speech output', () => {
    test('speaks canonical text with purpose and portable voice preferences', async () => {
        const exactRemote = {
            name: 'Remote Portuguese',
            lang: 'pt-BR',
            default: true,
            localService: false,
        }
        const exactLocal = {
            name: 'Local Portuguese',
            lang: 'pt-BR',
            default: false,
            localService: true,
        }
        const speak = vi.fn((utterance: { onend?: () => void }) =>
            utterance.onend?.(),
        )
        const synthesis = {
            getVoices: () => [exactRemote, exactLocal],
            speak,
            cancel: vi.fn(),
        }
        const output = createWebSpeechOutput(synthesis, (text) => ({ text }))

        const result = await output.speak({
            text: 'Captura de acordes ativada.',
            locale: 'pt-BR',
            purpose: 'status',
            voicePreference: 'local',
            rate: 1.2,
            pitch: 0.9,
            volume: 0.8,
        })

        expect(result).toBe('completed')
        expect(speak).toHaveBeenCalledWith(
            expect.objectContaining({
                text: 'Captura de acordes ativada.',
                lang: 'pt-BR',
                voice: exactLocal,
                rate: 1.2,
                pitch: 0.9,
                volume: 0.8,
            }),
        )
    })

    test('falls back to the base language and reports unavailable explicitly', async () => {
        const portuguese = {
            name: 'Portuguese',
            lang: 'pt-PT',
            default: true,
            localService: true,
        }
        const synthesis = {
            getVoices: () => [portuguese],
            speak: vi.fn((utterance: { onend?: () => void }) =>
                utterance.onend?.(),
            ),
            cancel: vi.fn(),
        }
        const output = createWebSpeechOutput(synthesis, (text) => ({ text }))
        const request = {
            text: 'Mensagem',
            locale: 'pt-BR',
            purpose: 'instruction' as const,
            voicePreference: 'default' as const,
            rate: 1,
            pitch: 1,
            volume: 1,
        }

        expect(await output.speak(request)).toBe('completed')
        expect(synthesis.speak).toHaveBeenLastCalledWith(
            expect.objectContaining({ voice: portuguese }),
        )

        synthesis.getVoices = () => []
        expect(await output.speak(request)).toBe('unavailable')
    })

    test('cancels current speech through the platform seam', () => {
        const voice = {
            name: 'Portuguese',
            lang: 'pt-BR',
            default: true,
            localService: true,
        }
        const synthesis = {
            getVoices: () => [voice],
            speak: vi.fn(),
            cancel: vi.fn(),
        }
        const output = createWebSpeechOutput(synthesis, (text) => ({ text }))

        const completion = output.speak({
            text: 'Mensagem',
            locale: 'pt-BR',
            purpose: 'status',
            voicePreference: 'default',
            rate: 1,
            pitch: 1,
            volume: 1,
        })
        output.cancel()

        expect(synthesis.cancel).toHaveBeenCalledOnce()
        return expect(completion).resolves.toBe('cancelled')
    })
})
