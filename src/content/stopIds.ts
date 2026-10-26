export const STOP_IDS = [
  'racetrack',
  'pobreza',
  'ridesharing',
  'alquiler',
  'fiscalis',
  'about',
  'making-of',
  'contact',
] as const

export type StopId = (typeof STOP_IDS)[number]
