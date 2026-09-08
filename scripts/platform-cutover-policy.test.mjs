import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

const readProjectFile = (path) =>
    readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('exposes only the canonical Vite commands', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))

    assert.equal(packageJson.scripts.start, 'vite')
    assert.equal(
        packageJson.scripts.build,
        'vite build && node scripts/prepare-pages.mjs',
    )
    assert.equal(packageJson.scripts.preview, 'vite preview')
    assert.equal(packageJson.scripts.ci.includes('build:vite'), false)
    assert.equal(packageJson.scripts['start:vite'], undefined)
    assert.equal(packageJson.scripts['build:vite'], undefined)
    assert.equal(packageJson.scripts['preview:vite'], undefined)
})

test('does not retain CRA dependencies, scripts or configuration', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))
    const manifest = JSON.stringify(packageJson)

    assert.doesNotMatch(manifest, /react-scripts|gh-pages/)
    assert.equal(packageJson.scripts.eject, undefined)
    assert.equal(packageJson.scripts.deploy, undefined)
    assert.equal(packageJson.scripts.predeploy, undefined)
    assert.equal(packageJson.eslintConfig, undefined)

    await assert.rejects(
        access(new URL('../public/index.html', import.meta.url)),
    )
    await assert.rejects(access(new URL('./build-legacy.mjs', import.meta.url)))
    await assert.rejects(access(new URL('../.npmrc', import.meta.url)))
})

test('CI exercises the canonical build exactly once', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))
    const ciWorkflow = await readProjectFile('.github/workflows/ci.yml')

    assert.equal(
        (packageJson.scripts.ci.match(/npm run build/g) ?? []).length,
        1,
    )
    assert.doesNotMatch(packageJson.scripts.ci, /build:vite|legacy/)
    assert.doesNotMatch(ciWorkflow, /legacy/i)
})
