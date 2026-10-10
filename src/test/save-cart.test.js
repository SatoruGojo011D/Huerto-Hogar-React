import { describe, expect, it } from 'vitest'
import { saveCart } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('saveCart', () => {
  it('saves the item count and dispatches a cart-change event', () => {
    const values = mockStorage()
    expect(saveCart([{ id: 'apple', qty: 2 }, { id: 'pear', qty: 3 }])).toBe(5)
    expect(values.get('hh_carrito_cantidad')).toBe('5')
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'hh:cart-change' }))
  })
})
