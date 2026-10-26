import { lazy, Suspense, useEffect, useRef, type ComponentType, type LazyExoticComponent } from 'react'
import { STOPS } from '../content/stops'
import type { StopId } from '../content/stopIds'
import { useI18n } from '../i18n'
import { useFocusTrap } from './useFocusTrap'
import './overlay.css'

const PROJECTS: Record<StopId, LazyExoticComponent<ComponentType>> = {
  racetrack: lazy(() => import('../projects/racetrack')),
  pobreza: lazy(() => import('../projects/pobreza')),
  ridesharing: lazy(() => import('../projects/ridesharing')),
  alquiler: lazy(() => import('../projects/alquiler')),
  fiscalis: lazy(() => import('../projects/fiscalis')),
  about: lazy(() => import('../projects/about')),
  'making-of': lazy(() => import('../projects/making-of')),
  contact: lazy(() => import('../projects/contact')),
}

export function ProjectOverlay({ id, onClose }: { id: StopId; onClose(): void }) {
  const { t } = useI18n()
  const root = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  useFocusTrap(root, onClose)
  useEffect(() => title.current?.focus(), [id])

  const stop = STOPS.find((s) => s.id === id)!
  const Project = PROJECTS[id]
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="overlay-title" ref={root} style={{ ['--neon' as string]: stop.neon }}>
      <div className="overlay__bg" aria-hidden />
      <div className="overlay__panel">
        <header className="overlay__header">
          <div>
            <p className="overlay__eyebrow">{t(`sign.${id}`)}</p>
            <h2 id="overlay-title" className="overlay__title" tabIndex={-1} ref={title}>
              {t(`name.${id}`)}
            </h2>
          </div>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            ← {t('overlay.close')}
          </button>
        </header>
        <div className="overlay__body">
          <Suspense fallback={<p className="overlay__loading">…</p>}>
            <Project />
          </Suspense>
        </div>
        {(stop.repo || stop.report) && (
          <footer className="overlay__footer">
            {stop.repo && <a href={stop.repo} target="_blank" rel="noreferrer">{t('card.github')}</a>}
            {stop.report && <a href={stop.report} target="_blank" rel="noreferrer">{t('card.report')}</a>}
          </footer>
        )}
      </div>
    </div>
  )
}
