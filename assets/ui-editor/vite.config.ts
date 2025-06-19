import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { name } from './package.json';


// https://vite.dev/config/
export default defineConfig({
  root: './',
  base: `/${name}/`,
  plugins: [react()],
  build: {
    outDir: `../../dist/${name}`, // pasta fora do diretório atual
    emptyOutDir: true, // limpa o destino antes do build
  },
})
