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

test('accepts inherited advisories and ignores via references by name', () => {
    const result = evaluateAudit(
        report([
            'transitive-dependency',
            {
                severity: 'high',
                url: 'https://github.com/advisories/GHSA-known-high',
            },
            {
                severity: 'critical',
                url: 'https://github.com/advisories/GHSA-known-critical',
            },
        ]),
        baseline,
    )

    assert.deepEqual(result, {
        regressions: [],
        newOccurrences: [],
        resolvedOccurrences: [],
    })
})

test('rejects critical or high advisories outside the baseline', () => {
    const result = evaluateAudit(
        report([
            {
                severity: 'high',
                url: 'https://github.com/advisories/GHSA-new-risk',
            },
        ]),
        baseline,
    )

    assert.deepEqual(result.newOccurrences, ['GHSA-new-risk:dependency'])
})

test('rejects inherited advisories when they affect another package', () => {
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

    assert.deepEqual(result.newOccurrences, ['GHSA-known-high:newDependency'])
})

test('rejects count increases even when advisory IDs are known', () => {
    const result = evaluateAudit(report([], { critical: 1, high: 2 }), baseline)

    assert.deepEqual(result.regressions, ['high'])
})

test('reports when an inherited occurrence has been resolved', () => {
    const result = evaluateAudit(report([]), baseline)

    assert.deepEqual(result.resolvedOccurrences, [
        'GHSA-known-critical:dependency',
        'GHSA-known-high:dependency',
    ])
})
