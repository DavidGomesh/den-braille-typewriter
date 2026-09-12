import { describe, expect, it, vi } from 'vitest'

import {
    createMultimodalFeedbackController,
    type MessageFeedbackPlan,
    type SoundOutput,
    type SpeechOutput,
} from '../../src/feedback/public'
import { createDefaultSimulatorPreferences } from '../../src/preferences/public'

const plan: MessageFeedbackPlan = Object.freeze({
    disposition: 'message',
    message: Object.freeze({
        id: 'capture-activated',
        parameters: Object.freeze({}),
    }),
    priority: 'normal',
    repetition: 'replace',
    interruption: 'all',
    channels: Object.freeze({ visual: true, accessible: 'polite' }),
})

const setup = (speechEnabled = true, soundsEnabled = true) => {
    const speech: SpeechOutput = {
        speak: vi.fn().mockResolvedValue('completed'),
        cancel: vi.fn(),
    }
    const sound: SoundOutput = {
        play: vi.fn().mockResolvedValue('completed'),
        cancel: vi.fn(),
    }
    const defaults = createDefaultSimulatorPreferences()
    const preferences = {
        ...defaults.feedback,
        speech: { ...defaults.feedback.speech, enabled: speechEnabled },
        sounds: { enabled: soundsEnabled },
    }
    const unavailable = vi.fn()
    const instructionFallback = vi.fn()
    const accessibleFallback = vi.fn()
    const controller = createMultimodalFeedbackController({
        speechOutput: speech,
        soundOutput: sound,
        getPreferences: () => preferences,
        onSpeechUnavailable: unavailable,
        presentInstructionFallback: instructionFallback,
        presentAccessibleFallback: accessibleFallback,
    })
    return {
        controller,
        speech,
        sound,
        unavailable,
        instructionFallback,
        accessibleFallback,
    }
}

describe('multimodal feedback controller', () => {
    it('delivers canonical messages and applies interruption policy', async () => {
        const { controller, speech } = setup()

        const presentationPlans = controller.deliverPlans([plan])
        await Promise.resolve()

        expect(speech.cancel).toHaveBeenCalledOnce()
        expect(presentationPlans[0]?.channels.accessible).toBe('off')
        expect(speech.speak).toHaveBeenCalledWith(
            expect.objectContaining({
                text: 'Captura de acordes ativada.',
                purpose: 'status',
                locale: 'pt-BR',
            }),
        )
    })

    it('owns instructions, repetition, stopping, and optional sounds', async () => {
        const { controller, speech, sound } = setup()

        controller.requestInstructions()
        await Promise.resolve()
        controller.repeatSpeech()
        controller.playMachineKey()
        controller.readProduction('a')
        controller.applyPreferences({
            ...createDefaultSimulatorPreferences().feedback,
            speech: {
                ...createDefaultSimulatorPreferences().feedback.speech,
                enabled: true,
            },
            sounds: { enabled: false },
        })
        controller.stop()

        expect(speech.speak).toHaveBeenCalledTimes(3)
        expect(speech.speak).toHaveBeenCalledWith(
            expect.objectContaining({ text: 'a', purpose: 'reading' }),
        )
        expect(sound.play).toHaveBeenCalledWith({ type: 'machine-key' })
        expect(speech.cancel).toHaveBeenCalledOnce()
        expect(sound.cancel).toHaveBeenCalledTimes(2)
    })

    it('keeps every operation safe when audio is disabled or unavailable', async () => {
        const disabled = setup(false, false)
        const disabledPlans = disabled.controller.deliverPlans([plan])
        disabled.controller.requestInstructions()
        disabled.controller.repeatSpeech()
        disabled.controller.playMachineKey()
        expect(disabled.speech.speak).toHaveBeenCalledTimes(2)
        expect(disabled.speech.speak).toHaveBeenCalledWith(
            expect.objectContaining({ purpose: 'instruction' }),
        )
        expect(disabled.sound.play).not.toHaveBeenCalled()
        expect(disabledPlans[0]?.channels.accessible).toBe('polite')

        const unavailable = setup()
        const controller = createMultimodalFeedbackController({
            speechOutput: undefined,
            soundOutput: unavailable.sound,
            getPreferences: () => ({
                ...createDefaultSimulatorPreferences().feedback,
                speech: {
                    ...createDefaultSimulatorPreferences().feedback.speech,
                    enabled: true,
                },
            }),
            onSpeechUnavailable: unavailable.unavailable,
            presentInstructionFallback: unavailable.instructionFallback,
            presentAccessibleFallback: unavailable.accessibleFallback,
        })
        const unavailablePlans = controller.deliverPlans([plan])
        controller.requestInstructions()
        expect(unavailable.unavailable).toHaveBeenCalledTimes(2)
        expect(unavailable.instructionFallback).toHaveBeenCalledOnce()
        expect(unavailablePlans[0]?.channels.accessible).toBe('polite')
        expect(unavailable.accessibleFallback).toHaveBeenCalledWith([plan])

        const failedSpeech = setup(true, true)
        vi.mocked(failedSpeech.speech.speak).mockResolvedValue('failed')
        const initiallySpoken = failedSpeech.controller.deliverPlans([plan])
        expect(initiallySpoken[0]?.channels.accessible).toBe('off')
        await Promise.resolve()
        expect(failedSpeech.accessibleFallback).toHaveBeenCalledWith([plan])

        const failedInstruction = setup(false, true)
        vi.mocked(failedInstruction.speech.speak).mockResolvedValue('failed')
        failedInstruction.controller.requestInstructions()
        await Promise.resolve()
        expect(failedInstruction.instructionFallback).toHaveBeenCalledOnce()
    })
})
