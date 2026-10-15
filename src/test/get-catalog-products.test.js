import { describe, expect, it } from 'vitest'
import { getCatalogProducts } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('getCatalogProducts', () => {
  it('normalizes valid custom products and ignores records without names or IDs', () => {
    mockStorage().set('productos_huerto', JSON.stringify([
      { id: 42, nombre: 'Lechuga', categoria: 'Verduras orgánicas', precio: '900', stock: 12 },
      { id: 43, nombre: '   ', categoria: 'Frutas' },
      { nombre: 'Sin identificador' },
    ]))
    const catalog = getCatalogProducts()
    expect(catalog.find((product) => product.id === '42')).toMatchObject({
      name: 'Lechuga',
      category: 'verduras',
      price: 900,
      stock: '12',
    })
    expect(catalog.some((product) => product.name === 'Sin identificador')).toBe(false)
  })

  it('applies admin edits to base products and omits products deactivated in admin', () => {
    mockStorage().set('productos_huerto', JSON.stringify([
      { id: 'FR001', nombre: 'Manzanas editadas', categoria: 'Frutas', precio: 800, stock: 0, activo: true },
      { id: 'FR002', activo: false },
    ]))
    const catalog = getCatalogProducts()
    expect(catalog.find((product) => product.id === 'FR001')).toMatchObject({
      name: 'Manzanas editadas',
      price: 800,
      stock: '0',
    })
    expect(catalog.some((product) => product.id === 'FR002')).toBe(false)
  })
})
