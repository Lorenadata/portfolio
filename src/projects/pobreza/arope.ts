export type Tenencia = 'alquiler' | 'no_alquiler'

export interface AropeCell {
  tiphogar: string
  tenencia: Tenencia
  tasa: number | null
  n: number
  suficiente: boolean
}

export interface AropeData {
  general: { menores: number; resto: number }
  celdas: AropeCell[]
}

export function lookupArope(data: AropeData, tiphogar: string, tenencia: Tenencia) {
  const c = data.celdas.find((x) => x.tiphogar === tiphogar && x.tenencia === tenencia)
  return c ? { tasa: c.suficiente ? c.tasa : null, suficiente: c.suficiente } : undefined
}
