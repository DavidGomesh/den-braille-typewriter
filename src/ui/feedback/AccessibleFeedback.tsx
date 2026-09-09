import React from 'react'

import {
    resolveFeedbackMessage,
    type MessageFeedbackPlan,
} from '../../feedback/public'

export type AccessibleFeedbackProps = Readonly<{
    plans: readonly MessageFeedbackPlan[]
}>

/** Presents canonical feedback messages visually and programmatically. */
export default function AccessibleFeedback({ plans }: AccessibleFeedbackProps) {
    if (plans.length === 0) return <div />

    const visiblePlans = plans.filter((plan) => plan.channels.visual)
    const accessiblePlans = plans.filter(
        (plan) => plan.channels.accessible !== 'off',
    )
    const accessibleContent = accessiblePlans
        .map(resolveFeedbackMessage)
        .join(' ')
    const assertive = accessiblePlans.some(
        (plan) => plan.channels.accessible === 'assertive',
    )

    return (
        <div>
            {visiblePlans.map((plan) => (
                <p key={JSON.stringify(plan.message)} aria-hidden="true">
                    {resolveFeedbackMessage(plan)}
                </p>
            ))}
            {accessiblePlans.length > 0 && (
                <div
                    className="visually-hidden"
                    role={assertive ? 'alert' : 'status'}
                    aria-label="Feedback da sessão"
                    aria-live={assertive ? 'assertive' : 'polite'}
                    aria-atomic="true"
                >
                    {accessibleContent}
                </div>
            )}
        </div>
    )
}
