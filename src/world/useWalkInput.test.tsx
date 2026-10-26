import { afterEach, expect, it, vi } from 'vitest'
import { renderHook, fireEvent, cleanup } from '@testing-library/react'
import { useWalkInput } from './useWalkInput'

afterEach(cleanup)

it('flecha derecha y W avanzan, flecha izquierda y S retroceden', () => {
  const dispatch = vi.fn()
  renderHook(() => useWalkInput(dispatch, true))
  fireEvent.keyDown(window, { key: 'ArrowRight' })
  fireEvent.keyDown(window, { key: 'w' })
  fireEvent.keyDown(window, { key: 'ArrowLeft' })
  fireEvent.keyDown(window, { key: 's' })
  expect(dispatch.mock.calls.map((c) => c[0].type)).toEqual(['next', 'next', 'prev', 'prev'])
})

it('no reacciona cuando se escribe en un campo de texto', () => {
  const dispatch = vi.fn()
  renderHook(() => useWalkInput(dispatch, true))
  const input = document.createElement('input')
  document.body.appendChild(input)
  fireEvent.keyDown(input, { key: 'ArrowRight' })
  expect(dispatch).not.toHaveBeenCalled()
  input.remove()
})

it('no reacciona si está desactivado (capa de proyecto abierta)', () => {
  const dispatch = vi.fn()
  renderHook(() => useWalkInput(dispatch, false))
  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(dispatch).not.toHaveBeenCalled()
})

it('un toque que empieza en un botón no es un gesto', () => {
  const dispatch = vi.fn()
  renderHook(() => useWalkInput(dispatch, true))
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  fireEvent.touchStart(btn, { touches: [{ clientX: 0, clientY: 200 }] })
  fireEvent.touchEnd(btn, { changedTouches: [{ clientX: 0, clientY: 100 }] })
  expect(dispatch).not.toHaveBeenCalled()
  btn.remove()
})

it('deslizar hacia arriba en la escena avanza', () => {
  const dispatch = vi.fn()
  renderHook(() => useWalkInput(dispatch, true))
  fireEvent.touchStart(document.body, { touches: [{ clientX: 0, clientY: 300 }] })
  fireEvent.touchEnd(document.body, { changedTouches: [{ clientX: 0, clientY: 200 }] })
  expect(dispatch).toHaveBeenCalledWith({ type: 'next' })
})
