// Props y eventos: el componente es controlado y avisa al padre con onChange.
import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ControlCantidad from '../components/ControlCantidad.jsx'

describe('ControlCantidad', () => {
  test('informa el valor siguiente y anterior al padre y deshabilita los botones en sus límites', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<ControlCantidad value={2} min={1} max={3} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))
    expect(onChange).toHaveBeenLastCalledWith(3)
    await user.click(screen.getByRole('button', { name: 'Disminuir cantidad' }))
    expect(onChange).toHaveBeenLastCalledWith(1)
    // Es un componente controlado: el valor mostrado solo cambia cuando el padre lo actualiza.
    expect(screen.getByRole('status').textContent).toBe('2')

    rerender(<ControlCantidad value={3} min={1} max={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Aumentar cantidad' }).disabled).toBe(true)
    rerender(<ControlCantidad value={1} min={1} max={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Disminuir cantidad' }).disabled).toBe(true)
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
