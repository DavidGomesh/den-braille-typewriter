import type { FeedbackMessage } from '../feedback'

/** Resolves a semantic feedback message into Brazilian Portuguese. */
export const resolvePortugueseFeedbackMessage = (
    message: FeedbackMessage,
): string => {
    switch (message.id) {
        case 'capture-activated':
            return 'Captura de acordes ativada.'
        case 'capture-interrupted': {
            const cause = message.parameters.cause
            const policy = message.parameters.policy
            const reason =
                cause === 'focus-loss'
                    ? 'porque a área de digitação perdeu o foco'
                    : cause === 'page-hidden'
                      ? 'porque a página deixou de estar visível'
                      : 'por solicitação da pessoa usuária'
            const outcome =
                policy === 'confirm'
                    ? 'o acorde incompleto foi confirmado'
                    : 'o acorde incompleto foi descartado'
            return `Captura interrompida ${reason}; ${outcome}.`
        }
        case 'input-rejected': {
            switch (message.parameters.reason) {
                case 'capture-inactive':
                    return 'Entrada ignorada porque a captura está inativa.'
                case 'source-not-responsible':
                    return 'Entrada ignorada porque pertence a outra fonte de captura.'
                case 'control-already-pressed':
                    return 'Controle ignorado porque já está pressionado.'
                default:
                    return 'Controle ignorado porque não estava pressionado.'
            }
        }
        case 'chord-discarded':
            return message.parameters.cause === 'cancellation'
                ? 'Acorde incompleto cancelado.'
                : 'Acorde incompleto descartado durante a interrupção.'
        case 'review-position-moved':
            return `Revisão movida para linha ${message.parameters.row}, coluna ${message.parameters.column}.`
    }
}
