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
    storage: WebStorage = globalThis.localStorage,
    key: string = simulatorPreferencesStorageKey,
): PreferencesStorage =>
    Object.freeze({
        read: () => storage.getItem(key),
        write: (serialized: string) => storage.setItem(key, serialized),
    })
