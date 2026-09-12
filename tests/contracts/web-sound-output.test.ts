import { describe, expect, test, vi } from 'vitest'

import { createWebSoundOutput, type WebAudio } from '../../src/feedback/public'

describe('Web sound output', () => {
    test('resolves semantic cues and exposes completion', async () => {
        const play = vi.fn().mockResolvedValue(undefined)
        const audio: WebAudio = {
            play,
            pause: vi.fn(),
            currentTime: 0,
            onended: null,
        }
        const output = createWebSoundOutput(
            () => audio,
            () => 0,
        )

        const completion = output.play({ type: 'machine-key' })
        audio.onended?.(new Event('ended'))

        await expect(completion).resolves.toBe('completed')
        expect(play).toHaveBeenCalledOnce()
    })

    test('cancels the current sound and reports unavailable assets', async () => {
        const audio: WebAudio = {
            play: vi.fn().mockResolvedValue(undefined),
            pause: vi.fn(),
            currentTime: 4,
            onended: null,
        }
        const output = createWebSoundOutput(
            () => audio,
            () => 0,
        )

        void output.play({ type: 'machine-key' })
        output.cancel()

        expect(audio.pause).toHaveBeenCalledOnce()
        expect(audio.currentTime).toBe(0)
        await expect(
            output.play({ type: 'editorial', id: 'missing' }),
        ).resolves.toBe('unavailable')
    })

    test('reports player creation failure without throwing', async () => {
        const output = createWebSoundOutput(() => {
            throw new Error('audio unavailable')
        })

        await expect(output.play({ type: 'machine-key' })).resolves.toBe(
            'failed',
        )
    })

    test('replaces and settles a previous overlapping sound', async () => {
        const audios = [0, 1].map(() => ({
            play: vi.fn().mockResolvedValue(undefined),
            pause: vi.fn(),
            currentTime: 3,
            onended: null,
        }))
        const output = createWebSoundOutput(() => audios.shift()!)

        const first = output.play({ type: 'machine-key' })
        void output.play({ type: 'machine-key' })

        await expect(first).resolves.toBe('cancelled')
        expect(audios).toHaveLength(0)
    })
})
