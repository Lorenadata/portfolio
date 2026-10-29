import { lazy, Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { activeStops } from './content/stops'
import { useI18n } from './i18n'
import { canRender3D, currentEnv, detectQuality, type Quality } from './lib/capabilities'
import { useRoute } from './lib/route'
import { ProjectOverlay } from './overlay/ProjectOverlay'
import { RecruiterMode } from './recruiter/RecruiterMode'
import { Brand, Loader, Minimap, ProjectCard, Quote, TopBar, WalkControl } from './ui/components'
import { ErrorBoundary } from './ui/ErrorBoundary'
import './ui/ui.css'
import { walkReducer, type WalkAction, type WalkState } from './world/walk'
import { useWalkInput } from './world/useWalkInput'

const StreetCanvas = lazy(() => import('./world/StreetCanvas'))

// Solo en desarrollo: ?static pinta la escena como imagen para revisar la interfaz sin WebGL.
const STATIC_PREVIEW = import.meta.env.DEV && new URLSearchParams(window.location.search).has('static')

// React 18 no tipa `inert`; se pasa como atributo HTML para que la calle no reciba foco con un proyecto abierto.
const INERT = { inert: '', 'aria-hidden': true } as Record<string, unknown>

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
  // Si la calle 3D falla al cargar (imagen o código que no llega, WebGL que no arranca), se sigue sin ella.
  const [streetFailed, setStreetFailed] = useState(false)
  const [ready, setReady] = useState(STATIC_PREVIEW)
  const [progress, setProgress] = useState(0)
  // Botón que abrió el proyecto, recordado al pulsar: al volver inerte la interfaz el navegador puede quitarle el foco.
  const opener = useRef<HTMLElement | null>(null)

  const [walk, dispatchRaw] = useReducer(
    (s: WalkState, a: WalkAction) => walkReducer(s, a, stops.length),
    undefined,
    (): WalkState => {
      // Con un enlace directo a un proyecto, la calle empieza en su parada.
      const i = route.view === 'project' ? stops.findIndex((s) => s.id === route.id) : 0
      return { index: Math.max(0, i), phase: 'idle' }
    },
  )
  const dispatch = useCallback((a: WalkAction) => dispatchRaw(a), [])
  const street = can3D && !streetFailed
  const onStreet = route.view === 'street'
  useWalkInput(dispatch, street && onStreet && ready)
  if (STATIC_PREVIEW && walk.phase === 'moving') queueMicrotask(() => dispatch({ type: 'arrived' }))

  const stop = stops[walk.index]
  const onReady = useCallback(() => setReady(true), [])
  const toRecruiter = useCallback(() => go({ view: 'recruiter' }), [go])
  const closeProject = useCallback(() => go({ view: street ? 'street' : 'recruiter' }), [go, street])
  const onStreetError = useCallback(() => {
    setStreetFailed(true)
    toRecruiter()
  }, [toRecruiter])

  useEffect(() => {
    if (route.view !== 'project') opener.current = null
  }, [route.view])

  const overlay = route.view === 'project' && (
    <ProjectOverlay id={route.id} onClose={closeProject} returnFocus={opener.current} />
  )

  if (!street || route.view === 'recruiter') {
    return (
      <>
        <div {...(route.view === 'project' ? INERT : {})}>
          <RecruiterMode stops={stops} canWalk={street} />
        </div>
        {overlay}
      </>
    )
  }

  return (
    <>
      {STATIC_PREVIEW ? (
        <img src={`/scenes/${stop.sceneId}/color.webp`} alt="" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <ErrorBoundary fallback={null} onError={onStreetError}>
          <Suspense fallback={null}>
            <StreetCanvas
              walk={walk}
              stops={stops}
              quality={quality}
              signText={(id) => t(`sign.${id}`)}
              onArrived={() => dispatch({ type: 'arrived' })}
              onContextLost={onStreetError}
              onReady={onReady}
              onProgress={setProgress}
              paused={route.view === 'project'}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {!ready && <Loader progress={progress} onSkip={toRecruiter} />}

      {ready && (
        <div className="hud street-hud" {...(onStreet ? {} : INERT)}>
          <Brand />
          <TopBar />
          {walk.phase === 'idle' && (
            <ProjectCard
              key={stop.id}
              stop={stop}
              onEnter={() => {
                opener.current = document.activeElement as HTMLElement | null
                go({ view: 'project', id: stop.id })
              }}
            />
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

      {overlay}
    </>
  )
}
