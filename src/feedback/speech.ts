/**
 * Portable request for application-owned speech.
 *
 * `locale` is a non-empty BCP 47 tag; rate is 0.1–10, pitch 0–2 and volume
 * 0–1. `voicePreference` is deliberately logical and must never be replaced by
 * a persisted platform voice name. Purpose lets adapters preserve the product
 * distinction between reading, instructions, status and results.
 */
export type SpeechRequest = Readonly<{
    text: string
    locale: string
    purpose: 'reading' | 'instruction' | 'status' | 'result'
    voicePreference: 'default' | 'local'
    rate: number
    pitch: number
    volume: number
}>

/** Observable completion state; unavailable and failed requests never throw. */
export type SpeechResult = 'completed' | 'cancelled' | 'unavailable' | 'failed'

/**
 * Substitutable application-speech seam.
 *
 * `speak` settles once playback ends, is cancelled, is unavailable or fails.
 * `cancel` settles the active request as cancelled and is safe when idle.
 */
export type SpeechOutput = Readonly<{
    speak(request: SpeechRequest): Promise<SpeechResult>
    cancel(): void
}>
