import { describe, expect, it } from 'vitest'
import { writeStorage } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('writeStorage', () => {
  it('serializes an object as JSON before saving it', () => {
    mockStorage()
    writeStorage('settings', { theme: 'green' })
    expect(localStorage.setItem).toHaveBeenCalledWith('settings', '{"theme":"green"}')
  })
})
