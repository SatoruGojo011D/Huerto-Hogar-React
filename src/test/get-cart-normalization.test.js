import { describe, expect, it } from 'vitest'
import { getCart } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('getCart', () => {
  it('normalizes invalid prices and quantities and ignores entries without an ID', () => {
    mockStorage().set('hh_carrito', JSON.stringify([
      { id: 'apple', precio: '1200', qty: '2.8' },
      { id: 'pear', precio: 'invalid', qty: 0 },
      { precio: 100, qty: 1 },
      null,
    ]))
    expect(getCart()).toEqual([
      { id: 'apple', precio: 1200, qty: 2 },
      { id: 'pear', precio: 0, qty: 1 },
    ])
  })
})
