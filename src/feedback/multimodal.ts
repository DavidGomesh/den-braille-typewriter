import { freeModeInstructionsPortuguese } from './catalog/instructions'
import { resolvePortugueseFeedbackMessage } from './catalog/portuguese'
import type { MessageFeedbackPlan } from './feedback'
import type { SoundOutput } from './sound'
import type { SpeechOutput, SpeechRequest } from './speech'

/** Runtime choices required to coordinate optional speech and sound channels. */
export type MultimodalFeedbackPreferences = Readonly<{
    speech: Readonly<{
        enabled: boolean
        locale: string
        voicePreference: SpeechRequest['voicePreference']
        rate: number
        pitch: number
        volume: number
    }>
    sounds: Readonly<{ enabled: boolean }>
}>

/** Application-level controls for replaceable speech and sound outputs. */
export type MultimodalFeedbackController = Readonly<{
    deliverPlans(
        plans: readonly MessageFeedbackPlan[],
    ): readonly MessageFeedbackPlan[]
    requestInstructions(): void
    repeatSpeech(): void
    readProduction(text: string): void
    playMachineKey(): void
    applyPreferences(preferences: MultimodalFeedbackPreferences): void
    stop(): void
}>

/**
 * Coordinates channel policy without coupling pages to browser media APIs.
 *
 * Speech failures are reported through `onSpeechUnavailable`; they never reject
 * an input transition. Repetition uses the last request issued by this
 * controller, and stopping settles both currently active output channels.
 */
export const createMultimodalFeedbackController = (options: {
    speechOutput: SpeechOutput | undefined
    soundOutput: SoundOutput
    getPreferences: () => MultimodalFeedbackPreferences
    onSpeechUnavailable: () => void
    presentInstructionFallback: (text: string) => void
    presentAccessibleFallback: (plans: readonly MessageFeedbackPlan[]) => void
}): MultimodalFeedbackController => {
    let lastSpeechRequest: SpeechRequest | undefined

    const speak = (
        text: string,
        purpose: SpeechRequest['purpose'],
        onUnavailable?: () => void,
        requireEnabled = true,
    ) => {
        const speech = options.getPreferences().speech
        if (requireEnabled && !speech.enabled) return
        if (options.speechOutput === undefined) {
            options.onSpeechUnavailable()
            onUnavailable?.()
            return
        }
        const { enabled: _enabled, ...settings } = speech
        const request = Object.freeze({ text, purpose, ...settings })
        lastSpeechRequest = request
        void options.speechOutput.speak(request).then((result) => {
            if (result === 'unavailable' || result === 'failed') {
                options.onSpeechUnavailable()
                onUnavailable?.()
            }
        })
    }

    return Object.freeze({
        deliverPlans: (plans) => {
            const speechEnabled =
                options.getPreferences().speech.enabled &&
                options.speechOutput !== undefined
            plans.forEach((plan) => {
                if (plan.interruption !== 'none') options.speechOutput?.cancel()
                speak(
                    resolvePortugueseFeedbackMessage(plan.message),
                    'status',
                    () => options.presentAccessibleFallback(plans),
                )
            })
            return speechEnabled
                ? plans.map((plan) =>
                      Object.freeze({
                          ...plan,
                          channels: Object.freeze({
                              ...plan.channels,
                              accessible: 'off' as const,
                          }),
                      }),
                  )
                : plans
        },
        requestInstructions: () => {
            if (options.speechOutput !== undefined) {
                speak(
                    freeModeInstructionsPortuguese,
                    'instruction',
                    () =>
                        options.presentInstructionFallback(
                            freeModeInstructionsPortuguese,
                        ),
                    false,
                )
            } else {
                options.onSpeechUnavailable()
                options.presentInstructionFallback(
                    freeModeInstructionsPortuguese,
                )
            }
        },
        repeatSpeech: () => {
            if (lastSpeechRequest !== undefined)
                void options.speechOutput?.speak(lastSpeechRequest)
        },
        readProduction: (text) => speak(text, 'reading'),
        playMachineKey: () => {
            if (options.getPreferences().sounds.enabled)
                void options.soundOutput.play({ type: 'machine-key' })
        },
        applyPreferences: (preferences) => {
            if (!preferences.speech.enabled) options.speechOutput?.cancel()
            if (!preferences.sounds.enabled) options.soundOutput.cancel()
        },
        stop: () => {
            options.speechOutput?.cancel()
            options.soundOutput.cancel()
        },
    })
}
