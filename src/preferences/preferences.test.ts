import { describe, expect, test } from 'vitest'

import {
    applySimulatorPreferenceChange,
    createDefaultSimulatorPreferences,
    loadSimulatorPreferences,
    resolveEffectiveSessionConfiguration,
    saveSimulatorPreferences,
} from './public'

describe('Simulator preferences', () => {
    test('uses an explicit fallback when persisted data is missing', () => {
        const result = loadSimulatorPreferences({
            read: () => null,
            write: () => undefined,
        })

        expect(result).toEqual({
            status: 'defaulted',
            reason: 'missing',
            preferences: createDefaultSimulatorPreferences(),
        })
    })

    test('loads valid versioned preferences', () => {
        const preferences = {
            ...createDefaultSimulatorPreferences(),
            presentation: {
                view: 'ink' as const,
            },
            simulationMode: 'physical-fidelity' as const,
        }

        const result = loadSimulatorPreferences({
            read: () => JSON.stringify(preferences),
            write: () => undefined,
        })

        expect(result).toEqual({ status: 'loaded', preferences })
    })

    test('migrates the legacy presentation choices explicitly', () => {
        const writes: string[] = []
        const result = loadSimulatorPreferences({
            read: () =>
                JSON.stringify({
                    version: 0,
                    showBraille: false,
                    outputMuted: true,
                    keyboardMuted: false,
                }),
            write: (serialized) => writes.push(serialized),
        })

        expect(result.status).toBe('migrated')
        if (result.status !== 'migrated') throw new Error('migration expected')
        expect(result.migrationPersistence).toBe('saved')
        expect(result.preferences).toEqual({
            ...createDefaultSimulatorPreferences(),
            presentation: {
                view: 'ink',
            },
            feedback: {
                ...createDefaultSimulatorPreferences().feedback,
                sounds: { enabled: true },
            },
        })
        expect(writes).toEqual([JSON.stringify(result.preferences)])
    })

    test('migrates version one into explicit speech and sound preferences', () => {
        const versionOne = {
            ...createDefaultSimulatorPreferences(),
            version: 1,
            presentation: {
                ...createDefaultSimulatorPreferences().presentation,
                outputAudioEnabled: true,
                keyboardAudioEnabled: true,
            },
        }
        const { feedback: _feedback, ...persistedVersionOne } = versionOne
        const result = loadSimulatorPreferences({
            read: () => JSON.stringify(persistedVersionOne),
            write: () => undefined,
        })

        expect(result.status).toBe('migrated')
        expect(result.preferences.feedback).toEqual({
            speech: {
                enabled: false,
                locale: 'pt-BR',
                voicePreference: 'default',
                rate: 0.9,
                pitch: 1,
                volume: 1,
            },
            sounds: { enabled: true },
        })
    })

    test('keeps migrated choices when persisting the new schema fails', () => {
        const result = loadSimulatorPreferences({
            read: () =>
                JSON.stringify({
                    version: 0,
                    showBraille: false,
                    outputMuted: false,
                    keyboardMuted: false,
                }),
            write: () => {
                throw new Error('storage denied')
            },
        })

        expect(result.status).toBe('migrated')
        if (result.status !== 'migrated') throw new Error('migration expected')
        expect(result.migrationPersistence).toBe('failed')
        expect(result.preferences.presentation.view).toBe('ink')
    })

    test('falls back explicitly when persisted data is invalid or unavailable', () => {
        const invalid = loadSimulatorPreferences({
            read: () => '{invalid-json',
            write: () => undefined,
        })
        const unavailable = loadSimulatorPreferences({
            read: () => {
                throw new Error('storage denied')
            },
            write: () => undefined,
        })

        expect(invalid).toEqual({
            status: 'defaulted',
            reason: 'invalid',
            preferences: createDefaultSimulatorPreferences(),
        })
        expect(unavailable).toEqual({
            status: 'defaulted',
            reason: 'unavailable',
            preferences: createDefaultSimulatorPreferences(),
        })
    })

    test('persists a validated snapshot through the storage seam', () => {
        const writes: string[] = []
        const preferences = createDefaultSimulatorPreferences()

        const result = saveSimulatorPreferences(
            {
                read: () => null,
                write: (serialized) => writes.push(serialized),
            },
            preferences,
        )

        expect(result).toEqual({ status: 'saved' })
        expect(writes).toEqual([JSON.stringify(preferences)])
    })

    test('applies experience requirements without changing permanent choices', () => {
        const preferences = {
            ...createDefaultSimulatorPreferences(),
            simulationMode: 'physical-fidelity' as const,
        }

        const result = resolveEffectiveSessionConfiguration(preferences, {
            interruptionPolicy: 'discard',
        })

        expect(result).toEqual({
            configuration: { interruptionPolicy: 'discard' },
            overriddenPreferences: ['interruptionPolicy'],
        })
        expect(preferences.simulationMode).toBe('physical-fidelity')
        expect(resolveEffectiveSessionConfiguration(preferences, {})).toEqual({
            configuration: { interruptionPolicy: 'confirm' },
            overriddenPreferences: [],
        })
    })

    test('updates one permanent choice while preserving the remaining snapshot', () => {
        const initial = createDefaultSimulatorPreferences()

        const updated = applySimulatorPreferenceChange(initial, {
            type: 'set-view',
            view: 'ink',
        })

        expect(updated).toEqual({
            ...initial,
            presentation: { ...initial.presentation, view: 'ink' },
        })
        expect(initial.presentation.view).toBe('braille')
    })

    test('updates persistent audio choices independently', () => {
        const initial = createDefaultSimulatorPreferences()
        const withSpeech = applySimulatorPreferenceChange(initial, {
            type: 'set-speech-enabled',
            enabled: true,
        })
        const silent = applySimulatorPreferenceChange(withSpeech, {
            type: 'set-sounds-enabled',
            enabled: false,
        })

        expect(silent.feedback).toEqual({
            speech: { ...initial.feedback.speech, enabled: true },
            sounds: { enabled: false },
        })
    })
})
