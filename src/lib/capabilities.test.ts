import { describe, expect, it } from 'vitest'
import { canRender3D, detectQuality } from './capabilities'

describe('canRender3D', () => {
  it('sin WebGL no hay 3D', () => expect(canRender3D({ webgl: false, reducedMotion: false })).toBe(false))
  it('con movimiento reducido no hay 3D', () => expect(canRender3D({ webgl: true, reducedMotion: true })).toBe(false))
  it('con WebGL y movimiento sí hay 3D', () => expect(canRender3D({ webgl: true, reducedMotion: false })).toBe(true))
})

describe('detectQuality', () => {
  it('móvil es low', () => expect(detectQuality({ dpr: 3, cores: 4, mobile: true })).toBe('low'))
  it('escritorio potente es high', () => expect(detectQuality({ dpr: 2, cores: 8, mobile: false })).toBe('high'))
  it('pocos núcleos es low', () => expect(detectQuality({ dpr: 1, cores: 4, mobile: false })).toBe('low'))
})
