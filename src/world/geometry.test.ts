import { describe, expect, it } from 'vitest'
import { anchorToWorld, coverDistance, focusFor, PLANE_W, PLANE_H } from './geometry'

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

describe('focusFor', () => {
  const izq = { stopId: 'pobreza' as const, u: 0.3, v: 0.37, width: 1.6, rotY: 0.35 }
  const der = { stopId: 'ridesharing' as const, u: 0.86, v: 0.335, width: 1.8, rotY: -0.35 }
  const base = coverDistance(16 / 9, PLANE_W, PLANE_H, 50) * 0.9

  it('se acerca a la fachada: la cámara queda más cerca que la vista general', () =>
    expect(focusFor(izq, 16 / 9, PLANE_W, PLANE_H, 50).z).toBeLessThan(base))

  it('dos tiendas de la misma foto dan encuadres claramente distintos', () => {
    const a = focusFor(izq, 16 / 9, PLANE_W, PLANE_H, 50)
    const b = focusFor(der, 16 / 9, PLANE_W, PLANE_H, 50)
    expect(b.x - a.x).toBeGreaterThan(2)
  })

  it('nunca enseña el borde de la foto (el encuadre cabe dentro del plano)', () => {
    for (const aspect of [16 / 9, 21 / 9, 4 / 3]) {
      const f = focusFor(der, aspect, PLANE_W, PLANE_H, 50)
      const h = 2 * f.z * Math.tan((25 * Math.PI) / 180)
      expect(Math.abs(f.x) + (h * aspect) / 2).toBeLessThanOrEqual(PLANE_W / 2 + 1e-6)
      expect(Math.abs(f.y) + h / 2).toBeLessThanOrEqual(PLANE_H / 2 + 1e-6)
    }
  })

  it('sin rótulo (parada sin anclaje) es la vista general centrada', () =>
    expect(focusFor(undefined, 16 / 9, PLANE_W, PLANE_H, 50)).toEqual({ x: 0, y: 0, z: base }))
})
