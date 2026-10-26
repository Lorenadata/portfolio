import { describe, expect, it } from 'vitest'
import { anchorToWorld, coverDistance, PLANE_W, PLANE_H } from './geometry'

const flat = (d: number) => () => d

describe('anchorToWorld', () => {
  const a = { stopId: 'racetrack' as const, u: 0.5, v: 0.5, width: 2, rotY: 0 }
  it('el centro con profundidad máxima queda en x=0 y lo más cerca de la cámara', () => {
    const [x, y, z] = anchorToWorld(a, flat(1), 1.5)
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(0)
    expect(z).toBeCloseTo(1.5)
  })
  it('u=0 queda a la izquierda del plano', () => expect(anchorToWorld({ ...a, u: 0 }, flat(0), 1)[0]).toBeCloseTo(-PLANE_W / 2))
  it('v=0 queda arriba del plano', () => expect(anchorToWorld({ ...a, v: 0 }, flat(0), 1)[1]).toBeCloseTo(PLANE_H / 2))
  it('más depthScale aleja más el punto del fondo', () =>
    expect(anchorToWorld(a, flat(0.5), 2)[2]).toBeGreaterThan(anchorToWorld(a, flat(0.5), 1)[2]))
})

describe('coverDistance', () => {
  it('en pantalla 16:9 el plano llena justo la altura', () => {
    const d = coverDistance(16 / 9, PLANE_W, PLANE_H, 50)
    expect(2 * d * Math.tan((25 * Math.PI) / 180)).toBeCloseTo(PLANE_H)
  })
  it('en pantalla más ancha se acerca para llenar el ancho', () =>
    expect(coverDistance(21 / 9, PLANE_W, PLANE_H, 50)).toBeLessThan(coverDistance(16 / 9, PLANE_W, PLANE_H, 50)))
  it('en vertical el plano estrecho del móvil llena la altura', () => {
    const d = coverDistance(9 / 19.5, PLANE_W * 0.56, PLANE_H, 50)
    expect(2 * d * Math.tan((25 * Math.PI) / 180)).toBeLessThanOrEqual(PLANE_H + 1e-9)
  })
})
