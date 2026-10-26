import { describe, expect, it } from 'vitest'
import { walkReducer, swipeToAction, type WalkState } from './walk'

const idle = (index: number): WalkState => ({ index, phase: 'idle' })
const N = 8

describe('walkReducer', () => {
  it('next desde 0 avanza y pasa a moving', () =>
    expect(walkReducer(idle(0), { type: 'next' }, N)).toEqual({ index: 1, phase: 'moving' }))
  it('next mientras se mueve no hace nada', () => {
    const s: WalkState = { index: 1, phase: 'moving' }
    expect(walkReducer(s, { type: 'next' }, N)).toBe(s)
  })
  it('next en la última parada no hace nada', () => {
    const s = idle(N - 1)
    expect(walkReducer(s, { type: 'next' }, N)).toBe(s)
  })
  it('prev en la primera parada no hace nada', () => {
    const s = idle(0)
    expect(walkReducer(s, { type: 'prev' }, N)).toBe(s)
  })
  it('prev retrocede', () => expect(walkReducer(idle(3), { type: 'prev' }, N)).toEqual({ index: 2, phase: 'moving' }))
  it('goto fuera de rango no hace nada', () => {
    const s = idle(2)
    expect(walkReducer(s, { type: 'goto', index: 99 }, N)).toBe(s)
    expect(walkReducer(s, { type: 'goto', index: -1 }, N)).toBe(s)
  })
  it('goto a la misma parada no hace nada', () => {
    const s = idle(2)
    expect(walkReducer(s, { type: 'goto', index: 2 }, N)).toBe(s)
  })
  it('goto válido viaja aunque se esté moviendo', () =>
    expect(walkReducer({ index: 1, phase: 'moving' }, { type: 'goto', index: 5 }, N)).toEqual({ index: 5, phase: 'moving' }))
  it('arrived pasa a idle', () =>
    expect(walkReducer({ index: 4, phase: 'moving' }, { type: 'arrived' }, N)).toEqual(idle(4)))
})

describe('swipeToAction', () => {
  it('deslizar hacia arriba avanza', () => expect(swipeToAction(0, -60)).toBe('next'))
  it('deslizar hacia abajo retrocede', () => expect(swipeToAction(5, 70)).toBe('prev'))
  it('movimiento corto no cuenta', () => expect(swipeToAction(0, 20)).toBeNull())
  it('horizontal dominante no cuenta', () => expect(swipeToAction(80, 10)).toBeNull())
})
