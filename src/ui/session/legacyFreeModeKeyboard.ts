/** Presentation actions retained by the temporary legacy free-mode adapter. */
export type LegacyFreeModeAction =
    | 'instructions-requested'
    | 'view-toggled'
    | 'output-audio-toggled'
    | 'keyboard-audio-toggled'
    | 'speech-stopped'
    | 'speech-repeated'

const actionByCode = new Map<string, LegacyFreeModeAction>([
    ['KeyI', 'instructions-requested'],
    ['KeyT', 'view-toggled'],
    ['KeyO', 'output-audio-toggled'],
    ['KeyM', 'keyboard-audio-toggled'],
    ['KeyP', 'speech-stopped'],
    ['KeyR', 'speech-repeated'],
])

/** Converts a plain keyboard event into a legacy presentation action. */
export const legacyFreeModeActionForKey = (
    event: Readonly<{
        code: string
        repeat: boolean
        ctrlKey: boolean
        altKey: boolean
        metaKey: boolean
    }>,
): LegacyFreeModeAction | undefined =>
    event.repeat || event.ctrlKey || event.altKey || event.metaKey
        ? undefined
        : actionByCode.get(event.code)
