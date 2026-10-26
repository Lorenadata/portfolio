export interface WalkState {
  index: number
  phase: 'idle' | 'moving'
}

export type WalkAction = { type: 'next' } | { type: 'prev' } | { type: 'goto'; index: number } | { type: 'arrived' }

export function walkReducer(s: WalkState, a: WalkAction, count: number): WalkState {
  switch (a.type) {
    case 'arrived':
      return s.phase === 'idle' ? s : { index: s.index, phase: 'idle' }
    case 'goto':
      if (a.index < 0 || a.index >= count || a.index === s.index) return s
      return { index: a.index, phase: 'moving' }
    case 'next':
    case 'prev': {
      if (s.phase === 'moving') return s
      const index = s.index + (a.type === 'next' ? 1 : -1)
      if (index < 0 || index >= count) return s
      return { index, phase: 'moving' }
    }
  }
}

const SWIPE_MIN = 40

export function swipeToAction(dx: number, dy: number): 'next' | 'prev' | null {
  if (Math.abs(dy) < SWIPE_MIN || Math.abs(dy) <= Math.abs(dx)) return null
  return dy < 0 ? 'next' : 'prev'
}
