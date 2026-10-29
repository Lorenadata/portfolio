import { CONTACT } from '../../content/stops'
import { useI18n } from '../../i18n'
import '../projects.css'

export default function Project() {
  const { t } = useI18n()
  return (
    <div className="proj">
      <p className="proj__lead">{t('contact.lead')}</p>
      <div className="card__actions">
        <a className="btn btn--primary" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <a className="btn btn--ghost" href={CONTACT.cv} target="_blank" rel="noreferrer">{t('contact.cv')}</a>
        <a className="btn btn--ghost" href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a className="btn btn--ghost" href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  )
}
