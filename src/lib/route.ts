import { useCallback, useEffect, useState } from 'react'
import type { StopId } from '../content/stopIds'

export type Route = { view: 'street' } | { view: 'recruiter' } | { view: 'project'; id: StopId }

export function parseRoute(hash: string, enabled: readonly StopId[]): Route {
  if (hash === '#/recruiter') return { view: 'recruiter' }
  const m = /^#\/p\/([a-z-]+)$/.exec(hash)
  if (m && (enabled as readonly string[]).includes(m[1])) return { view: 'project', id: m[1] as StopId }
  return { view: 'street' }
}

export function toHash(r: Route): string {
  if (r.view === 'recruiter') return '#/recruiter'
  if (r.view === 'project') return `#/p/${r.id}`
  return '#/'
}

export function useRoute(enabled: readonly StopId[]): [Route, (r: Route) => void] {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash, enabled))
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash, enabled))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [enabled])
  const go = useCallback((r: Route) => {
    window.location.hash = toHash(r)
  }, [])
  return [route, go]
}
