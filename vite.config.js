import { defineConfig } from 'vite'
import dotenv from 'dotenv'

// Cargar variables clásicas desde .env en la raíz
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  base: '/lanzador-dados/', // Nombre correcto del repositorio
  define: {
    // Exponer la variable al cliente como cadena. Fallback a 'false' si no está definida.
    'import.meta.env.VITE_SHOW_TV': JSON.stringify(process.env.VITE_SHOW_TV ?? 'false')
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        tv: 'tv.html'
      }
    }
  }
})