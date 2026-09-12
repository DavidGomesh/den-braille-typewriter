export {
    applySimulatorPreferenceChange,
    createDefaultSimulatorPreferences,
    loadSimulatorPreferences,
    resolveEffectiveSessionConfiguration,
    saveSimulatorPreferences,
    simulatorPreferencesVersion,
    type KeyboardBindingPreferences,
    type FeedbackPreferences,
    type EffectiveSessionConfigurationResult,
    type ExperienceRequirements,
    type PreferencesLoadResult,
    type PreferencesSaveResult,
    type PreferencesStorage,
    type SimulatorPreferences,
    type SimulatorPreferenceChange,
} from './preferences'
export { createMemoryPreferencesStorage } from './adapters/memory/memory'
export {
    createLocalStoragePreferencesStorage,
    simulatorPreferencesStorageKey,
    type WebStorage,
} from './adapters/web/local-storage/localStorage'
