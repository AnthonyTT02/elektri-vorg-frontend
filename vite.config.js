import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['s8gdcwpy355kkh94r1wk2v6x.176.112.158.15.sslip.io'],
    host: '0.0.0.0',
    port: 4173,
  }
})