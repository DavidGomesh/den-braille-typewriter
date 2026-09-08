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

test('rejects external imports of capability internals', async () => {
    const root = await createProject({
        'braille/internal/cell.ts': 'export const cell = 1',
        'session/public.ts':
            "import { cell } from '../braille/internal/cell'\nexport { cell }",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(
        result.stderr,
        /session\/public\.ts imports an internal detail of braille/,
    )
})

test('accepts public interfaces as consumer entry points', async () => {
    const root = await createProject({
        'braille/public.js': 'export const cell = 1',
        'session/public.ts':
            "import { cell } from '../braille/public.js'\nexport { cell }",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 0)
    assert.match(result.stdout, /Architecture boundaries preserved/)
})

test('rejects dynamic imports of internal details', async () => {
    const root = await createProject({
        'feedback/internal/catalog.ts': 'export const catalog = {}',
        'ui/public.ts':
            "export const catalog = import('../feedback/internal/catalog')",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(
        result.stderr,
        /ui\/public\.ts imports an internal detail of feedback/,
    )
})

test('rejects internal details consumed by legacy code', async () => {
    const root = await createProject({
        'braille/machine/state.ts': 'export const state = {}',
        'components/Legacy.tsx':
            "import { state } from '../braille/machine/state'\nexport { state }",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(
        result.stderr,
        /components\/Legacy\.tsx imports an internal detail of braille/,
    )
})

test('rejects cycles between capabilities through public interfaces', async () => {
    const root = await createProject({
        'braille/public.ts': "export { session } from '../session/public'",
        'session/public.ts': "export { braille } from '../braille/public'",
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(
        result.stderr,
        /Capability cycle: braille -> session -> braille/,
    )
})

test('rejects dependencies contrary to the documented direction', async () => {
    const root = await createProject({
        'braille/public.ts': "export { session } from '../session/public'",
        'session/public.ts': 'export const session = {}',
    })

    const result = runArchitectureCheck(root)

    assert.equal(result.status, 1)
    assert.match(result.stderr, /braille cannot depend on session/)
})
