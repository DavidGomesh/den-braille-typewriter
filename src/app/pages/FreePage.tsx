import React, { useCallback, useMemo, useRef, useState } from 'react'

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
    type LegacyFreeModeAction,
} from '../../ui/public'
import {
    coordinateSessionFeedback,
    createBrowserSpeechOutput,
    createFeedbackCoordinatorState,
    createWebSoundOutput,
    resolveFeedbackMessage,
    type MessageFeedbackPlan,
    type SpeechRequest,
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
    const snapshot = useMemo(() => getTypingSessionSnapshot(session), [session])
    const keyboardBindings = useMemo(
        () => createWebKeyboardBindings(preferences.keyboardBindings),
        [preferences.keyboardBindings],
    )
    const speechOutput = useMemo(createBrowserSpeechOutput, [])
    const soundOutput = useMemo(createWebSoundOutput, [])
    const lastSpeechRequest = useRef<SpeechRequest | undefined>(undefined)

    const speak = useCallback(
        (text: string, purpose: SpeechRequest['purpose']) => {
            const speech = preferencesRef.current.feedback.speech
            if (!speech.enabled || speechOutput === undefined) return
            const { enabled: _enabled, ...speechSettings } = speech
            const request = Object.freeze({ text, purpose, ...speechSettings })
            lastSpeechRequest.current = request
            void speechOutput.speak(request).then((result) => {
                if (result === 'unavailable' || result === 'failed') {
                    setPreferencesNotice(
                        'A leitura falada está indisponível; o texto e as mensagens acessíveis continuam ativos.',
                    )
                }
            })
        },
        [speechOutput],
    )

    const dispatch = useCallback(
        (input: SessionInput) => {
            const result = applySessionInput(sessionRef.current, input)
            sessionRef.current = result.state
            setSession(result.state)

            const feedback = coordinateSessionFeedback(
                feedbackCoordinatorRef.current,
                result.events,
            )
            feedbackCoordinatorRef.current = feedback.state
            if (feedback.plans.length > 0) {
                setFeedbackPlans(feedback.plans)
                feedback.plans.forEach((plan) => {
                    if (plan.interruption !== 'none') speechOutput?.cancel()
                    speak(resolveFeedbackMessage(plan), 'status')
                })
            }
        },
        [speak, speechOutput],
    )

    const handlePresentationAction = useCallback(
        (action: LegacyFreeModeAction) => {
            if (action === 'instructions-requested') {
                const instructions =
                    'Use F, D, S, J, K e L para formar acordes Braille. Use Espaço, Backspace e Q para editar.'
                if (preferences.feedback.speech.enabled) {
                    speak(instructions, 'instruction')
                } else if (preferences.feedback.sounds.enabled) {
                    void soundOutput.play({
                        type: 'editorial',
                        id: 'free-instructions',
                    })
                }
                return
            }
            if (action === 'speech-stopped') {
                speechOutput?.cancel()
                soundOutput.cancel()
                return
            }
            if (action === 'speech-repeated') {
                if (
                    preferences.feedback.speech.enabled &&
                    lastSpeechRequest.current !== undefined
                )
                    void speechOutput?.speak(lastSpeechRequest.current)
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
            } else if (action === 'output-audio-toggled') {
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
        [preferences, preferencesStorage, soundOutput, speak, speechOutput],
    )

    const presentationPreferences = useMemo(
        () => ({
            ...preferences.presentation,
            keyboardAudioEnabled: preferences.feedback.sounds.enabled,
        }),
        [preferences],
    )

    const playMachineSound = useCallback(() => {
        if (preferencesRef.current.feedback.sounds.enabled)
            void soundOutput.play({ type: 'machine-key' })
    }, [soundOutput])

    return (
        <>
            <main>
                {preferencesNotice !== undefined && (
                    <div role="alert">{preferencesNotice}</div>
                )}
                <AccessibleFeedback plans={feedbackPlans} />
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
