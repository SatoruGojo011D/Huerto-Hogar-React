// Preparación común de las pruebas (setupFiles de Vitest): después de cada prueba desmonta los componentes, restaura los mocks globales y vacía localStorage.
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  localStorage.clear()
})
