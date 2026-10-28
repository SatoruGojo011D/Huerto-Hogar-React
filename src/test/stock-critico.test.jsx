// Stock crítico: solo se listan productos con 10 o menos unidades, mostradas sin unidades y de menor a mayor.
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdminCriticalProductsPage } from '../pages/AdminCriticalProductsPage.jsx'

describe('AdminCriticalProductsPage', () => {
  test('lista solo los productos con stock crítico, sin unidades y ordenados de menor a mayor', () => {
    localStorage.setItem('productos_huerto', JSON.stringify([
      { id: 'FR001', nombre: 'Manzanas Fuji', categoria: 'Frutas Frescas', precio: 1200, stock: '8 kg' },
      { id: 'FR002', nombre: 'Naranjas Valencia', categoria: 'Frutas Frescas', precio: 1000, stock: 3 },
      { id: 'FR003', nombre: 'Plátanos Cavendish', categoria: 'Frutas Frescas', precio: 800, stock: 11 },
    ]))
    render(<AdminCriticalProductsPage />)
    const rows = screen.getAllByRole('row').slice(1)
    expect(rows.map((row) => row.cells[0].textContent)).toEqual(['Naranjas Valencia', 'Manzanas Fuji'])
    expect(rows.map((row) => row.cells[3].textContent)).toEqual(['3', '8'])
    expect(screen.queryByText('Plátanos Cavendish')).toBeNull()
  })
})
