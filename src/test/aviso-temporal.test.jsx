// Prueba de un Custom Hook con renderHook y act (guía de testing con Vitest).
import { afterEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useTransientFeedback from '../hooks/useTransientFeedback.js'

describe('useTransientFeedback Custom Hook', () => {
  afterEach(() => vi.useRealTimers())

  test('se activa con trigger y se apaga solo después de la duración indicada', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTransientFeedback(1000))
    expect(result.current.isActive).toBe(false)

    act(() => {
      result.current.trigger()
    })
    expect(result.current.isActive).toBe(true)

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current.isActive).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current.isActive).toBe(false)
  })
})
