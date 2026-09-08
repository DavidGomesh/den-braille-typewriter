import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readProjectFile = (path) =>
    readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const verificationCommands = [
    'format',
    'lint',
    'typecheck',
    'architecture',
    'test:ci',
    'build',
    'audit',
]

test('exposes stable commands that only verify the project', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))

    for (const command of verificationCommands) {
        assert.equal(typeof packageJson.scripts[command], 'string')
        assert.doesNotMatch(packageJson.scripts[command], /--write|--fix/)
    }
})

test('CI runs every approved guardrail exactly once', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))
    const workflow = await readProjectFile('.github/workflows/ci.yml')

    for (const command of verificationCommands) {
        assert.equal(
            (
                packageJson.scripts.ci.match(
                    new RegExp(`npm run ${command}(?!:)`, 'g'),
                ) ?? []
            ).length,
            1,
        )
    }
    assert.match(workflow, /run: npm run ci/)
})

function assertGovernedException(exception, source) {
    assert.match(exception.reason, /\S/)
    assert.match(exception.risk, /\S/)
    assert.match(exception.owner, /^@\S+/)
    assert.match(exception.expiresOn, /^\d{4}-\d{2}-\d{2}$/)
    assert.match(exception.approvedBy, /^@\S+/)
    assert.match(exception.trackingIssue, /^#\d+$/)
    assert.ok(
        Date.parse(`${exception.expiresOn}T23:59:59Z`) >= Date.now(),
        `${source} has an expired exception`,
    )
}

test('exceptions record governance and remain within their deadline', async () => {
    for (const path of [
        'config/lint-baseline.json',
        'config/audit-baseline.json',
    ]) {
        const baseline = JSON.parse(await readProjectFile(path))
        assertGovernedException(baseline.exception, path)
    }

    const formatBaseline = JSON.parse(
        await readProjectFile('config/format-baseline.json'),
    )
    const ignoredPatterns = (await readProjectFile('.prettierignore'))
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))

    assert.deepEqual(
        formatBaseline.exclusions.map(({ pattern }) => pattern),
        ignoredPatterns,
    )
    for (const exclusion of formatBaseline.exclusions) {
        assertGovernedException(exclusion, `formatting:${exclusion.pattern}`)
    }
})
