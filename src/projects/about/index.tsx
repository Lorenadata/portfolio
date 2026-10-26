import { useI18n } from '../../i18n'

export default function Project() {
  const { t } = useI18n()
  return <p>{t('tagline.about')}</p>
}
