export const TRANSITION_S = 1.6

/** Avanza la transición entre escenas; si la escena de destino aún no ha cargado, espera sin borrar la actual. */
export function stepTransition(t: number, dt: number, incReady: boolean): number {
  if (!incReady) return t
  return Math.min(1, t + dt / TRANSITION_S)
}
