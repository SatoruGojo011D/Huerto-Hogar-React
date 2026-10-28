// Prueba del Custom Hook useFetch con renderHook; fetch se simula con vi.fn (mock).
import { afterEach, describe, expect, test, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from '../hooks/useFetch.js'

describe('useFetch Custom Hook', () => {
  afterEach(() => vi.unstubAllGlobals())

  test('empieza cargando y luego entrega los datos', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([{ ciudad: 'Santiago' }]) })))
    const { result } = renderHook(() => useFetch('/data/sucursales.json'))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual([{ ciudad: 'Santiago' }])
    expect(result.current.error).toBeNull()
    expect(fetch).toHaveBeenCalledWith('/data/sucursales.json', expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })
})
