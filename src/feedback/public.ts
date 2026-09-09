import { resolvePortugueseFeedbackMessage } from './catalog/portuguese'
import type { MessageFeedbackPlan } from './feedback'

export { createMemoryFeedbackOutput } from './adapters/memory/memory'
export {
    createBrowserSpeechOutput,
    createWebSpeechOutput,
    type WebSpeechSynthesis,
    type WebSpeechUtterance,
    type WebSpeechUtteranceFactory,
    type WebSpeechVoice,
} from './adapters/web/speech/webSpeech'
export {
    createWebSoundOutput,
    type WebAudio,
    type WebAudioFactory,
} from './adapters/web/sound/webSound'
export {
    coordinateSessionFeedback,
    createFeedbackCoordinatorState,
    planSessionFeedback,
    type FeedbackCoordinationResult,
    type FeedbackCoordinatorState,
    type FeedbackMessage,
    type FeedbackMessageId,
    type FeedbackPlan,
    type MessageFeedbackPlan,
    type SilentFeedbackPlan,
} from './feedback'
export {
    createMultimodalFeedbackController,
    type MultimodalFeedbackController,
    type MultimodalFeedbackPreferences,
} from './multimodal'
export {
    executeFeedbackPlan,
    type FeedbackDelivery,
    type FeedbackExecutionResult,
    type FeedbackOutput,
} from './output'
export {
    type SpeechOutput,
    type SpeechRequest,
    type SpeechResult,
} from './speech'
export { type SoundCue, type SoundOutput, type SoundResult } from './sound'

/** Resolves a presentable plan into the current product locale. */
export const resolveFeedbackMessage = (plan: MessageFeedbackPlan): string =>
    resolvePortugueseFeedbackMessage(plan.message)
