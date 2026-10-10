import { describe, expect, it } from 'vitest'
import { addCartItem, getCart } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('addCartItem', () => {
  it('increases an existing product quantity instead of adding a duplicate', () => {
    mockStorage().set('hh_carrito', JSON.stringify([{ id: 'apple', precio: 1200, qty: 2 }]))
    expect(addCartItem({ id: 'apple', name: 'Manzana', price: 1200 }, 3)).toBe(5)
    expect(getCart()).toHaveLength(1)
    expect(getCart()[0].qty).toBe(5)
  })
})
