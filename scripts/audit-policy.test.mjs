import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateAudit } from './audit-policy.mjs'

const baseline = {
    critical: 1,
    high: 1,
    allowedCriticalAndHighAdvisories: ['GHSA-known-high', 'GHSA-known-critical'],
}

function report(via, vulnerabilities = { critical: 1, high: 1 }) {
    return {
        vulnerabilities: { dependency: { via } },
        metadata: { vulnerabilities },
    }
}

test('aceita advisories herdados e ignora referências via por nome', () => {
    const result = evaluateAudit(report([
        'transitive-dependency',
        { severity: 'high', url: 'https://github.com/advisories/GHSA-known-high' },
        { severity: 'critical', url: 'https://github.com/advisories/GHSA-known-critical' },
    ]), baseline)

    assert.deepEqual(result, { regressions: [], newAdvisories: [] })
})

test('rejeita advisory crítico ou alto que não pertence à baseline', () => {
    const result = evaluateAudit(report([
        { severity: 'high', url: 'https://github.com/advisories/GHSA-new-risk' },
    ]), baseline)

    assert.deepEqual(result.newAdvisories, ['GHSA-new-risk'])
})

test('rejeita aumento da contagem mesmo quando os IDs são conhecidos', () => {
    const result = evaluateAudit(
        report([], { critical: 1, high: 2 }),
        baseline
    )

    assert.deepEqual(result.regressions, ['high'])
})
