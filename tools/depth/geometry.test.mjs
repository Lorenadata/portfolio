import { describe, expect, it } from 'vitest'
import { assert169, mobileCrop, outputWidth } from './geometry.mjs'

describe('assert169', () => {
  it('acepta 16:9 exacto', () => expect(() => assert169(1920, 1080)).not.toThrow())
  it('acepta la referencia 1672x941 (±2 %)', () => expect(() => assert169(1672, 941)).not.toThrow())
  it('rechaza una imagen cuadrada con mensaje claro', () =>
    expect(() => assert169(1024, 1024)).toThrow(/16:9/))
})

describe('mobileCrop', () => {
  it('recorta el 56 % central del ancho a toda la altura', () =>
    expect(mobileCrop(2000, 1125)).toEqual({ left: 440, top: 0, width: 1120, height: 1125 }))
})

describe('outputWidth', () => {
  it('nunca amplía', () => expect(outputWidth(1672, 2560)).toBe(1672))
  it('reduce a 2560 si es mayor', () => expect(outputWidth(4096, 2560)).toBe(2560))
})
