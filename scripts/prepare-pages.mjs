import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export function createNotFoundPage(template, homepage) {
    const basePath = `${new URL(homepage).pathname.replace(/\/$/, '')}/`

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
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    await preparePagesArtifact()
}
