import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite-Konfiguration für das DualNet Frontend
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Alle Anfragen die mit /api beginnen werden an das Backend weitergeleitet
      // So vermeiden wir CORS-Probleme in der Entwicklung
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
