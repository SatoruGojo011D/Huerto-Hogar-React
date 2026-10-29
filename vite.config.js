// Configuración de Vite y Vitest: plugin de React, entorno jsdom para las pruebas, archivo de preparación (setup) y cobertura V8.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/testing/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage-v8',
      // Solo se mide el código que tiene pruebas unitarias (componentes, hooks y lógica del checkout).
      include: [
        'src/hooks/**',
        'src/components/{CampoFormulario,ControlCantidad,FiltrosCatalogo,MensajeEstado,TarjetaProducto,TablaProductosPedido}.jsx',
        'src/js/{checkout,adminData,products,format}.js',
        'src/pages/{CheckoutPage,AdminCriticalProductsPage}.jsx',
      ],
      exclude: [
        'node_modules/',
        'src/main.jsx',
        'src/test/**',
        'src/testing/**',
        '**/*.d.ts',
      ],
    },
  },
})
