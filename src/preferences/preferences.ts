/** Version of the persisted simulator-preferences schema. */
export const simulatorPreferencesVersion = 1 as const

/**
 * Physical keyboard codes selected for each configurable simulator action.
 *
 * Every code is non-empty and unique within the snapshot so one physical key
 * cannot ambiguously select multiple actions. Persisted snapshots that violate
 * either invariant are rejected and replaced by explicit defaults on load.
 */
export type KeyboardBindingPreferences = Readonly<{
    dot1: string
    dot2: string
    dot3: string
    dot4: string
    dot5: string
    dot6: string
    space: string
    backspace: string
    lineChange: string
    reviewUp: string
    reviewRight: string
    reviewDown: string
    reviewLeft: string
    toggleCapture: string
}>

/** Valid choices that persist between typing sessions. */
export type SimulatorPreferences = Readonly<{
    version: typeof simulatorPreferencesVersion
    presentation: Readonly<{
        view: 'braille' | 'ink'
        outputAudioEnabled: boolean
        keyboardAudioEnabled: boolean
    }>
    keyboardBindings: KeyboardBindingPreferences
    simulationMode: 'assisted' | 'physical-fidelity'
}>

/** Minimal persistence seam implemented by web and deterministic adapters. */
export type PreferencesStorage = Readonly<{
    read: () => string | null
    write: (serialized: string) => void
}>

/** Observable outcome of loading persisted preferences. */
export type PreferencesLoadResult =
    | Readonly<{
          preferences: SimulatorPreferences
          status: 'loaded'
      }>
    | Readonly<{
          preferences: SimulatorPreferences
          status: 'migrated'
          migrationPersistence: 'saved' | 'failed'
      }>
    | Readonly<{
          preferences: SimulatorPreferences
          status: 'defaulted'
          reason: 'missing' | 'invalid' | 'unavailable'
      }>

/** Observable outcome of attempting to persist preferences. */
export type PreferencesSaveResult = Readonly<{
    status: 'saved' | 'failed'
}>

/** Temporary policies imposed by the active simulator experience. */
export type ExperienceRequirements = Readonly<{
    interruptionPolicy?: 'discard' | 'confirm'
}>

/** Effective policies and the permanent choices they temporarily replace. */
export type EffectiveSessionConfigurationResult = Readonly<{
    configuration: Readonly<{
        interruptionPolicy: 'discard' | 'confirm'
    }>
    overriddenPreferences: readonly ['interruptionPolicy'] | readonly []
}>

/** A validated change to one permanent simulator preference. */
export type SimulatorPreferenceChange =
    | Readonly<{
          type: 'set-view'
          view: 'braille' | 'ink'
      }>
    | Readonly<{
          type: 'set-output-audio' | 'set-keyboard-audio'
          enabled: boolean
      }>

const defaultKeyboardBindings = (): KeyboardBindingPreferences =>
    Object.freeze({
        dot1: 'KeyF',
        dot2: 'KeyD',
        dot3: 'KeyS',
        dot4: 'KeyJ',
        dot5: 'KeyK',
        dot6: 'KeyL',
        space: 'Space',
        backspace: 'Backspace',
        lineChange: 'KeyQ',
        reviewUp: 'ArrowUp',
        reviewRight: 'ArrowRight',
        reviewDown: 'ArrowDown',
        reviewLeft: 'ArrowLeft',
        toggleCapture: 'Escape',
    })

const keyboardBindingNames = [
    'dot1',
    'dot2',
    'dot3',
    'dot4',
    'dot5',
    'dot6',
    'space',
    'backspace',
    'lineChange',
    'reviewUp',
    'reviewRight',
    'reviewDown',
    'reviewLeft',
    'toggleCapture',
] as const

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const decodeCurrentPreferences = (
    value: unknown,
): SimulatorPreferences | undefined => {
    if (!isRecord(value) || value.version !== simulatorPreferencesVersion)
        return undefined
    if (!isRecord(value.presentation) || !isRecord(value.keyboardBindings))
        return undefined

    const keyboardBindings = value.keyboardBindings
    const { view, outputAudioEnabled, keyboardAudioEnabled } =
        value.presentation
    if (
        (view !== 'braille' && view !== 'ink') ||
        typeof outputAudioEnabled !== 'boolean' ||
        typeof keyboardAudioEnabled !== 'boolean' ||
        (value.simulationMode !== 'assisted' &&
            value.simulationMode !== 'physical-fidelity')
    ) {
        return undefined
    }

    const bindings = Object.fromEntries(
        keyboardBindingNames.map((name) => [name, keyboardBindings[name]]),
    )
    const codes = Object.values(bindings)
    if (
        codes.some((code) => typeof code !== 'string' || code.length === 0) ||
        new Set(codes).size !== codes.length
    ) {
        return undefined
    }

    return Object.freeze({
        version: simulatorPreferencesVersion,
        presentation: Object.freeze({
            view,
            outputAudioEnabled,
            keyboardAudioEnabled,
        }),
        keyboardBindings: Object.freeze(
            bindings as unknown as KeyboardBindingPreferences,
        ),
        simulationMode: value.simulationMode,
    })
}

const migrateLegacyPreferences = (
    value: unknown,
): SimulatorPreferences | undefined => {
    if (
        !isRecord(value) ||
        value.version !== 0 ||
        typeof value.showBraille !== 'boolean' ||
        typeof value.outputMuted !== 'boolean' ||
        typeof value.keyboardMuted !== 'boolean'
    ) {
        return undefined
    }
    const defaults = createDefaultSimulatorPreferences()
    return Object.freeze({
        ...defaults,
        presentation: Object.freeze({
            view: value.showBraille ? 'braille' : 'ink',
            outputAudioEnabled: !value.outputMuted,
            keyboardAudioEnabled: !value.keyboardMuted,
        }),
    })
}

/** Creates the valid defaults used when persistence cannot supply preferences. */
export const createDefaultSimulatorPreferences = (): SimulatorPreferences =>
    Object.freeze({
        version: simulatorPreferencesVersion,
        presentation: Object.freeze({
            view: 'braille',
            outputAudioEnabled: true,
            keyboardAudioEnabled: true,
        }),
        keyboardBindings: defaultKeyboardBindings(),
        simulationMode: 'assisted',
    })

/**
 * Loads preferences without allowing storage failures to escape the seam.
 *
 * Missing, invalid, or unavailable data produces valid defaults with an
 * explicit reason. A migrated payload is written back immediately; failure to
 * write it remains observable without discarding the migrated choices.
 */
export const loadSimulatorPreferences = (
    storage: PreferencesStorage,
): PreferencesLoadResult => {
    let serialized: string | null
    try {
        serialized = storage.read()
    } catch {
        return Object.freeze({
            preferences: createDefaultSimulatorPreferences(),
            status: 'defaulted',
            reason: 'unavailable',
        })
    }
    if (serialized === null) {
        return Object.freeze({
            preferences: createDefaultSimulatorPreferences(),
            status: 'defaulted',
            reason: 'missing',
        })
    }
    try {
        const value: unknown = JSON.parse(serialized)
        const preferences = decodeCurrentPreferences(value)
        if (preferences !== undefined) {
            return Object.freeze({ preferences, status: 'loaded' })
        }
        const migrated = migrateLegacyPreferences(value)
        if (migrated !== undefined) {
            let migrationPersistence: 'saved' | 'failed' = 'saved'
            try {
                storage.write(JSON.stringify(migrated))
            } catch {
                migrationPersistence = 'failed'
            }
            return Object.freeze({
                preferences: migrated,
                status: 'migrated',
                migrationPersistence,
            })
        }
    } catch {
        // Invalid persisted data falls through to the explicit safe default.
    }
    return Object.freeze({
        preferences: createDefaultSimulatorPreferences(),
        status: 'defaulted',
        reason: 'invalid',
    })
}

/** Persists one valid snapshot without allowing adapter failures to escape. */
export const saveSimulatorPreferences = (
    storage: PreferencesStorage,
    preferences: SimulatorPreferences,
): PreferencesSaveResult => {
    try {
        storage.write(JSON.stringify(preferences))
        return Object.freeze({ status: 'saved' })
    } catch {
        return Object.freeze({ status: 'failed' })
    }
}

/** Combines permanent preferences with temporary experience requirements. */
export const resolveEffectiveSessionConfiguration = (
    preferences: SimulatorPreferences,
    requirements: ExperienceRequirements,
): EffectiveSessionConfigurationResult => {
    const preferredPolicy =
        preferences.simulationMode === 'physical-fidelity'
            ? 'confirm'
            : 'discard'
    const overridden = requirements.interruptionPolicy !== undefined
    return Object.freeze({
        configuration: Object.freeze({
            interruptionPolicy:
                requirements.interruptionPolicy ?? preferredPolicy,
        }),
        overriddenPreferences: Object.freeze(
            overridden ? ['interruptionPolicy'] : [],
        ) as readonly ['interruptionPolicy'] | readonly [],
    })
}

/** Applies one validated preference change without mutating the prior snapshot. */
export const applySimulatorPreferenceChange = (
    preferences: SimulatorPreferences,
    change: SimulatorPreferenceChange,
): SimulatorPreferences => {
    const presentation = {
        ...preferences.presentation,
        ...(change.type === 'set-view' ? { view: change.view } : {}),
        ...(change.type === 'set-output-audio'
            ? { outputAudioEnabled: change.enabled }
            : {}),
        ...(change.type === 'set-keyboard-audio'
            ? { keyboardAudioEnabled: change.enabled }
            : {}),
    }
    return Object.freeze({
        ...preferences,
        presentation: Object.freeze(presentation),
    })
}
