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
})
