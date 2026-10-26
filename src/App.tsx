import { lazy, Suspense, useCallback, useMemo, useReducer, useState } from 'react'
import { activeStops } from './content/stops'
import { useI18n } from './i18n'
import { canRender3D, currentEnv, detectQuality, type Quality } from './lib/capabilities'
import { useRoute } from './lib/route'
import { RecruiterMode } from './recruiter/RecruiterMode'
import { Brand, Loader, Minimap, ProjectCard, Quote, TopBar, WalkControl } from './ui/components'
import './ui/ui.css'
import { walkReducer, type WalkAction, type WalkState } from './world/walk'
import { useWalkInput } from './world/useWalkInput'

const StreetCanvas = lazy(() => import('./world/StreetCanvas'))

// Solo en desarrollo: ?static pinta la escena como imagen para revisar la interfaz sin WebGL.
const STATIC_PREVIEW = import.meta.env.DEV && new URLSearchParams(window.location.search).has('static')

export interface AppProps {
  /** Para tests: fuerza el entorno en vez de detectarlo. */
  env?: { webgl: boolean; reducedMotion: boolean }
}

function initialQuality(): Quality {
  const forced = new URLSearchParams(window.location.search).get('q')
  return forced === 'low' || forced === 'high' ? forced : detectQuality(currentEnv())
}

export default function App({ env }: AppProps) {
  const { t } = useI18n()
  const stops = useMemo(() => activeStops(), [])
  const ids = useMemo(() => stops.map((s) => s.id), [stops])
  const [route, go] = useRoute(ids)
  const [quality] = useState(initialQuality)
  const [can3D] = useState(() => canRender3D(env ?? currentEnv()))
  const [ready, setReady] = useState(STATIC_PREVIEW)
  const [progress, setProgress] = useState(0)

  const [walk, dispatchRaw] = useReducer(
    (s: WalkState, a: WalkAction) => walkReducer(s, a, stops.length),
    { index: 0, phase: 'idle' },
  )
  const dispatch = useCallback((a: WalkAction) => dispatchRaw(a), [])
  const onStreet = route.view === 'street'
  useWalkInput(dispatch, can3D && onStreet && ready)
  if (STATIC_PREVIEW && walk.phase === 'moving') queueMicrotask(() => dispatch({ type: 'arrived' }))

  const stop = stops[walk.index]
  const onReady = useCallback(() => setReady(true), [])
  const toRecruiter = useCallback(() => go({ view: 'recruiter' }), [go])

  if (!can3D || route.view === 'recruiter') {
    return <RecruiterMode stops={stops} canWalk={can3D} />
  }

  return (
    <>
      <div className={route.view === 'project' ? 'street-blurred' : undefined}>
        {STATIC_PREVIEW ? (
          <img src={`/scenes/${stop.sceneId}/color.webp`} alt="" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
        <Suspense fallback={null}>
          <StreetCanvas
            walk={walk}
            stops={stops}
            quality={quality}
            signText={(id) => t(`sign.${id}`)}
            onArrived={() => dispatch({ type: 'arrived' })}
            onContextLost={toRecruiter}
            onReady={onReady}
            onProgress={setProgress}
          />
        </Suspense>
        )}
      </div>

      {!ready && <Loader progress={progress} onSkip={toRecruiter} />}

      {ready && onStreet && (
        <div className="hud">
          <Brand />
          <TopBar />
          {walk.phase === 'idle' && (
            <ProjectCard key={stop.id} stop={stop} onEnter={() => go({ view: 'project', id: stop.id })} />
          )}
          <Minimap stops={stops} current={walk.index} onGo={(i) => dispatch({ type: 'goto', index: i })} />
          <WalkControl
            onNext={() => dispatch({ type: 'next' })}
            onPrev={() => dispatch({ type: 'prev' })}
            canPrev={walk.index > 0}
            canNext={walk.index < stops.length - 1}
          />
          <Quote />
        </div>
      )}
    </>
  )
}
