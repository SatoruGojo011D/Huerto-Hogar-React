// Renderizado con props y eventos: muestra los datos recibidos y delega la compra al padre.
import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import TarjetaProducto from '../components/TarjetaProducto.jsx'
import { PIXEL, buildProduct } from '../testing/productFixture.js'

describe('TarjetaProducto', () => {
  test('muestra precios, descuento y enlace, y llama onAdd con el producto', () => {
    const onAdd = vi.fn()
    const product = buildProduct()
    render(<TarjetaProducto product={product} onAdd={onAdd} />)

    expect(screen.getByRole('heading', { name: 'Zanahorias Orgánicas' })).toBeTruthy()
    expect(screen.getByText('$1.000 CLP').tagName).toBe('DEL')
    expect(screen.getByText('$900 CLP')).toBeTruthy()
    expect(screen.getByText('-10%')).toBeTruthy()
    expect(screen.getByText(/Stock: 10 ·/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ver detalles de Zanahorias Orgánicas' }).getAttribute('href')).toBe('/producto?id=VR001')
    expect(screen.getByRole('img', { name: 'Zanahorias Orgánicas' }).getAttribute('src')).toBe(PIXEL)

    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }))

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith(product)
    expect(screen.getByRole('button', { name: /Añadido/ })).toBeTruthy()
  })
})
