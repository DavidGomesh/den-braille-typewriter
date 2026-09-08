import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateLint } from './lint-policy.mjs'

const baseline = [
    'src/legacy.ts:react-hooks/exhaustive-deps:React Hook useEffect has a missing dependency: dependency.',
]

function report(filePath, messages) {
    return [{ filePath, messages }]
}

test('accepts only registered inherited warnings', () => {
    const result = evaluateLint(
        report('/workspace/src/legacy.ts', [
            {
                severity: 1,
                ruleId: 'react-hooks/exhaustive-deps',
                message:
                    'React Hook useEffect has a missing dependency: dependency.',
            },
        ]),
        baseline,
        '/workspace',
    )

    assert.deepEqual(result, { newFailures: [], resolvedFailures: [] })
})

test('separates a new failure from the inherited baseline', () => {
    const result = evaluateLint(
        report('/workspace/src/legacy.ts', [
            {
                severity: 1,
                ruleId: 'react-hooks/exhaustive-deps',
                message:
                    'React Hook useEffect has a missing dependency: dependency.',
            },
            {
                severity: 2,
                ruleId: 'no-undef',
                message: 'newFailure is not defined.',
            },
        ]),
        baseline,
        '/workspace',
    )

    assert.deepEqual(result, {
        newFailures: ['src/legacy.ts:no-undef:newFailure is not defined.'],
        resolvedFailures: [],
    })
})

test('reports when an inherited failure has been resolved', () => {
    const result = evaluateLint([], baseline, '/workspace')

    assert.deepEqual(result, {
        newFailures: [],
        resolvedFailures: baseline,
    })
})

test('rejects a new identical occurrence in the same file', () => {
    const inheritedMessage = {
        severity: 1,
        ruleId: 'react-hooks/exhaustive-deps',
        message: 'React Hook useEffect has a missing dependency: dependency.',
    }
    const result = evaluateLint(
        report('/workspace/src/legacy.ts', [
            inheritedMessage,
            inheritedMessage,
        ]),
        baseline,
        '/workspace',
    )

    assert.deepEqual(result, {
        newFailures: baseline,
        resolvedFailures: [],
    })
})
