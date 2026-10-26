import type { StopId } from './stopIds'

export type SceneId = 'llegada' | 'escuela-taxis' | 'alquiler-gestoria' | 'facultad-taller' | 'plaza-buzon'

export interface Stop {
  id: StopId
  sceneId: SceneId
  /** 1 = lo último que se recorta si no da tiempo (spec, "Respuestas de Lorena"). */
  priority: number
  neon: string
  repo?: string
  report?: string
  enabled: boolean
}

// Orden de calle. Los textos viven en src/i18n; el lema y la cita están PENDIENTES DE APROBACIÓN DE LORENA.
export const STOPS: Stop[] = [
  { id: 'racetrack', sceneId: 'llegada', priority: 1, neon: '#2dd4bf', repo: 'https://github.com/Lorenadata/racetrack', enabled: true },
  {
    id: 'pobreza', sceneId: 'escuela-taxis', priority: 3, neon: '#a78bfa',
    repo: 'https://github.com/Lorenadata/pobreza_infantil_espana',
    report: 'https://lorenadata.github.io/pobreza_infantil_espana/', enabled: true,
  },
  {
    id: 'ridesharing', sceneId: 'escuela-taxis', priority: 4, neon: '#fb923c',
    repo: 'https://github.com/Lorenadata/ncr-ride-sharing-eda',
    report: 'https://lorenadata.github.io/ncr-ride-sharing-eda/', enabled: true,
  },
  {
    id: 'alquiler', sceneId: 'alquiler-gestoria', priority: 6, neon: '#60a5fa',
    repo: 'https://github.com/Lorenadata/ECV-rental-market',
    report: 'https://lorenadata.github.io/ECV-rental-market/', enabled: true,
  },
  { id: 'fiscalis', sceneId: 'alquiler-gestoria', priority: 7, neon: '#4ade80', repo: 'https://github.com/Lorenadata/fiscalis-db', enabled: true },
  { id: 'about', sceneId: 'facultad-taller', priority: 2, neon: '#f472b6', enabled: true },
  { id: 'making-of', sceneId: 'facultad-taller', priority: 5, neon: '#facc15', repo: 'https://github.com/Lorenadata/portfolio', enabled: true },
  { id: 'contact', sceneId: 'plaza-buzon', priority: 2, neon: '#f87171', enabled: true },
]

export function activeStops(stops: Stop[] = STOPS): Stop[] {
  return stops.filter((s) => s.enabled)
}

export const CONTACT = {
  email: 'lorena.loremarcos@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lorena-marcos-6516272b5/',
  github: 'https://github.com/Lorenadata',
  cv: '/cv/Lorena_Marcos_CV_EN.pdf',
}
