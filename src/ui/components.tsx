import { useEffect, useState } from 'react'
import type { Stop } from '../content/stops'
import { CONTACT } from '../content/stops'
import { useI18n } from '../i18n'

export function Brand() {
  const { t } = useI18n()
  return (
    <header className="brand">
      <h1 className="brand__name">{t('brand.name')}</h1>
      <p className="brand__subtitle">{t('brand.subtitle')}</p>
      <div className="brand__rule" />
      <p className="brand__motto">{t('brand.motto')}</p>
      <p className="brand__intro">{t('brand.intro')}</p>
    </header>
  )
}

export function TopBar() {
  const { t, lang, setLang } = useI18n()
  return (
    <nav className="topbar" aria-label="Main">
      <a className="topbar__link" href="#/recruiter">{t('nav.projects')}</a>
      <a className="topbar__link" href={CONTACT.cv} target="_blank" rel="noreferrer">{t('nav.cv')}</a>
      <a className="topbar__link" href={CONTACT.github} target="_blank" rel="noreferrer">{t('nav.github')}</a>
      <a className="topbar__link" href={CONTACT.linkedin} target="_blank" rel="noreferrer">{t('nav.linkedin')}</a>
      <button className="topbar__lang" type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
        {t('nav.lang')}
      </button>
      <a className="topbar__recruiter" href="#/recruiter">
        {t('nav.recruiter')} <span className="dot" aria-hidden />
      </a>
    </nav>
  )
}

export function ProjectCard({ stop, onEnter }: { stop: Stop; onEnter(): void }) {
  const { t } = useI18n()
  return (
    <section className="card" style={{ ['--neon' as string]: stop.neon }} aria-live="polite">
      <p className="card__eyebrow">{stop.priority === 1 ? t('card.featured') : t(`sign.${stop.id}`)}</p>
      <h2 className="card__title">{t(`name.${stop.id}`)}</h2>
      <p className="card__tagline">{t(`tagline.${stop.id}`)}</p>
      <p className="card__result">{t(`result.${stop.id}`)}</p>
      <div className="card__actions">
        <button type="button" className="btn btn--primary" onClick={onEnter}>
          {t('card.enter')} <span aria-hidden>→</span>
        </button>
        {stop.repo && (
          <a className="btn btn--ghost" href={stop.repo} target="_blank" rel="noreferrer">
            {t('card.github')}
          </a>
        )}
        {stop.report && (
          <a className="btn btn--ghost" href={stop.report} target="_blank" rel="noreferrer">
            {t('card.report')}
          </a>
        )}
      </div>
    </section>
  )
}

export function Minimap({ stops, current, onGo }: { stops: Stop[]; current: number; onGo(i: number): void }) {
  const { t } = useI18n()
  // Las paradas se reparten por una calle en diagonal dentro del círculo.
  const pos = (i: number) => {
    const k = stops.length > 1 ? i / (stops.length - 1) : 0.5
    return { x: 22 + k * 56, y: 72 - k * 44 }
  }
  return (
    <aside className="minimap" aria-label={t('minimap.label')}>
      <svg className="minimap__map" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="48" />
        <path d="M14 80 L86 20" className="minimap__street" />
        <path d="M30 10 L30 90 M60 8 L60 92 M8 45 L92 45 M10 64 L90 64" className="minimap__grid" />
        {stops.map((s, i) => {
          const p = pos(i)
          return <circle key={s.id} cx={p.x} cy={p.y} r={i === current ? 4 : 2.6} fill={s.neon} className={i === current ? 'is-current' : ''} />
        })}
      </svg>
      <ul className="minimap__legend">
        {stops.map((s, i) => (
          <li key={s.id}>
            <button type="button" onClick={() => onGo(i)} aria-current={i === current ? 'location' : undefined}>
              <span className="swatch" style={{ background: s.neon }} aria-hidden />
              {t(`name.${s.id}`)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function WalkControl({ onNext, onPrev, canPrev, canNext }: { onNext(): void; onPrev(): void; canPrev: boolean; canNext: boolean }) {
  const { t } = useI18n()
  return (
    <div className="walk">
      <div className="walk__pad">
        <button type="button" onClick={onPrev} disabled={!canPrev} aria-label={t('walk.prev')}>‹</button>
        <button type="button" onClick={onNext} disabled={!canNext} aria-label={t('walk.next')} className="walk__go">⌃</button>
        <span aria-hidden />
      </div>
      <p className="walk__hint">{t('walk.hint')}</p>
    </div>
  )
}

export function Quote() {
  const { t } = useI18n()
  return (
    <figure className="quote">
      <blockquote>“{t('quote.text')}”</blockquote>
      <figcaption>— {t('brand.name')}</figcaption>
    </figure>
  )
}

export function Loader({ progress, onSkip, skipAfterMs = 6000 }: { progress: number; onSkip(): void; skipAfterMs?: number }) {
  const { t } = useI18n()
  const [canSkip, setCanSkip] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setCanSkip(true), skipAfterMs)
    return () => window.clearTimeout(id)
  }, [skipAfterMs])
  return (
    <div className="loader" role="status">
      <p className="loader__name">{t('brand.name')}</p>
      <p className="loader__title">{t('loader.title')}</p>
      <div className="loader__bar"><span style={{ width: `${Math.round(progress)}%` }} /></div>
      {canSkip && (
        <button type="button" className="btn btn--ghost" onClick={onSkip}>
          {t('loader.skip')}
        </button>
      )}
    </div>
  )
}
