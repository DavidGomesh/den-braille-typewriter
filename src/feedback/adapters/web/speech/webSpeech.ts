import type { SpeechOutput, SpeechRequest, SpeechResult } from '../../../speech'

export type WebSpeechVoice = Readonly<{
    name: string
    lang: string
    default: boolean
    localService: boolean
    platformValue?: unknown
}>

export type WebSpeechUtterance = {
    text: string
    lang?: string
    voice?: WebSpeechVoice
    rate?: number
    pitch?: number
    volume?: number
    onend?: () => void
    onerror?: (event: Readonly<{ error?: string }>) => void
    platformValue?: unknown
}

export type WebSpeechSynthesis = Readonly<{
    getVoices(): readonly WebSpeechVoice[]
    speak(utterance: WebSpeechUtterance): void
    cancel(): void
}>

export type WebSpeechUtteranceFactory = (text: string) => WebSpeechUtterance

const selectVoice = (
    voices: readonly WebSpeechVoice[],
    request: SpeechRequest,
): WebSpeechVoice | undefined => {
    const exact = voices.filter(
        (voice) => voice.lang.toLowerCase() === request.locale.toLowerCase(),
    )
    const language = request.locale.split('-')[0]?.toLowerCase()
    const compatible =
        exact.length > 0
            ? exact
            : voices.filter(
                  (voice) =>
                      voice.lang.split('-')[0]?.toLowerCase() === language,
              )
    if (request.voicePreference === 'local') {
        return compatible.find((voice) => voice.localService) ?? compatible[0]
    }
    return compatible.find((voice) => voice.default) ?? compatible[0]
}

/** Adapts Web Speech without exposing platform voice objects in preferences. */
export const createWebSpeechOutput = (
    synthesis: WebSpeechSynthesis,
    createUtterance: WebSpeechUtteranceFactory,
): SpeechOutput => {
    let cancelCurrent: (() => void) | undefined
    return {
        speak: async (request): Promise<SpeechResult> => {
            const voice = selectVoice(synthesis.getVoices(), request)
            if (voice === undefined) return 'unavailable'
            const utterance = createUtterance(request.text)
            Object.assign(utterance, {
                lang: request.locale,
                voice,
                rate: request.rate,
                pitch: request.pitch,
                volume: request.volume,
            })
            return new Promise((resolve) => {
                let settled = false
                const finish = (result: SpeechResult) => {
                    if (settled) return
                    settled = true
                    cancelCurrent = undefined
                    resolve(result)
                }
                cancelCurrent = () => finish('cancelled')
                utterance.onend = () => finish('completed')
                utterance.onerror = (event) =>
                    finish(event.error === 'canceled' ? 'cancelled' : 'failed')
                try {
                    synthesis.speak(utterance)
                } catch {
                    finish('failed')
                }
            })
        },
        cancel: () => {
            synthesis.cancel()
            cancelCurrent?.()
        },
    }
}

/** Discovers the browser implementation lazily and reports absence safely. */
export const createBrowserSpeechOutput = (): SpeechOutput | undefined => {
    if (
        typeof globalThis.speechSynthesis === 'undefined' ||
        typeof globalThis.SpeechSynthesisUtterance === 'undefined'
    )
        return undefined
    return createWebSpeechOutput(
        {
            getVoices: () =>
                globalThis.speechSynthesis.getVoices().map((voice) => ({
                    name: voice.name,
                    lang: voice.lang,
                    default: voice.default,
                    localService: voice.localService,
                    platformValue: voice,
                })),
            speak: (utterance) => {
                const native =
                    utterance.platformValue instanceof SpeechSynthesisUtterance
                        ? utterance.platformValue
                        : new SpeechSynthesisUtterance(utterance.text)
                native.lang = utterance.lang ?? ''
                native.voice = (utterance.voice?.platformValue ??
                    null) as SpeechSynthesisVoice | null
                native.rate = utterance.rate ?? 1
                native.pitch = utterance.pitch ?? 1
                native.volume = utterance.volume ?? 1
                native.onend = () => utterance.onend?.()
                native.onerror = (event) =>
                    utterance.onerror?.({ error: event.error })
                globalThis.speechSynthesis.speak(native)
            },
            cancel: () => globalThis.speechSynthesis.cancel(),
        },
        (text) => ({
            text,
            platformValue: new SpeechSynthesisUtterance(text),
        }),
    )
}
