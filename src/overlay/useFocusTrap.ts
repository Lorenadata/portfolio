import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Mantiene el foco dentro del contenedor, cierra con Escape y devuelve el foco a quien lo tenía al abrir. */
export function useFocusTrap(ref: RefObject<HTMLElement>, onEscape: () => void) {
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      const root = ref.current
      if (!root) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onEscape()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const inside = root.contains(active)
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [ref, onEscape])
}
