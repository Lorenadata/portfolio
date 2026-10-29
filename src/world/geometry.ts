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

/** Cuánto se acerca la cámara al escaparate de la parada respecto a la vista general. */
export const FOCUS_ZOOM = 0.72
/** Margen para el paralaje del ratón (la cámara se asoma ±0,45 en x y ±0,25 en y). */
const PARALLAX_MARGIN = { x: 0.5, y: 0.3 }

/**
 * Encuadre de la cámara para una parada: se acerca a su rótulo y se desplaza hacia él,
 * sin enseñar nunca el borde de la foto. Sin rótulo, vista general centrada.
 */
export function focusFor(
  anchor: SignAnchor | undefined,
  aspect: number,
  planeW: number,
  planeH: number,
  fovDeg: number,
): { x: number; y: number; z: number } {
  const base = coverDistance(aspect, planeW, planeH, fovDeg) * 0.9
  if (!anchor) return { x: 0, y: 0, z: base }
  const z = base * FOCUS_ZOOM
  const h = 2 * z * Math.tan((fovDeg * Math.PI) / 360)
  const w = h * aspect
  const clamp = (v: number, lim: number) => Math.max(-lim, Math.min(lim, v))
  const x = clamp((anchor.u - 0.5) * PLANE_W, Math.max(0, planeW / 2 - w / 2 - PARALLAX_MARGIN.x))
  // El rótulo suele estar alto: se sube la mitad para que el escaparate siga dentro del encuadre.
  const y = clamp((0.5 - anchor.v) * PLANE_H * 0.5, Math.max(0, planeH / 2 - h / 2 - PARALLAX_MARGIN.y))
  return { x, y, z }
}
