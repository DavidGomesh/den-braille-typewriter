import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readProjectFile = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('usa rotas por hash na composição publicada', async () => {
    const bootstrap = await readProjectFile('src/bootstrap.jsx')

    assert.match(bootstrap, /import \{ HashRouter, Route, Routes \}/)
    assert.match(bootstrap, /<HashRouter>/)
    assert.doesNotMatch(bootstrap, /<BrowserRouter/)
})

test('oferece fallback 404 estático e acessível', async () => {
    const fallback = await readProjectFile('public/404.html')

    assert.match(fallback, /<html lang="pt-BR">/)
    assert.match(fallback, /<title>Página não encontrada/)
    assert.match(fallback, /<h1[^>]*>Página não encontrada<\/h1>/)
    assert.match(fallback, /href="\/den-braille-typewriter\/"/)
})

test('publica o artifact Vite e permite republicar uma execução conhecida', async () => {
    const workflow = await readProjectFile('.github/workflows/pages.yml')

    assert.match(workflow, /push:\s*\n\s*branches:\s*\[main\]/)
    assert.match(workflow, /workflow_dispatch:/)
    assert.match(workflow, /source_run_id:/)
    assert.match(workflow, /run: npm run build:vite/)
    assert.match(workflow, /name: vite-pages-dist/)
    assert.match(workflow, /path: dist/)
    assert.match(workflow, /run-id:.*source_run_id/)
    assert.match(workflow, /uses: actions\/upload-pages-artifact@v3/)
    assert.match(workflow, /uses: actions\/deploy-pages@v4/)
})
