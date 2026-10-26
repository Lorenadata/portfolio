import type { SceneId } from '../content/stops'
import type { SignAnchor } from './geometry'

export type { SignAnchor }

export interface SceneDef {
  id: SceneId
  signs: SignAnchor[]
  /** Cuánto "sale" la imagen hacia la cámara según su mapa de profundidad (unidades del mundo). */
  depthScale: number
}

// Anclajes provisionales sobre las imágenes de prueba (recortes de version1.png).
// Se reajustan sobre las fachadas reales cuando lleguen las imágenes definitivas (Tarea 17).
export const SCENES: SceneDef[] = [
  { id: 'llegada', depthScale: 1.4, signs: [{ stopId: 'racetrack', u: 0.79, v: 0.2, width: 2.6, rotY: -0.35 }] },
  {
    id: 'escuela-taxis',
    depthScale: 1.4,
    signs: [
      { stopId: 'pobreza', u: 0.3, v: 0.3, width: 2.2, rotY: 0.3 },
      { stopId: 'ridesharing', u: 0.72, v: 0.28, width: 2.2, rotY: -0.3 },
    ],
  },
  {
    id: 'alquiler-gestoria',
    depthScale: 1.4,
    signs: [
      { stopId: 'alquiler', u: 0.25, v: 0.32, width: 2.2, rotY: 0.3 },
      { stopId: 'fiscalis', u: 0.72, v: 0.3, width: 2, rotY: -0.3 },
    ],
  },
  {
    id: 'facultad-taller',
    depthScale: 1.4,
    signs: [
      { stopId: 'about', u: 0.28, v: 0.28, width: 2, rotY: 0.3 },
      { stopId: 'making-of', u: 0.72, v: 0.3, width: 2, rotY: -0.3 },
    ],
  },
  { id: 'plaza-buzon', depthScale: 1.4, signs: [{ stopId: 'contact', u: 0.55, v: 0.45, width: 1.8, rotY: 0 }] },
]

export const sceneById = (id: SceneId) => SCENES.find((s) => s.id === id)!

export const sceneUrls = (id: SceneId, mobile: boolean) => ({
  color: `/scenes/${id}/${mobile ? 'color-m' : 'color'}.webp`,
  depth: `/scenes/${id}/depth.png`,
})
