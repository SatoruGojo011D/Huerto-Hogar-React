import { describe, expect, it } from 'vitest'
import { readStorage } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('readStorage', () => {
  it('returns the supplied fallback when the requested key is missing', () => {
    mockStorage()
    expect(readStorage('missing', ['fallback'])).toEqual(['fallback'])
  })
})
