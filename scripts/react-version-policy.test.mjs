import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readProjectFile = (path) =>
    readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('keeps React and the renderer on the approved 19.2 baseline', async () => {
    const packageJson = JSON.parse(await readProjectFile('package.json'))
    const packageLock = JSON.parse(await readProjectFile('package-lock.json'))

    assert.equal(packageJson.dependencies.react, '^19.2.8')
    assert.equal(packageJson.dependencies['react-dom'], '^19.2.8')
    assert.equal(packageLock.packages['node_modules/react'].version, '19.2.8')
    assert.equal(
        packageLock.packages['node_modules/react-dom'].version,
        '19.2.8',
    )
    assert.equal(
        packageLock.packages['node_modules/@testing-library/react'].version,
        '16.3.3',
    )
    assert.equal(
        packageLock.packages['node_modules/@fortawesome/react-fontawesome']
            .version,
        '3.5.0',
    )
})

test('uses the concurrent root interface compatible with the next version', async () => {
    const bootstrap = await readProjectFile('src/bootstrap.jsx')

    assert.match(bootstrap, /from 'react-dom\/client'/)
    assert.match(bootstrap, /ReactDOM\.createRoot\(/)
    assert.doesNotMatch(
        bootstrap,
        /ReactDOM\.render|ReactDOM\.hydrate|findDOMNode|unmountComponentAtNode/,
    )
})
