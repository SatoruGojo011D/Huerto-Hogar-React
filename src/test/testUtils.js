import { vi } from 'vitest'

export function mockStorage() {
  const values = new Map()
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, String(value))),
    removeItem: vi.fn((key) => values.delete(key)),
  })
  vi.stubGlobal('window', { dispatchEvent: vi.fn() })
  return values
}
