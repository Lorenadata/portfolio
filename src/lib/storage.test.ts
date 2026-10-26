import { afterEach, expect, it, vi } from 'vitest'
import { safeGet, safeSet } from './storage'

afterEach(() => vi.restoreAllMocks())

it('safeGet devuelve null si localStorage lanza (modo privado)', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('SecurityError')
  })
  expect(safeGet('lang')).toBeNull()
})

it('safeSet no lanza si localStorage lanza', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('QuotaExceeded')
  })
  expect(() => safeSet('lang', 'es')).not.toThrow()
})

it('guarda y lee normalmente', () => {
  safeSet('k', 'v')
  expect(safeGet('k')).toBe('v')
})
