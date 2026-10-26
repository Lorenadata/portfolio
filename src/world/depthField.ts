import type * as THREE from 'three'

/** Mapa de profundidad en escala de grises (blanco = cerca), leído una sola vez desde la imagen. */
export interface DepthField {
  width: number
  height: number
  /** Un byte por píxel. */
  data: Uint8ClampedArray
}

export function readDepthField(image: HTMLImageElement): DepthField | null {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  if (!ctx || !image.width) return null
  ctx.drawImage(image, 0, 0)
  const rgba = ctx.getImageData(0, 0, image.width, image.height).data
  const data = new Uint8ClampedArray(image.width * image.height)
  for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4]
  return { width: image.width, height: image.height, data }
}

/** Profundidad de 0 (lejos) a 1 (cerca) en u, v de 0 a 1 (v hacia abajo). */
export function sampleField(f: DepthField, u: number, v: number): number {
  const x = Math.min(f.width - 1, Math.max(0, Math.round(u * (f.width - 1))))
  const y = Math.min(f.height - 1, Math.max(0, Math.round(v * (f.height - 1))))
  return f.data[y * f.width + x] / 255
}

/**
 * Despega el plano hacia la cámara según la profundidad.
 * uRange = [inicio, ancho] en u: [0, 1] en escritorio, [0.22, 0.56] con el recorte móvil.
 */
export function displacePlane(g: THREE.PlaneGeometry, f: DepthField, scale: number, uRange: [number, number]) {
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    const u = uRange[0] + uv.getX(i) * uRange[1]
    const v = 1 - uv.getY(i)
    pos.setZ(i, sampleField(f, u, v) * scale)
  }
  pos.needsUpdate = true
  g.computeBoundingSphere()
}
