import type { SpeechOutput, SpeechRequest, SpeechResult } from '../../../speech'

/** Portable projection of a platform voice; `name` is never persisted. */
export type WebSpeechVoice = Readonly<{
    name: string
    lang: string
    default: boolean
    localService: boolean
    platformValue?: unknown
}>

/** Mutable utterance boundary populated before platform playback. */
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

/** Minimum Web Speech capability required by the adapter. */
export type WebSpeechSynthesis = Readonly<{
    getVoices(): readonly WebSpeechVoice[]
    speak(utterance: WebSpeechUtterance): void
    cancel(): void
    addEventListener?(type: 'voiceschanged', listener: () => void): void
}>

/** Creates an utterance owned by the target speech platform. */
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
    let voices = synthesis.getVoices()
    synthesis.addEventListener?.('voiceschanged', () => {
        voices = synthesis.getVoices()
    })
    return {
        speak: async (request): Promise<SpeechResult> => {
            voices = synthesis.getVoices()
            const voice = selectVoice(voices, request)
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
    const nativeSynthesis = globalThis.speechSynthesis
    const NativeUtterance = globalThis.SpeechSynthesisUtterance
    return createWebSpeechOutput(
        {
            getVoices: () =>
                nativeSynthesis.getVoices().map((voice) => ({
                    name: voice.name,
                    lang: voice.lang,
                    default: voice.default,
                    localService: voice.localService,
                    platformValue: voice,
                })),
            speak: (utterance) => {
                const native =
                    utterance.platformValue instanceof NativeUtterance
                        ? utterance.platformValue
                        : new NativeUtterance(utterance.text)
                native.lang = utterance.lang ?? ''
                native.voice = (utterance.voice?.platformValue ??
                    null) as SpeechSynthesisVoice | null
                native.rate = utterance.rate ?? 1
                native.pitch = utterance.pitch ?? 1
                native.volume = utterance.volume ?? 1
                native.onend = () => utterance.onend?.()
                native.onerror = (event) =>
                    utterance.onerror?.({ error: event.error })
                nativeSynthesis.speak(native)
            },
            cancel: () => nativeSynthesis.cancel(),
            addEventListener:
                typeof nativeSynthesis.addEventListener === 'function'
                    ? (type, listener) =>
                          nativeSynthesis.addEventListener(type, listener)
                    : undefined,
        },
        (text) => ({
            text,
            platformValue: new NativeUtterance(text),
        }),
    )
}
