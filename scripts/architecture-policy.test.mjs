import assert from 'node:assert/strict'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const createProject = async (files) => {
    const root = await mkdtemp(join(tmpdir(), 'den-architecture-'))

    await Promise.all(
        Object.entries(files).map(async ([relativePath, contents]) => {
            const absolutePath = join(root, 'src', relativePath)
            await mkdir(join(absolutePath, '..'), { recursive: true })
            await writeFile(absolutePath, contents)
        }),
    )

    return root
}

const runArchitectureCheck = (root) =>
    spawnSync(process.execPath, ['scripts/check-architecture.mjs', root], {
        cwd: process.cwd(),
        encoding: 'utf8',
    })

test('rejeita import externo de detalhe interno de uma capacidade', async () => {
    const root = await createProject({
        'braille/internal/cell.ts': 'export const cell = 1',
        'session/public.ts':
            "import { cell } from '../braille/internal/cell'\nexport { cell }",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(
        result.stderr,
        /session\/public\.ts importa detalhe interno de braille/,
    )
})

test('aceita interfaces públicas como entrada dos consumidores', async () => {
    const root = await createProject({
        'braille/public.js': 'export const cell = 1',
        'session/public.ts':
            "import { cell } from '../braille/public.js'\nexport { cell }",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 0)
    assert.match(result.stdout, /Fronteiras arquiteturais preservadas/)
})

test('rejeita import dinâmico de detalhe interno', async () => {
    const root = await createProject({
        'feedback/internal/catalog.ts': 'export const catalog = {}',
        'ui/public.ts':
            "export const catalog = import('../feedback/internal/catalog')",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(
        result.stderr,
        /ui\/public\.ts importa detalhe interno de feedback/,
    )
})

test('rejeita detalhe interno consumido pelo código legado', async () => {
    const root = await createProject({
        'braille/machine/state.ts': 'export const state = {}',
        'components/Legacy.tsx':
            "import { state } from '../braille/machine/state'\nexport { state }",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(
        result.stderr,
        /components\/Legacy\.tsx importa detalhe interno de braille/,
    )
})

test('rejeita ciclo entre capacidades por suas interfaces públicas', async () => {
    const root = await createProject({
        'braille/public.ts': "export { session } from '../session/public'",
        'session/public.ts': "export { braille } from '../braille/public'",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(
        result.stderr,
        /Ciclo entre capacidades: braille -> session -> braille/,
    )
})

test('rejeita dependência contrária à direção documentada', async () => {
    const root = await createProject({
        'braille/public.ts': "export { session } from '../session/public'",
        'session/public.ts': 'export const session = {}',
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(result.stderr, /braille não pode depender de session/)
})
