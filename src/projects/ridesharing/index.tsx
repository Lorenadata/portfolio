import { lazy, Suspense, useState } from 'react'
import { useI18n } from '../../i18n'
import { canRender3D, currentEnv, detectQuality, type Quality } from '../../lib/capabilities'
import { formatInt } from '../../lib/format'
import limpieza from '../../../public/data/limpieza.json'
import lof from '../../../public/data/lof.json'
import { Prediccion } from './Prediccion'
import '../projects.css'
import '../fiscalis/fiscalis.css'
import '../racetrack/racetrack.css'
import './ridesharing.css'

const LofCloud3D = lazy(() => import('./LofCloud3D'))
const PASOS = limpieza.pasos.filter((p) => p.id !== 'original')
const TOTAL = limpieza.pasos[0].filas

export interface LofPoint {
  x: number
  y: number
  z: number
  outlier: boolean
}

function LofCloud2D() {
  const { t } = useI18n()
  const pts = lof as LofPoint[]
  const ext = Math.max(...pts.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))))
  const s = (v: number) => 50 + (v / ext) * 46
  return (
    <figure className="rs-cloud">
      <svg viewBox="0 0 100 100" data-testid="lof-2d" role="img" aria-label={t('rs.cloud2d')}>
        {pts.filter((p) => !p.outlier).map((p, i) => <circle key={i} cx={s(p.x)} cy={s(-p.y)} r={0.55} className="rs-dot" />)}
        {pts.filter((p) => p.outlier).map((p, i) => <circle key={`o${i}`} cx={s(p.x)} cy={s(-p.y)} r={1.8} className="rs-out" />)}
      </svg>
      <figcaption>{t('rs.cloud2d')} <span className="rs-legend">● {t('rs.outlier')}</span></figcaption>
    </figure>
  )
}

export default function Project({ quality }: { quality?: Quality }) {
  const { t } = useI18n()
  const locale = t('fmt.locale')
  // Sin WebGL o con movimiento reducido, la nube LOF se dibuja en 2D.
  const [q] = useState<Quality>(() => {
    if (quality) return quality
    const env = currentEnv()
    return canRender3D(env) ? detectQuality(env) : 'low'
  })
  const [on, setOn] = useState(0) // cuántos pasos están activos, en orden

  return (
    <div className="proj">
      <p className="proj__lead">{t('rs.intro')}</p>
      <div className="stats">
        <div className="stat stat--hot"><strong data-testid="rows-kept">{formatInt(TOTAL, locale)}</strong><span>{t('rs.kept')}</span></div>
      </div>

      <div className="proj__split">
        <ol className="rs-steps">
          {PASOS.map((p, i) => {
            const active = i < on
            return (
              <li key={p.id} className={active ? 'is-on' : undefined}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  disabled={i > on}
                  onClick={() => setOn(active ? i : i + 1)}
                >
                  <span className="rs-toggle" aria-hidden />
                  {t(`rs.step.${p.id}`)}
                </button>
                {active && (
                  <div className="rs-detail">
                    <strong data-testid={`flag-${p.id}`}>{formatInt(p.marcadas, locale)}</strong> {t('rs.flagged')}
                    <p>{t(`rs.step.${p.id}.why`)}</p>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
        <div className="proj__result">
          {q === 'high' ? (
            <Suspense fallback={<LofCloud2D />}>
              <LofCloud3D points={lof as LofPoint[]} caption={t('rs.cloud')} />
            </Suspense>
          ) : (
            <LofCloud2D />
          )}
        </div>
      </div>
      <Prediccion />
    </div>
  )
}
