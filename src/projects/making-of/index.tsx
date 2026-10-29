import { STOPS } from '../../content/stops'
import { useI18n } from '../../i18n'
import md from '../../../docs/prompts-imagenes.md?raw'
import { parsePrompts } from './prompts'
import '../projects.css'
import './making-of.css'

const PROMPTS = parsePrompts(md)
const STEPS = [1, 2, 3, 4, 5, 6, 7]

export default function Project() {
  const { t } = useI18n()
  const repo = STOPS.find((s) => s.id === 'making-of')!.repo!
  return (
    <div className="proj">
      <p className="proj__lead">{t('mk.intro')}</p>

      <section>
        <h3 className="mk-h">{t('mk.steps')}</h3>
        <ol className="mk-steps">
          {STEPS.map((n) => (
            <li key={n} aria-label={`${t('mk.step')} ${n}`}>
              <span className="mk-n" aria-hidden>{n}</span>
              <div>
                <h4>{t(`mk.s${n}.t`)}</h4>
                <p>{t(`mk.s${n}.b`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mk-split">
        <section className="mk-box mk-box--me">
          <h3 className="mk-h">{t('mk.me')}</h3>
          <ul>{[1, 2, 3, 4, 5, 6].map((n) => <li key={n}>{t(`mk.me.${n}`)}</li>)}</ul>
        </section>
        <section className="mk-box">
          <h3 className="mk-h">{t('mk.ai')}</h3>
          <ul>{[1, 2, 3, 4].map((n) => <li key={n}>{t(`mk.ai.${n}`)}</li>)}</ul>
        </section>
      </div>

      <section data-testid="prompts">
        <h3 className="mk-h">{t('mk.prompts')}</h3>
        <p className="mk-lead">{t('mk.prompts.lead')}</p>
        {PROMPTS.map((p) => (
          <details key={p.id} className="mk-prompt">
            <summary><code>{p.id}</code> {p.title}</summary>
            <blockquote lang="en">{p.text}</blockquote>
          </details>
        ))}
      </section>

      <p className="proj__note">{t('mk.tools')}</p>
      <a className="btn btn--primary mk-repo" href={repo} target="_blank" rel="noreferrer">{t('mk.repo')} →</a>
    </div>
  )
}
