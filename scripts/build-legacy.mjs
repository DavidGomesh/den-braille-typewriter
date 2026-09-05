import { spawnSync } from 'node:child_process'

const reactScripts = new URL(
    '../node_modules/react-scripts/bin/react-scripts.js',
    import.meta.url
).pathname
const build = spawnSync(process.execPath, [reactScripts, 'build'], {
    env: { ...process.env, CI: 'false' },
    stdio: 'inherit',
})

if (build.error) {
    console.error(build.error.message)
    process.exit(1)
}

process.exit(build.status ?? 1)
