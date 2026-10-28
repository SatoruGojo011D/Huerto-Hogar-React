// Flujo de pago rechazado: conserva el carrito y va a la vista de error.
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutPage } from '../pages/CheckoutPage.jsx'
import { getOrders, saveCart } from '../js/storage.js'
import { getPendingOrder } from '../js/checkout.js'

const cart = [{ id: 'FR001', nombre: 'Manzanas Fuji', precio: 1000, qty: 2, imagen: 'img/manzanas-fuji.png' }]

async function pagar(approve) {
  const onNavigate = vi.fn()
  const user = userEvent.setup()
  render(<CheckoutPage onNavigate={onNavigate} approve={approve} />)
  await user.type(screen.getByLabelText('Nombre'), 'Ana')
  await user.type(screen.getByLabelText('Apellidos'), 'Soto')
  await user.type(screen.getByLabelText('Correo'), 'ana@gmail.com')
  await user.type(screen.getByLabelText('Calle'), 'Los Olmos 123')
  await user.click(screen.getByRole('button', { name: /Pagar ahora/ }))
  return onNavigate
}

describe('CheckoutPage', () => {
  beforeEach(() => saveCart(cart))

  test('con pago rechazado conserva el carrito y va a la vista de error', async () => {
    const onNavigate = await pagar(false)
    expect(getOrders()).toEqual([])
    expect(onNavigate).toHaveBeenCalledWith(`/compra/error?codigo=${getPendingOrder().code}`)
    expect(JSON.parse(localStorage.getItem('hh_carrito'))).toHaveLength(1)
  })
})
