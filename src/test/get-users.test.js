import { describe, expect, it } from 'vitest'
import { getUsers } from '../js/storage.js'
import { mockStorage } from './testUtils.js'

describe('getUsers', () => {
  it('keeps only user records that contain an email string', () => {
    mockStorage().set('usuarios_huerto', JSON.stringify([
      { correo: 'ana@example.com' },
      { nombre: 'Sin correo' },
      null,
    ]))
    expect(getUsers()).toEqual([{ correo: 'ana@example.com' }])
  })
})
