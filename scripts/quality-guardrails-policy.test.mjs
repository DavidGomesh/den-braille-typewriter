import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readProjectFile = (path) =>
    readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const verificationCommands = [
    'format',
    'lint',
    'typecheck',
    'test:ci',
    'build',
    'audit',
]

test('expõe comandos estáveis que apenas verificam o projeto', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))

    for (const command of verificationCommands) {
        assert.equal(typeof packageJson.scripts[command], 'string')
        assert.doesNotMatch(packageJson.scripts[command], /--write|--fix/)
    }
})

test('CI executa cada guardrail aprovado uma única vez', async () => {
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

test('exceções registram motivo, risco, responsável e prazo', async () => {
    for (const path of [
        'config/lint-baseline.json',
        'config/audit-baseline.json',
    ]) {
        const baseline = JSON.parse(await readProjectFile(path))

        assert.match(baseline.exception.reason, /\S/)
        assert.match(baseline.exception.risk, /\S/)
        assert.match(baseline.exception.owner, /^@\S+/)
        assert.match(baseline.exception.expiresOn, /^\d{4}-\d{2}-\d{2}$/)
        assert.ok(
            Date.parse(`${baseline.exception.expiresOn}T23:59:59Z`) >=
                Date.now(),
            `${path} possui uma exceção expirada`,
        )
    }
})
