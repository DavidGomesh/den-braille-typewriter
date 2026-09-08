import { readdir, readFile } from 'node:fs/promises'
import { dirname, extname, relative, resolve, sep } from 'node:path'
import process from 'node:process'
import ts from 'typescript'

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx'])
const ALLOWED_DEPENDENCIES = new Map([
    [
        'app',
        new Set([
            'braille',
            'experiences',
            'feedback',
            'preferences',
            'session',
            'ui',
        ]),
    ],
    ['braille', new Set()],
    ['experiences', new Set(['braille', 'preferences', 'session'])],
    ['feedback', new Set(['braille', 'experiences', 'preferences', 'session'])],
    ['preferences', new Set()],
    ['session', new Set(['braille', 'preferences'])],
    [
        'ui',
        new Set([
            'braille',
            'experiences',
            'feedback',
            'preferences',
            'session',
        ]),
    ],
])

const listSourceFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true })
    const nested = await Promise.all(
        entries.map((entry) => {
            const path = resolve(directory, entry.name)
            return entry.isDirectory() ? listSourceFiles(path) : [path]
        }),
    )

    return nested.flat().filter((path) => SOURCE_EXTENSIONS.has(extname(path)))
}

const importedModules = (source, fileName) => {
    const sourceFile = ts.createSourceFile(
        fileName,
        source,
        ts.ScriptTarget.Latest,
        true,
    )
    const modules = []

    const visit = (node) => {
        if (
            (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
            node.moduleSpecifier &&
            ts.isStringLiteral(node.moduleSpecifier)
        ) {
            modules.push(node.moduleSpecifier.text)
        }
        if (
            ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword &&
            node.arguments.length === 1 &&
            ts.isStringLiteral(node.arguments[0])
        ) {
            modules.push(node.arguments[0].text)
        }
        ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return modules
}

const normalizedRelativePath = (from, to) =>
    relative(from, to).split(sep).join('/')

export const findArchitectureViolations = async (projectRoot) => {
    const sourceRoot = resolve(projectRoot, 'src')
    const files = await listSourceFiles(sourceRoot)
    const violations = []
    const dependencies = new Map()

    for (const file of files) {
        const importerPath = normalizedRelativePath(sourceRoot, file)
        const importerCapability = importerPath.split('/')[0]

        const source = await readFile(file, 'utf8')
        for (const moduleSpecifier of importedModules(source, file)) {
            if (!moduleSpecifier.startsWith('.')) continue

            const importedPath = normalizedRelativePath(
                sourceRoot,
                resolve(dirname(file), moduleSpecifier),
            )
            const [importedCapability, ...internalPath] =
                importedPath.split('/')

            if (
                !ALLOWED_DEPENDENCIES.has(importedCapability) ||
                importedCapability === importerCapability
            ) {
                continue
            }

            const allowedDependencies =
                ALLOWED_DEPENDENCIES.get(importerCapability)
            if (allowedDependencies) {
                const capabilityDependencies =
                    dependencies.get(importerCapability) ?? new Set()
                capabilityDependencies.add(importedCapability)
                dependencies.set(importerCapability, capabilityDependencies)

                if (!allowedDependencies.has(importedCapability)) {
                    violations.push(
                        `${importerPath}: ${importerCapability} não pode depender de ${importedCapability}`,
                    )
                }
            }

            if (!/^public(?:\.[cm]?[jt]sx?)?$/.test(internalPath.join('/'))) {
                violations.push(
                    `${importerPath} importa detalhe interno de ${importedCapability}: ${moduleSpecifier}`,
                )
            }
        }
    }

    const visited = new Set()
    const active = new Set()
    const path = []

    const findCycle = (capability) => {
        if (active.has(capability)) {
            const cycleStart = path.indexOf(capability)
            return [...path.slice(cycleStart), capability]
        }
        if (visited.has(capability)) return undefined

        active.add(capability)
        path.push(capability)
        for (const dependency of dependencies.get(capability) ?? []) {
            const cycle = findCycle(dependency)
            if (cycle) return cycle
        }
        path.pop()
        active.delete(capability)
        visited.add(capability)
        return undefined
    }

    for (const capability of [...dependencies.keys()].sort()) {
        const cycle = findCycle(capability)
        if (cycle) {
            violations.push(`Ciclo entre capacidades: ${cycle.join(' -> ')}`)
            break
        }
    }

    return violations
}

const projectRoot = resolve(process.argv[2] ?? process.cwd())
const violations = await findArchitectureViolations(projectRoot)

if (violations.length > 0) {
    process.stderr.write(
        `Fronteiras arquiteturais violadas:\n- ${violations.join('\n- ')}\n`,
    )
    process.exitCode = 1
} else {
    process.stdout.write('Fronteiras arquiteturais preservadas.\n')
}
