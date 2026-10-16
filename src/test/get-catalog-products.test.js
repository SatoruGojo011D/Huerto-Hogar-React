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

  it('applies product discounts consistently to base and admin-created products', () => {
    mockStorage().set('productos_huerto', JSON.stringify([
      { id: 'FR001', precio: 1200, descuento: 25 },
      { id: 'HH01', nombre: 'Lechuga', categoria: 'Verduras', precio: 900, descuento: 10 },
    ]))
    const catalog = getCatalogProducts()
    expect(catalog.find((product) => product.id === 'FR001')).toMatchObject({
      price: 1200,
      discountPercent: 25,
      discountedPrice: 900,
    })
    expect(catalog.find((product) => product.id === 'HH01')).toMatchObject({
      price: 900,
      discountPercent: 10,
      discountedPrice: 810,
    })
  })

  it('includes the initial promotions in the catalog and allows admin to turn them off', () => {
    const storage = mockStorage()
    const initialCatalog = getCatalogProducts()
    expect(initialCatalog.filter((product) => product.discountPercent > 0)).toHaveLength(4)
    expect(initialCatalog.find((product) => product.id === 'FR003')).toMatchObject({
      price: 800,
      discountPercent: 15,
      discountedPrice: 680,
    })

    storage.set('productos_huerto', JSON.stringify([{ id: 'FR003', descuento: 0 }]))
    expect(getCatalogProducts().find((product) => product.id === 'FR003')).toMatchObject({
      discountPercent: 0,
      discountedPrice: 800,
    })
  })
})
