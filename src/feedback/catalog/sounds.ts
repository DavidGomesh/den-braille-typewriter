import type { SoundCue } from '../sound'

const editorialAssets: Readonly<Record<string, string>> = Object.freeze({
    'free-instructions': 'assets/audio/views/free/instrucoes-modo-livre.mp3',
})

const machineKeyAssets = Object.freeze([
    'assets/audio/keys/key-pressed-1.mp3',
    'assets/audio/keys/key-pressed-2.mp3',
    'assets/audio/keys/key-pressed-3.mp3',
    'assets/audio/keys/key-pressed-4.mp3',
])

export const resolveSoundAsset = (
    cue: SoundCue,
    random: () => number,
): string | undefined => {
    if (cue.type === 'editorial') return editorialAssets[cue.id]
    const index = Math.floor(random() * machineKeyAssets.length)
    return machineKeyAssets[index]
}
