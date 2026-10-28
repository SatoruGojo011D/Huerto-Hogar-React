// Flujo de pago aprobado: registra el pedido, vacía el carrito y va a la compra exitosa.
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutPage } from '../pages/CheckoutPage.jsx'
import { getOrders, saveCart } from '../js/storage.js'
import { getAdminProducts } from '../js/adminData.js'

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

  test('con pago aprobado registra el pedido, vacía el carrito y va a la compra exitosa', async () => {
    const onNavigate = await pagar(true)
    const [order] = getOrders()
    expect(order.address.calle).toBe('Los Olmos 123')
    expect(onNavigate).toHaveBeenCalledWith(`/compra/exitosa?codigo=${order.code}`)
    expect(localStorage.getItem('hh_carrito')).toBe('[]')
    expect(order.total).toBe(order.subtotal + order.iva + order.shipping)
    expect(getAdminProducts().find((product) => product.id === 'FR001').stock).toBe('30')
  })
})
