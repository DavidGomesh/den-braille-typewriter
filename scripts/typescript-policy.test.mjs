import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readProjectFile = (path) =>
    readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('mantém somente TypeScript 6 na árvore instalada', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))
    const packageLock = JSON.parse(await readProjectFile('package-lock.json'))
    const installedTypeScript = Object.entries(packageLock.packages)
        .filter(([path]) => path.endsWith('node_modules/typescript'))
        .map(([, metadata]) => metadata.version)

    assert.equal(packageJson.devDependencies.typescript, '^6.0.3')
    assert.deepEqual(installedTypeScript, ['6.0.3'])
})

test('executa o typecheck estrito sem emitir arquivos', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))
    const tsconfig = JSON.parse(await readProjectFile('tsconfig.json'))

    assert.equal(packageJson.scripts.typecheck, 'tsc --noEmit')
    assert.equal(tsconfig.compilerOptions.strict, true)
    assert.equal(tsconfig.compilerOptions.noEmit, true)
})

test('exige justificativa localizada para supressões TypeScript', async () => {
    const eslintConfig = await readProjectFile('.eslintrc.cjs')

    assert.match(eslintConfig, /'@typescript-eslint\/ban-ts-comment'/)
    assert.match(eslintConfig, /'allow-with-description'/)
})
