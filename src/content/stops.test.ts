import { expect, it } from 'vitest'
import { STOPS, activeStops } from './stops'
import { STOP_IDS } from './stopIds'

it('hay una parada por cada id', () => expect(STOPS.map((s) => s.id).sort()).toEqual([...STOP_IDS].sort()))
it('racetrack está en la escena de llegada y es prioridad 1', () => {
  const r = STOPS.find((s) => s.id === 'racetrack')!
  expect(r.sceneId).toBe('llegada')
  expect(r.priority).toBe(1)
})
it('activeStops excluye las desactivadas y mantiene el orden de calle', () => {
  const custom = STOPS.map((s) => (s.id === 'alquiler' ? { ...s, enabled: false } : s))
  const ids = activeStops(custom).map((s) => s.id)
  expect(ids).not.toContain('alquiler')
  expect(ids).toEqual(STOPS.map((s) => s.id).filter((i) => i !== 'alquiler'))
})
it('el orden de calle sigue las escenas', () =>
  expect(STOPS.map((s) => s.id)).toEqual([
    'racetrack', 'pobreza', 'ridesharing', 'alquiler', 'fiscalis', 'about', 'making-of', 'contact',
  ]))
it('los proyectos de datos enlazan repo e informe', () => {
  const p = STOPS.find((s) => s.id === 'pobreza')!
  expect(p.repo).toBe('https://github.com/Lorenadata/pobreza_infantil_espana')
  expect(p.report).toBe('https://lorenadata.github.io/pobreza_infantil_espana/')
})
