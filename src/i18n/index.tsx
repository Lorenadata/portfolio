import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import es from './es.json'
import en from './en.json'
import { safeGet, safeSet } from '../lib/storage'

export type Lang = 'es' | 'en'
type Dict = Record<string, string>
const DICTS: Record<Lang, Dict> = { es, en }

export function detectLang(navLang: string, stored: string | null): Lang {
  if (stored === 'es' || stored === 'en') return stored
  return navLang.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function translate(lang: Lang, key: string): string {
  return DICTS[lang][key] ?? key
}

interface I18n {
  lang: Lang
  setLang(l: Lang): void
  t(key: string): string
}

const Ctx = createContext<I18n>({ lang: 'en', setLang: () => {}, t: (k) => translate('en', k) })

export function I18nProvider({ children, initial }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(
    () => initial ?? detectLang(navigator.language || 'en', safeGet('lang')),
  )
  const setLang = useCallback((l: Lang) => {
    safeSet('lang', l)
    setLangState(l)
  }, [])
  const value = useMemo(() => ({ lang, setLang, t: (k: string) => translate(lang, k) }), [lang, setLang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
