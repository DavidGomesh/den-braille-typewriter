import { resolveSoundAsset } from '../../../catalog/sounds'
import type { SoundCue, SoundOutput, SoundResult } from '../../../sound'

export type WebAudio = {
    currentTime: number
    onended: null | ((event: Event) => unknown)
    play(): Promise<void>
    pause(): void
}

export type WebAudioFactory = (asset: string) => WebAudio

/** Plays semantic sound cues through replaceable browser audio elements. */
export const createWebSoundOutput = (
    createAudio: WebAudioFactory = (asset) => new Audio(asset),
    random: () => number = Math.random,
): SoundOutput => {
    let current: WebAudio | undefined
    let cancelCurrent: (() => void) | undefined

    return {
        play: async (cue: SoundCue): Promise<SoundResult> => {
            const asset = resolveSoundAsset(cue, random)
            if (asset === undefined) return 'unavailable'
            let audio: WebAudio
            try {
                audio = createAudio(asset)
            } catch {
                return 'failed'
            }
            current = audio
            return new Promise((resolve) => {
                let settled = false
                const finish = (result: SoundResult) => {
                    if (settled) return
                    settled = true
                    if (current === audio) current = undefined
                    resolve(result)
                }
                cancelCurrent = () => finish('cancelled')
                audio.onended = () => finish('completed')
                try {
                    void audio.play().catch(() => finish('failed'))
                } catch {
                    finish('failed')
                }
            })
        },
        cancel: () => {
            if (current === undefined) return
            current.pause()
            current.currentTime = 0
            cancelCurrent?.()
            current = undefined
        },
    }
}
