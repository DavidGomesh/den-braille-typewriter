import type { PreferencesStorage } from '../../preferences'

/** Creates an isolated deterministic preferences adapter. */
export const createMemoryPreferencesStorage = (
    initialValue: string | null = null,
): PreferencesStorage => {
    let value = initialValue
    return Object.freeze({
        read: () => value,
        write: (serialized: string) => {
            value = serialized
        },
    })
}
