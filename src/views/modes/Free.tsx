import React, { useCallback, useEffect, useMemo, useState } from 'react'

import '../../styles/views/modes/Free.css'

import { useAudioContext } from '../../providers/AudioProvider'
import {
    createOrthographyProfile,
    createPaperConfiguration,
} from '../../braille/public'
import {
    applySessionInput,
    createWebKeyboardBindings,
    createTypingSession,
    getTypingSessionSnapshot,
    type SessionInput,
} from '../../session/public'
import { FreeTypingSession, type LegacyFreeModeAction } from '../../ui/public'
import {
    applySimulatorPreferenceChange,
    createLocalStoragePreferencesStorage,
    loadSimulatorPreferences,
    resolveEffectiveSessionConfiguration,
    saveSimulatorPreferences,
    type SimulatorPreferenceChange,
    type SimulatorPreferences,
} from '../../preferences/public'

const freeModeRequirements = Object.freeze({})

const createFreeSession = (preferences: SimulatorPreferences) =>
    createTypingSession({
        paper: createPaperConfiguration({
            type: 'continuous',
            columns: 40,
        }),
        profile: createOrthographyProfile('portuguese-braille-2018'),
        effectiveConfiguration: resolveEffectiveSessionConfiguration(
            preferences,
            freeModeRequirements,
        ).configuration,
    })

export default function Free() {
    const preferencesStorage = useMemo(createLocalStoragePreferencesStorage, [])
    const [initialPreferences] = useState(() =>
        loadSimulatorPreferences(preferencesStorage),
    )
    const [preferences, setPreferences] = useState(
        initialPreferences.preferences,
    )
    const [preferencesNotice, setPreferencesNotice] = useState(() =>
        initialPreferences.reason === 'invalid' ||
        initialPreferences.reason === 'unavailable'
            ? 'As preferências salvas não puderam ser carregadas; os padrões foram aplicados.'
            : undefined,
    )
    const [session, setSession] = useState(() =>
        createFreeSession(initialPreferences.preferences),
    )
    const snapshot = useMemo(() => getTypingSessionSnapshot(session), [session])
    const keyboardBindings = useMemo(
        () => createWebKeyboardBindings(preferences.keyboardBindings),
        [preferences.keyboardBindings],
    )
    const {
        playHowToAccessInstructionsAudio,
        playFreeModeInstructionsAudio,
        playKeyPress,
        playKeyboardMuted,
        playKeyboardUnmuted,
        playOutputMuted,
        playOutputUnmuted,
        playBrailleViewAudio,
        playInkViewAudio,
    } = useAudioContext()

    useEffect(() => {
        playHowToAccessInstructionsAudio(() => {})
    }, [])

    const dispatch = useCallback((input: SessionInput) => {
        setSession((current) => applySessionInput(current, input).state)
    }, [])

    const handlePresentationAction = useCallback(
        (action: LegacyFreeModeAction) => {
            if (action === 'instructions-requested') {
                playFreeModeInstructionsAudio()
                return
            }

            let change: SimulatorPreferenceChange
            if (action === 'view-toggled') {
                const showingBraille =
                    preferences.presentation.view === 'braille'
                showingBraille ? playInkViewAudio() : playBrailleViewAudio()
                change = {
                    type: 'set-view',
                    view: showingBraille ? 'ink' : 'braille',
                }
            } else if (action === 'output-audio-toggled') {
                const enabled = preferences.presentation.outputAudioEnabled
                enabled ? playOutputMuted() : playOutputUnmuted()
                change = { type: 'set-output-audio', enabled: !enabled }
            } else {
                const enabled = preferences.presentation.keyboardAudioEnabled
                enabled ? playKeyboardMuted() : playKeyboardUnmuted()
                change = { type: 'set-keyboard-audio', enabled: !enabled }
            }

            const updated = applySimulatorPreferenceChange(preferences, change)
            setPreferences(updated)
            const saveResult = saveSimulatorPreferences(
                preferencesStorage,
                updated,
            )
            setPreferencesNotice(
                saveResult.status === 'failed'
                    ? 'A preferência foi aplicada nesta sessão, mas não pôde ser salva.'
                    : undefined,
            )
        },
        [
            playBrailleViewAudio,
            playFreeModeInstructionsAudio,
            playInkViewAudio,
            playKeyboardMuted,
            playKeyboardUnmuted,
            playOutputMuted,
            playOutputUnmuted,
            preferences,
            preferencesStorage,
        ],
    )

    return (
        <>
            <main>
                {preferencesNotice !== undefined && (
                    <div role="alert">{preferencesNotice}</div>
                )}
                <FreeTypingSession
                    snapshot={snapshot}
                    dispatch={dispatch}
                    keyboardBindings={keyboardBindings}
                    presentationPreferences={preferences.presentation}
                    onPresentationAction={handlePresentationAction}
                    onMachineKeyPressed={playKeyPress}
                />
            </main>
        </>
    )
}
