import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { publicBasePathFromHomepage } from '../config/public-base.mjs'

export function createNotFoundPage(template, homepage) {
    const basePath = `${publicBasePathFromHomepage(homepage)}/`

    return template.replaceAll('{{BASE_PATH}}', basePath)
}

async function preparePagesArtifact() {
    const [template, packageJson] = await Promise.all([
        readFile(new URL('../pages/404.html', import.meta.url), 'utf8'),
        readFile(new URL('../package.json', import.meta.url), 'utf8'),
    ])
    const { homepage } = JSON.parse(packageJson)
    const fallback = createNotFoundPage(template, homepage)

    await writeFile(new URL('../dist/404.html', import.meta.url), fallback)

    if (process.env.GITHUB_SHA && process.env.GITHUB_RUN_ID) {
        const provenance = {
            commit: process.env.GITHUB_SHA,
            repository: process.env.GITHUB_REPOSITORY,
            runId: process.env.GITHUB_RUN_ID,
        }
        await writeFile(
            new URL('../dist/deployment-provenance.json', import.meta.url),
            `${JSON.stringify(provenance, null, 2)}\n`
        )
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    await preparePagesArtifact()
}
