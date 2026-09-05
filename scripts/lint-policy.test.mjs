import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateLint } from './lint-policy.mjs'

const baseline = [
    'src/legacy.ts:react-hooks/exhaustive-deps:React Hook useEffect has a missing dependency: dependency.',
]

function report(filePath, messages) {
    return [{ filePath, messages }]
}

test('aceita somente os avisos herdados registrados', () => {
    const result = evaluateLint(
        report('/workspace/src/legacy.ts', [
            {
                severity: 1,
                ruleId: 'react-hooks/exhaustive-deps',
                message: 'React Hook useEffect has a missing dependency: dependency.',
            },
        ]),
        baseline,
        '/workspace'
    )

    assert.deepEqual(result, { newFailures: [], resolvedFailures: [] })
})

test('separa uma nova falha da baseline herdada', () => {
    const result = evaluateLint(
        report('/workspace/src/legacy.ts', [
            {
                severity: 1,
                ruleId: 'react-hooks/exhaustive-deps',
                message: 'React Hook useEffect has a missing dependency: dependency.',
            },
            {
                severity: 2,
                ruleId: 'no-undef',
                message: 'newFailure is not defined.',
            },
        ]),
        baseline,
        '/workspace'
    )

    assert.deepEqual(result, {
        newFailures: ['src/legacy.ts:no-undef:newFailure is not defined.'],
        resolvedFailures: [],
    })
})

test('informa quando uma falha herdada foi resolvida', () => {
    const result = evaluateLint([], baseline, '/workspace')

    assert.deepEqual(result, {
        newFailures: [],
        resolvedFailures: baseline,
    })
})

test('rejeita uma nova ocorrência idêntica no mesmo arquivo', () => {
    const inheritedMessage = {
        severity: 1,
        ruleId: 'react-hooks/exhaustive-deps',
        message: 'React Hook useEffect has a missing dependency: dependency.',
    }
    const result = evaluateLint(
        report('/workspace/src/legacy.ts', [inheritedMessage, inheritedMessage]),
        baseline,
        '/workspace'
    )

    assert.deepEqual(result, {
        newFailures: baseline,
        resolvedFailures: [],
    })
})
