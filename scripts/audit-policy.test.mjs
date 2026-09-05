import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateAudit } from './audit-policy.mjs'

const baseline = {
    critical: 1,
    high: 1,
    allowedCriticalAndHighOccurrences: [
        'GHSA-known-critical:dependency',
        'GHSA-known-high:dependency',
    ],
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

    assert.deepEqual(result, {
        regressions: [],
        newOccurrences: [],
        resolvedOccurrences: [],
    })
})

test('rejeita advisory crítico ou alto que não pertence à baseline', () => {
    const result = evaluateAudit(report([
        { severity: 'high', url: 'https://github.com/advisories/GHSA-new-risk' },
    ]), baseline)

    assert.deepEqual(result.newOccurrences, ['GHSA-new-risk:dependency'])
})

test('rejeita advisory herdado quando passa a afetar outro pacote', () => {
    const auditReport = report([])
    auditReport.vulnerabilities.newDependency = {
        via: [
            {
                severity: 'high',
                url: 'https://github.com/advisories/GHSA-known-high',
            },
        ],
    }

    const result = evaluateAudit(auditReport, baseline)

    assert.deepEqual(result.newOccurrences, [
        'GHSA-known-high:newDependency',
    ])
})

test('rejeita aumento da contagem mesmo quando os IDs são conhecidos', () => {
    const result = evaluateAudit(
        report([], { critical: 1, high: 2 }),
        baseline
    )

    assert.deepEqual(result.regressions, ['high'])
})

test('informa quando uma ocorrência herdada foi resolvida', () => {
    const result = evaluateAudit(report([]), baseline)

    assert.deepEqual(result.resolvedOccurrences, [
        'GHSA-known-critical:dependency',
        'GHSA-known-high:dependency',
    ])
})
