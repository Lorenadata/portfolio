import type { Stop } from '../content/stops'
import { CONTACT } from '../content/stops'
import { useI18n } from '../i18n'
import './recruiter.css'

const NOT_PROJECTS = new Set(['about', 'contact'])

export function RecruiterMode({ stops, canWalk = true }: { stops: Stop[]; canWalk?: boolean }) {
  const { t, lang, setLang } = useI18n()
  const projects = stops.filter((s) => !NOT_PROJECTS.has(s.id))
  return (
    <div className="rec">
      <header className="rec__header">
        <div className="rec__top">
          <p className="rec__eyebrow">{t('brand.subtitle')}</p>
          <div className="rec__tools">
            <button type="button" className="rec__lang" onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
              {t('nav.lang')}
            </button>
            {canWalk && (
              <a className="rec__walk" href="#/">
                {t('recruiter.back')} →
              </a>
            )}
          </div>
        </div>
        <h1 className="rec__name">{t('recruiter.title')}</h1>
        <p className="rec__role">{t('recruiter.role')}</p>
        <p className="rec__seeking">{t('recruiter.seeking')}</p>
        <div className="rec__contact">
          <a className="btn btn--primary" href={CONTACT.cv} target="_blank" rel="noreferrer">
            {t('recruiter.cv')}
          </a>
          <a className="btn btn--ghost" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a className="btn btn--ghost" href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="btn btn--ghost" href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </header>

      <main>
        <h2 className="rec__section">{t('recruiter.projects')}</h2>
        <div className="rec__grid">
          {projects.map((s) => (
            <article key={s.id} className="rec__card" style={{ ['--neon' as string]: s.neon }}>
              <h3>{t(`name.${s.id}`)}</h3>
              <p className="rec__tagline">{t(`tagline.${s.id}`)}</p>
              <p className="rec__result">{t(`result.${s.id}`)}</p>
              <div className="rec__links">
                <a href={`#/p/${s.id}`}>{t('card.enter')} →</a>
                {s.repo && (
                  <a href={s.repo} target="_blank" rel="noreferrer">{t('recruiter.code')}</a>
                )}
                {s.report && (
                  <a href={s.report} target="_blank" rel="noreferrer">{t('card.report')}</a>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
