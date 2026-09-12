import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import '../../styles/views/modes/Free.css'

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
import {
    AccessibleFeedback,
    FreeTypingSession,
    legacyFreeModeActionForKey,
    type LegacyFreeModeAction,
} from '../../ui/public'
import {
    coordinateSessionFeedback,
    createBrowserSpeechOutput,
    createFeedbackCoordinatorState,
    createMultimodalFeedbackController,
    createWebSoundOutput,
    resolveAutomaticReading,
    type MessageFeedbackPlan,
} from '../../feedback/public'
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

export default function FreePage() {
    const preferencesStorage = useMemo(createLocalStoragePreferencesStorage, [])
    const [initialPreferences] = useState(() =>
        loadSimulatorPreferences(preferencesStorage),
    )
    const [preferences, setPreferences] = useState(
        initialPreferences.preferences,
    )
    const preferencesRef = useRef(preferences)
    preferencesRef.current = preferences
    const [preferencesNotice, setPreferencesNotice] = useState(() => {
        if (
            initialPreferences.status === 'migrated' &&
            initialPreferences.migrationPersistence === 'failed'
        ) {
            return 'As preferências antigas foram aplicadas nesta sessão, mas não puderam ser atualizadas no armazenamento.'
        }
        return 'reason' in initialPreferences &&
            (initialPreferences.reason === 'invalid' ||
                initialPreferences.reason === 'unavailable')
            ? 'As preferências salvas não puderam ser carregadas; os padrões foram aplicados.'
            : undefined
    })
    const [session, setSession] = useState(() =>
        createFreeSession(initialPreferences.preferences),
    )
    const sessionRef = useRef(session)
    const feedbackCoordinatorRef = useRef(createFeedbackCoordinatorState())
    const [feedbackPlans, setFeedbackPlans] = useState<
        readonly MessageFeedbackPlan[]
    >([])
    const [instructionFallback, setInstructionFallback] = useState<
        string | undefined
    >()
    const snapshot = useMemo(() => getTypingSessionSnapshot(session), [session])
    const keyboardBindings = useMemo(
        () => createWebKeyboardBindings(preferences.keyboardBindings),
        [preferences.keyboardBindings],
    )
    const speechOutput = useMemo(createBrowserSpeechOutput, [])
    const soundOutput = useMemo(createWebSoundOutput, [])
    const multimodalFeedback = useMemo(
        () =>
            createMultimodalFeedbackController({
                speechOutput,
                soundOutput,
                getPreferences: () => preferencesRef.current.feedback,
                onSpeechUnavailable: () =>
                    setPreferencesNotice(
                        'A leitura falada está indisponível; o texto e as mensagens acessíveis continuam ativos.',
                    ),
                presentInstructionFallback: setInstructionFallback,
                presentAccessibleFallback: setFeedbackPlans,
            }),
        [soundOutput, speechOutput],
    )

    const dispatch = useCallback(
        (input: SessionInput) => {
            const previousSnapshot = getTypingSessionSnapshot(
                sessionRef.current,
            )
            const result = applySessionInput(sessionRef.current, input)
            sessionRef.current = result.state
            setSession(result.state)

            const feedback = coordinateSessionFeedback(
                feedbackCoordinatorRef.current,
                result.events,
            )
            feedbackCoordinatorRef.current = feedback.state
            const automaticReading = resolveAutomaticReading(
                previousSnapshot.interpretation,
                result.snapshot.interpretation,
                result.events,
            )
            if (automaticReading !== undefined)
                multimodalFeedback.readProduction(automaticReading)
            if (feedback.plans.length > 0) {
                setFeedbackPlans(
                    multimodalFeedback.deliverPlans(feedback.plans),
                )
            }
        },
        [multimodalFeedback],
    )

    const handlePresentationAction = useCallback(
        (action: LegacyFreeModeAction) => {
            if (action === 'instructions-requested') {
                multimodalFeedback.requestInstructions()
                return
            }
            if (action === 'speech-stopped') {
                multimodalFeedback.stop()
                return
            }
            if (action === 'speech-repeated') {
                multimodalFeedback.repeatSpeech()
                return
            }

            let change: SimulatorPreferenceChange
            if (action === 'view-toggled') {
                const showingBraille =
                    preferences.presentation.view === 'braille'
                change = {
                    type: 'set-view',
                    view: showingBraille ? 'ink' : 'braille',
                }
            } else if (action === 'speech-toggled') {
                change = {
                    type: 'set-speech-enabled',
                    enabled: !preferences.feedback.speech.enabled,
                }
            } else {
                change = {
                    type: 'set-sounds-enabled',
                    enabled: !preferences.feedback.sounds.enabled,
                }
            }

            const updated = applySimulatorPreferenceChange(preferences, change)
            multimodalFeedback.applyPreferences(updated.feedback)
            setPreferences(updated)
            const saveResult = saveSimulatorPreferences(
                preferencesStorage,
                updated,
            )
            setPreferencesNotice(
                saveResult.status === 'failed'
                    ? 'A preferência foi aplicada nesta sessão, mas não pôde ser salva.'
                    : change.type === 'set-speech-enabled' &&
                        change.enabled &&
                        speechOutput === undefined
                      ? 'A leitura falada está indisponível; o texto e as mensagens acessíveis continuam ativos.'
                      : undefined,
            )
        },
        [multimodalFeedback, preferences, preferencesStorage, speechOutput],
    )

    const presentationPreferences = useMemo(
        () => ({
            ...preferences.presentation,
            keyboardAudioEnabled: preferences.feedback.sounds.enabled,
            speechEnabled: preferences.feedback.speech.enabled,
            soundsEnabled: preferences.feedback.sounds.enabled,
        }),
        [preferences],
    )

    const playMachineSound = useCallback(() => {
        multimodalFeedback.playMachineKey()
    }, [multimodalFeedback])

    useEffect(() => {
        const handleGlobalPresentationKey = (event: KeyboardEvent) => {
            if (
                event.target instanceof Element &&
                event.target.closest('#typewriter') !== null
            )
                return
            const action = legacyFreeModeActionForKey(event)
            if (action === undefined) return
            event.preventDefault()
            handlePresentationAction(action)
        }
        document.addEventListener('keydown', handleGlobalPresentationKey)
        return () => {
            document.removeEventListener('keydown', handleGlobalPresentationKey)
            multimodalFeedback.stop()
        }
    }, [handlePresentationAction, multimodalFeedback])

    return (
        <>
            <main>
                {preferencesNotice !== undefined && (
                    <div role="alert">{preferencesNotice}</div>
                )}
                <AccessibleFeedback plans={feedbackPlans} />
                {instructionFallback !== undefined && (
                    <p aria-live="polite">{instructionFallback}</p>
                )}
                <FreeTypingSession
                    snapshot={snapshot}
                    dispatch={dispatch}
                    keyboardBindings={keyboardBindings}
                    presentationPreferences={presentationPreferences}
                    onPresentationAction={handlePresentationAction}
                    onMachineKeyPressed={playMachineSound}
                />
            </main>
        </>
    )
}
