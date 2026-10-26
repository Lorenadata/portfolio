import type { StopId } from '../content/stopIds'

/** Tamaño del plano de cada escena en unidades del mundo (16:9). */
export const PLANE_W = 16
export const PLANE_H = 9

export interface SignAnchor {
  stopId: StopId
  /** Posición del rótulo sobre la imagen, de 0 a 1 (u: izquierda→derecha, v: arriba→abajo). */
  u: number
  v: number
  /** Ancho del rótulo en unidades del mundo. */
  width: number
  /** Giro para que el rótulo siga la fachada (radianes). */
  rotY: number
}

export function anchorToWorld(
  a: SignAnchor,
  depthAt: (u: number, v: number) => number,
  scale: number,
): [number, number, number] {
  return [(a.u - 0.5) * PLANE_W, (0.5 - a.v) * PLANE_H, depthAt(a.u, a.v) * scale]
}

/** Distancia de cámara para que el plano cubra toda la pantalla (como object-fit: cover). */
export function coverDistance(aspect: number, planeW: number, planeH: number, fovDeg: number): number {
  const visibleH = Math.min(planeH, planeW / aspect)
  return visibleH / (2 * Math.tan((fovDeg * Math.PI) / 360))
}
