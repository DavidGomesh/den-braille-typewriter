/** Portable request for application-owned speech. */
export type SpeechRequest = Readonly<{
    text: string
    locale: string
    purpose: 'reading' | 'instruction' | 'status' | 'result'
    voicePreference: 'default' | 'local'
    rate: number
    pitch: number
    volume: number
}>

/** Observable completion state of one speech request. */
export type SpeechResult = 'completed' | 'cancelled' | 'unavailable' | 'failed'

/** Substitutable application-speech seam. */
export type SpeechOutput = Readonly<{
    speak(request: SpeechRequest): Promise<SpeechResult>
    cancel(): void
}>
