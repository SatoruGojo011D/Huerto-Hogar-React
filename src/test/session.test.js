import { describe, expect, it } from 'vitest'
import { getSession, setSession } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('session helpers', () => {
  it('stores the active session and notifies listeners about the change', () => {
    mockStorage()
    const session = { id: 1, correo: 'ana@example.com', rol: 'cliente' }
    setSession(session)
    expect(getSession()).toEqual(session)
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'hh:session-change' }))
  })
})
