import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite: el plugin de React permite usar JSX y "recarga en caliente".
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
