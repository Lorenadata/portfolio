import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { I18nProvider, type Lang } from '../i18n'

export function renderI18n(ui: ReactElement, lang: Lang = 'en') {
  return render(<I18nProvider initial={lang}>{ui}</I18nProvider>)
}
