import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

import { evaluateLint } from './lint-policy.mjs'

const rootDirectory = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const baseline = JSON.parse(
    readFileSync(new URL('../config/lint-baseline.json', import.meta.url), 'utf8')
)
const eslint = spawnSync(
    process.execPath,
    [
        new URL('../node_modules/eslint/bin/eslint.js', import.meta.url).pathname,
        '--ext',
        '.js,.jsx,.ts,.tsx,.mjs',
        'src/index.js',
        'src/components',
        'src/domain',
        'src/providers',
        'src/tests',
        'src/views',
        'scripts',
        '--format',
        'json',
    ],
    { cwd: rootDirectory, encoding: 'utf8' }
)

if (eslint.error) {
    console.error(`Não foi possível executar o ESLint: ${eslint.error.message}`)
    process.exit(1)
}

let report
try {
    report = JSON.parse(eslint.stdout)
} catch {
    console.error(eslint.stderr || eslint.stdout || 'ESLint não produziu JSON válido.')
    process.exit(1)
}

const { newFailures, resolvedFailures } = evaluateLint(
    report,
    baseline.failures,
    rootDirectory
)

if (resolvedFailures.length > 0) {
    console.error('Falhas herdadas resolvidas; reduza config/lint-baseline.json:')
    for (const failure of resolvedFailures) console.error(`- ${failure}`)
    process.exit(1)
}

if (newFailures.length > 0) {
    console.error('Novas falhas de lint fora da baseline:')
    for (const failure of newFailures) console.error(`- ${failure}`)
    process.exit(1)
}

console.log(`${baseline.failures.length} falhas herdadas de lint permanecem isoladas.`)
