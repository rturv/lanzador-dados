import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/lanzador-dados/', // Nombre correcto del repositorio
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        tv: 'tv.html'
      }
    }
  }
})