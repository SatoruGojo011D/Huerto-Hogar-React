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
})
