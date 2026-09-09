import type { PreferencesStorage } from '../../../preferences'

/** Browser storage operations required by the local-storage adapter. */
export type WebStorage = Readonly<{
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
}>

export const simulatorPreferencesStorageKey =
    'den-braille-typewriter.preferences'

/** Adapts browser local storage to the simulator-preferences storage seam. */
export const createLocalStoragePreferencesStorage = (
    storage?: WebStorage,
): PreferencesStorage =>
    Object.freeze({
        read: () =>
            (storage ?? globalThis.localStorage).getItem(
                simulatorPreferencesStorageKey,
            ),
        write: (serialized: string) =>
            (storage ?? globalThis.localStorage).setItem(
                simulatorPreferencesStorageKey,
                serialized,
            ),
    })
