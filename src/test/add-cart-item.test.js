import { describe, expect, it } from 'vitest'
import { addCartItem, getCart } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('addCartItem', () => {
  it('adds a new product using a floored positive quantity', () => {
    mockStorage()
    expect(addCartItem({ id: 'apple', name: 'Manzana', price: 1200 }, 2.8)).toBe(2)
    expect(getCart()).toEqual([{
      id: 'apple',
      nombre: 'Manzana',
      precio: 1200,
      imagen: 'img/manzanas-fuji.png',
      qty: 2,
    }])
  })

  it('stores the discounted price in the cart and keeps the normal price for reference', () => {
    mockStorage()
    addCartItem({ id: 'apple', name: 'Manzana', price: 1200, discountedPrice: 900 }, 2)
    expect(getCart()).toEqual([{
      id: 'apple',
      nombre: 'Manzana',
      precio: 900,
      imagen: 'img/manzanas-fuji.png',
      qty: 2,
      precio_original: 1200,
    }])
  })
})
