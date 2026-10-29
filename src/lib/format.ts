/** 68.63 → "68.6%" (en) o "68,6 %" (es). */
export function formatPct(value: number, locale: string, digits = 1): string {
  return new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value / 100)
}

export function formatInt(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)
}
