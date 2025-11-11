import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ✅ Keep this clean — only Vite-related config here
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
