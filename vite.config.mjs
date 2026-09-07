import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import packageJson from './package.json' with { type: 'json' }
import { publicBasePathFromHomepage } from './config/public-base.mjs'

const publicBasePath = publicBasePathFromHomepage(packageJson.homepage)

export default defineConfig({
    base: `${publicBasePath}/`,
    define: {
        'process.env.PUBLIC_URL': JSON.stringify(publicBasePath),
    },
    plugins: [react()],
})
