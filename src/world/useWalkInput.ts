import { useEffect } from 'react'
import { swipeToAction, type WalkAction } from './walk'

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowUp', 'w', 'W', 'd', 'D'])
const PREV_KEYS = new Set(['ArrowLeft', 'ArrowDown', 's', 'S', 'a', 'A'])
const WHEEL_DEBOUNCE_MS = 600

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

function isControl(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest('button, a, input, select, textarea, [role="dialog"]')
}

export function useWalkInput(dispatch: (a: WalkAction) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    let lastWheel = 0
    let touchStart: { x: number; y: number } | null = null

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return
      if (NEXT_KEYS.has(e.key)) dispatch({ type: 'next' })
      else if (PREV_KEYS.has(e.key)) dispatch({ type: 'prev' })
    }
    const onWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastWheel < WHEEL_DEBOUNCE_MS || Math.abs(e.deltaY) < 10) return
      lastWheel = now
      dispatch({ type: e.deltaY > 0 ? 'next' : 'prev' })
    }
    const onTouchStart = (e: TouchEvent) => {
      touchStart = isControl(e.target) ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return
      const t = e.changedTouches[0]
      const action = swipeToAction(t.clientX - touchStart.x, t.clientY - touchStart.y)
      touchStart = null
      if (action) dispatch({ type: action })
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [dispatch, enabled])
}
