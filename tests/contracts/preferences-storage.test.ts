import { describe, expect, test } from 'vitest'

import {
    createDefaultSimulatorPreferences,
    createLocalStoragePreferencesStorage,
    createMemoryPreferencesStorage,
    loadSimulatorPreferences,
    saveSimulatorPreferences,
    type PreferencesStorage,
} from '../../src/preferences/public'

type StorageFactory = () => PreferencesStorage

const createWebStorage = (): StorageFactory => {
    const values = new Map<string, string>()
    return () =>
        createLocalStoragePreferencesStorage({
            getItem: (key) => values.get(key) ?? null,
            setItem: (key, value) => values.set(key, value),
        })
}

describe.each<[string, StorageFactory]>([
    ['memory adapter', () => createMemoryPreferencesStorage()],
    ['web local-storage adapter', createWebStorage()],
])('%s', (_name, createStorage) => {
    test('satisfies the simulator-preferences storage seam', () => {
        const storage = createStorage()
        const preferences = {
            ...createDefaultSimulatorPreferences(),
            presentation: {
                view: 'ink' as const,
            },
        }

        expect(loadSimulatorPreferences(storage).status).toBe('defaulted')
        expect(saveSimulatorPreferences(storage, preferences)).toEqual({
            status: 'saved',
        })
        expect(loadSimulatorPreferences(storage)).toEqual({
            status: 'loaded',
            preferences,
        })
    })
})
