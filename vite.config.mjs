import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import packageJson from './package.json' with { type: 'json' }

const publicBasePath = new URL(packageJson.homepage).pathname.replace(/\/$/, '')

export default defineConfig({
    base: `${publicBasePath}/`,
    define: {
        'process.env.PUBLIC_URL': JSON.stringify(publicBasePath),
    },
    plugins: [react()],
})
