import { lazy, Suspense, useCallback, useReducer } from 'react'
import { activeStops } from './content/stops'
import { useI18n } from './i18n'
import { currentEnv, detectQuality } from './lib/capabilities'
import { walkReducer, type WalkAction, type WalkState } from './world/walk'
import { useWalkInput } from './world/useWalkInput'

const StreetCanvas = lazy(() => import('./world/StreetCanvas'))
const stops = activeStops()
const env = currentEnv()
const forced = new URLSearchParams(window.location.search).get('q')
const quality = forced === 'low' || forced === 'high' ? forced : detectQuality(env)

export default function App() {
  const { t } = useI18n()
  const [walk, dispatchRaw] = useReducer(
    (s: WalkState, a: WalkAction) => walkReducer(s, a, stops.length),
    { index: 0, phase: 'idle' },
  )
  const dispatch = useCallback((a: WalkAction) => dispatchRaw(a), [])
  useWalkInput(dispatch, true)
  return (
    <Suspense fallback={null}>
      <StreetCanvas
        walk={walk}
        stops={stops}
        quality={quality}
        signText={(id) => t(`sign.${id}`)}
        onArrived={() => dispatch({ type: 'arrived' })}
        onContextLost={() => (window.location.hash = '#/recruiter')}
      />
    </Suspense>
  )
}
