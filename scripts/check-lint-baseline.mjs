import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

import { evaluateLint } from './lint-policy.mjs'

const rootDirectory = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const baseline = JSON.parse(
    readFileSync(
        new URL('../config/lint-baseline.json', import.meta.url),
        'utf8',
    ),
)
const eslint = spawnSync(
    process.execPath,
    [
        new URL('../node_modules/eslint/bin/eslint.js', import.meta.url)
            .pathname,
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
    { cwd: rootDirectory, encoding: 'utf8' },
)

if (eslint.error) {
    console.error(`Could not run ESLint: ${eslint.error.message}`)
    process.exit(1)
}

let report
try {
    report = JSON.parse(eslint.stdout)
} catch {
    console.error(
        eslint.stderr || eslint.stdout || 'ESLint did not produce valid JSON.',
    )
    process.exit(1)
}

const { newFailures, resolvedFailures } = evaluateLint(
    report,
    baseline.failures,
    rootDirectory,
)

if (resolvedFailures.length > 0) {
    console.error(
        'Inherited failures resolved; reduce config/lint-baseline.json:',
    )
    for (const failure of resolvedFailures) console.error(`- ${failure}`)
    process.exit(1)
}

if (newFailures.length > 0) {
    console.error('New lint failures outside the baseline:')
    for (const failure of newFailures) console.error(`- ${failure}`)
    process.exit(1)
}

console.log(
    `${baseline.failures.length} inherited lint failures remain isolated.`,
)
