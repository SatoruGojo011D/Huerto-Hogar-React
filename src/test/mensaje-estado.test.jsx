// Renderizado condicional: solo aparece con contenido y usa el rol accesible correcto.
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import MensajeEstado from '../components/MensajeEstado.jsx'

describe('MensajeEstado', () => {
  test('no renderiza nada vacío y distingue errores (alert) de confirmaciones (status)', () => {
    const { container, rerender } = render(<MensajeEstado />)
    expect(container.firstChild).toBeNull()

    rerender(<MensajeEstado>Ocurrió un error</MensajeEstado>)
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('assertive')
    expect(screen.queryByRole('status')).toBeNull()

    rerender(<MensajeEstado variant="success">Guardado correctamente</MensajeEstado>)
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite')
    expect(screen.getByRole('status').textContent).toBe('Guardado correctamente')
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
