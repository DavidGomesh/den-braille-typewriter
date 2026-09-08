import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readProjectFile = (path) =>
    readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('mantém React e renderer na linha de transição 18.3', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))
    const packageLock = JSON.parse(await readProjectFile('package-lock.json'))

    assert.equal(packageJson.dependencies.react, '^18.3.1')
    assert.equal(packageJson.dependencies['react-dom'], '^18.3.1')
    assert.equal(packageLock.packages['node_modules/react'].version, '18.3.1')
    assert.equal(
        packageLock.packages['node_modules/react-dom'].version,
        '18.3.1',
    )
})

test('usa a API de raiz concorrente compatível com a próxima versão', async () => {
    const bootstrap = await readProjectFile('src/bootstrap.jsx')

    assert.match(bootstrap, /from 'react-dom\/client'/)
    assert.match(bootstrap, /\.createRoot\(/)
    assert.doesNotMatch(
        bootstrap,
        /ReactDOM\.render|ReactDOM\.hydrate|findDOMNode|unmountComponentAtNode/,
    )
})
