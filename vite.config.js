import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dados/', // Cambia 'dados' por el nombre exacto de tu repositorio
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        tv: 'tv.html'
      }
    }
  }
})