import React from 'react'

import {
    resolveFeedbackMessage,
    type MessageFeedbackPlan,
} from '../../feedback/public'

export type AccessibleFeedbackProps = Readonly<{
    plan?: MessageFeedbackPlan
}>

/** Presents one canonical feedback message visually and programmatically. */
export default function AccessibleFeedback({ plan }: AccessibleFeedbackProps) {
    if (plan === undefined) return <div />

    const content = resolveFeedbackMessage(plan)
    const assertive = plan.channels.accessible === 'assertive'

    return (
        <div>
            {plan.channels.visual && <p aria-hidden="true">{content}</p>}
            {plan.channels.accessible !== 'off' && (
                <div
                    className="visually-hidden"
                    role={assertive ? 'alert' : 'status'}
                    aria-label="Feedback da sessão"
                    aria-live={plan.channels.accessible}
                    aria-atomic="true"
                >
                    {content}
                </div>
            )}
        </div>
    )
}
