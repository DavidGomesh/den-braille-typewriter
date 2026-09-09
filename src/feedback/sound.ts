/** Semantic sound request independent of an asset path or platform player. */
export type SoundCue =
    | Readonly<{ type: 'machine-key' }>
    | Readonly<{ type: 'editorial'; id: string }>

export type SoundResult = 'completed' | 'cancelled' | 'unavailable' | 'failed'

/**
 * Substitutable optional-sound seam.
 *
 * Starting a cue replaces the currently active cue. Results report platform
 * absence and failures without throwing; `cancel` is safe when idle.
 */
export type SoundOutput = Readonly<{
    play(cue: SoundCue): Promise<SoundResult>
    cancel(): void
}>
