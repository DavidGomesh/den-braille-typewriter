import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

import { evaluateAudit } from './audit-policy.mjs'

const baseline = JSON.parse(
    readFileSync(new URL('../config/audit-baseline.json', import.meta.url), 'utf8')
)

const audit = spawnSync('npm', ['audit', '--omit=dev', '--json'], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
})

let report
try {
    report = JSON.parse(audit.stdout)
} catch {
    console.error(audit.stderr || audit.stdout || 'npm audit não produziu JSON válido.')
    process.exit(1)
}

if (report.error) {
    console.error(`npm audit falhou: ${report.error.summary}`)
    process.exit(1)
}

const current = report.metadata?.vulnerabilities
if (!current) {
    console.error('npm audit não informou a contagem de vulnerabilidades.')
    process.exit(1)
}

const limits = baseline.production
console.log(
    `Vulnerabilidades de produção: ${current.critical} críticas, ` +
    `${current.high} altas, ${current.moderate} moderadas e ${current.low} baixas.`
)

const { regressions, newOccurrences, resolvedOccurrences } = evaluateAudit(
    report,
    limits
)

if (resolvedOccurrences.length > 0) {
    console.error('Ocorrências herdadas resolvidas; reduza config/audit-baseline.json:')
    for (const occurrence of resolvedOccurrences) {
        console.error(`- ${occurrence}`)
    }
    process.exit(1)
}

if (regressions.length > 0) {
    for (const severity of regressions) {
        console.error(
            `Regressão ${severity}: baseline ${limits[severity]}, atual ${current[severity]}.`
        )
    }
    process.exit(1)
}

if (newOccurrences.length > 0) {
    console.error('Novas ocorrências críticas ou altas por advisory e pacote:')
    for (const occurrence of newOccurrences) {
        console.error(`- ${occurrence}`)
    }
    process.exit(1)
}
