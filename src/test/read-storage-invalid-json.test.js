import { describe, expect, it } from 'vitest'
import { readStorage } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('readStorage', () => {
  it('returns the fallback instead of throwing when stored JSON is malformed', () => {
    mockStorage().set('broken', '{invalid')
    expect(readStorage('broken', null)).toBeNull()
  })
})
