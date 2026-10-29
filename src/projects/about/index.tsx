import { useI18n } from '../../i18n'
import '../projects.css'
import './about.css'

export default function Project() {
  const { t } = useI18n()
  return (
    <div className="about">
      <img className="about__photo" src="/img/lorena.webp" alt={t('about.photo')} width={180} height={180} />
      <div className="proj">
        <p className="proj__lead">{t('about.p1')}</p>
        <p className="about__p">{t('about.p2')}</p>
        <p className="about__seeking">{t('recruiter.seeking')}</p>
        <dl className="about__facts">
          <dt>{t('about.edu')}</dt><dd>{t('about.edu.v')}</dd>
          <dt>{t('about.tools')}</dt><dd>{t('about.tools.v')}</dd>
          <dt>{t('about.langs')}</dt><dd>{t('about.langs.v')}</dd>
        </dl>
      </div>
    </div>
  )
}
