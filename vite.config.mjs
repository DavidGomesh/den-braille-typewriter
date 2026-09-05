import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/den-braille-typewriter/',
    plugins: [react()],
})
