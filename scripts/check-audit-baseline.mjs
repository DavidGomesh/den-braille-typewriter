import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

import { evaluateAudit } from './audit-policy.mjs'

const baseline = JSON.parse(
    readFileSync(
        new URL('../config/audit-baseline.json', import.meta.url),
        'utf8',
    ),
)

const audit = spawnSync('npm', ['audit', '--omit=dev', '--json'], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
})

let report
try {
    report = JSON.parse(audit.stdout)
} catch {
    console.error(
        audit.stderr || audit.stdout || 'npm audit did not produce valid JSON.',
    )
    process.exit(1)
}

if (report.error) {
    console.error(`npm audit failed: ${report.error.summary}`)
    process.exit(1)
}

const current = report.metadata?.vulnerabilities
if (!current) {
    console.error('npm audit did not report vulnerability counts.')
    process.exit(1)
}

const limits = baseline.production
console.log(
    `Production vulnerabilities: ${current.critical} critical, ` +
        `${current.high} high, ${current.moderate} moderate and ${current.low} low.`,
)

const { regressions, newOccurrences, resolvedOccurrences } = evaluateAudit(
    report,
    limits,
)

if (resolvedOccurrences.length > 0) {
    console.error(
        'Inherited occurrences resolved; reduce config/audit-baseline.json:',
    )
    for (const occurrence of resolvedOccurrences) {
        console.error(`- ${occurrence}`)
    }
    process.exit(1)
}

if (regressions.length > 0) {
    for (const severity of regressions) {
        console.error(
            `${severity} regression: baseline ${limits[severity]}, current ${current[severity]}.`,
        )
    }
    process.exit(1)
}

if (newOccurrences.length > 0) {
    console.error('New critical or high occurrences by advisory and package:')
    for (const occurrence of newOccurrences) {
        console.error(`- ${occurrence}`)
    }
    process.exit(1)
}
