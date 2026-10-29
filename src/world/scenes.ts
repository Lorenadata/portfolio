import type { SceneId } from '../content/stops'
import type { SignAnchor } from './geometry'

export type { SignAnchor }

export interface SceneDef {
  id: SceneId
  signs: SignAnchor[]
  /** Cuánto "sale" la imagen hacia la cámara según su mapa de profundidad (unidades del mundo). */
  depthScale: number
}

// Anclajes sobre los paneles en blanco de las imágenes definitivas (comprobados superponiéndolos a cada foto).
// En móvil solo se ve la franja central (u entre 0,22 y 0,78); los rótulos fuera de ella no aparecen, la tarjeta sí.
export const SCENES: SceneDef[] = [
  { id: 'llegada', depthScale: 1.4, signs: [{ stopId: 'racetrack', u: 0.785, v: 0.215, width: 2.4, rotY: -0.35 }] },
  {
    id: 'escuela-taxis',
    depthScale: 1.4,
    signs: [
      { stopId: 'pobreza', u: 0.3, v: 0.37, width: 1.6, rotY: 0.35 },
      { stopId: 'ridesharing', u: 0.86, v: 0.335, width: 1.8, rotY: -0.35 },
    ],
  },
  {
    id: 'alquiler-gestoria',
    depthScale: 1.4,
    signs: [
      { stopId: 'alquiler', u: 0.13, v: 0.16, width: 2.6, rotY: 0.35 },
      { stopId: 'fiscalis', u: 0.845, v: 0.205, width: 1.4, rotY: -0.35 },
    ],
  },
  {
    id: 'facultad-taller',
    depthScale: 1.4,
    signs: [
      { stopId: 'about', u: 0.165, v: 0.33, width: 0.9, rotY: 0.35 },
      { stopId: 'making-of', u: 0.79, v: 0.33, width: 2.2, rotY: -0.35 },
    ],
  },
  { id: 'plaza-buzon', depthScale: 1.4, signs: [{ stopId: 'contact', u: 0.83, v: 0.15, width: 1.2, rotY: -0.2 }] },
]

export const sceneById = (id: SceneId) => SCENES.find((s) => s.id === id)!

export const sceneUrls = (id: SceneId, mobile: boolean) => ({
  color: `/scenes/${id}/${mobile ? 'color-m' : 'color'}.webp`,
  depth: `/scenes/${id}/depth.png`,
})
