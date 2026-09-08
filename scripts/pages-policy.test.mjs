import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { createNotFoundPage } from './prepare-pages.mjs'
import { publicBasePathFromHomepage } from '../config/public-base.mjs'

const readProjectFile = (path) =>
    readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('uses hash routes in the published composition', async () => {
    const bootstrap = await readProjectFile('src/bootstrap.jsx')

    assert.match(bootstrap, /import \{ HashRouter, Route, Routes \}/)
    assert.match(bootstrap, /<HashRouter>/)
    assert.doesNotMatch(bootstrap, /<BrowserRouter/)
})

test('provides a static accessible 404 fallback', async () => {
    const template = await readProjectFile('pages/404.html')
    const notFoundPage = createNotFoundPage(
        template,
        'https://example.test/outro-projeto',
    )

    assert.match(notFoundPage, /<html lang="pt-BR">/)
    assert.match(notFoundPage, /<title>Página não encontrada/)
    assert.match(notFoundPage, /<h1[^>]*>Página não encontrada<\/h1>/)
    assert.match(notFoundPage, /href="\/outro-projeto\/"/)
    assert.doesNotMatch(template, /den-braille-typewriter/)
})

test('derives a single public base for the build and fallback', () => {
    assert.equal(
        publicBasePathFromHomepage('https://example.test/outro-projeto/'),
        '/outro-projeto',
    )
})

test('publishes the Vite artifact and can redeploy a known run', async () => {
    const [workflow, artifactPreparation] = await Promise.all([
        readProjectFile('.github/workflows/pages.yml'),
        readProjectFile('scripts/prepare-pages.mjs'),
    ])

    assert.match(workflow, /push:\s*\n\s*branches:\s*\[main\]/)
    assert.match(workflow, /workflow_dispatch:/)
    assert.match(workflow, /source_run_id:/)
    assert.match(workflow, /run: npm run ci/)
    assert.match(workflow, /name: vite-pages-dist/)
    assert.match(workflow, /path: dist/)
    assert.match(workflow, /run-id:.*source_run_id/)
    assert.match(workflow, /getWorkflowRun/)
    assert.match(workflow, /head_sha/)
    assert.match(workflow, /head_branch !== 'main'/)
    assert.match(workflow, /conclusion !== 'success'/)
    assert.match(workflow, /github\.ref != 'refs\/heads\/main'/)
    assert.match(workflow, /retention-days: 90/)
    assert.match(artifactPreparation, /deployment-provenance\.json/)
    assert.match(workflow, /uses: actions\/upload-pages-artifact@v3/)
    assert.match(workflow, /uses: actions\/deploy-pages@v4/)
})
