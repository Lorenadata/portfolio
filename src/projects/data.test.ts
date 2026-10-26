import { describe, expect, it } from 'vitest'
import arope from '../../public/data/arope.json'
import alquiler from '../../public/data/alquiler.json'
import limpieza from '../../public/data/limpieza.json'
import lof from '../../public/data/lof.json'

describe('arope.json', () => {
  it('cifras generales del informe', () => expect(arope.general).toEqual({ menores: 34.72, resto: 24.31 }))
  it('las celdas insuficientes no tienen tasa y las suficientes sí', () => {
    for (const c of arope.celdas) {
      if (c.suficiente) {
        expect(c.n).toBeGreaterThanOrEqual(50)
        expect(c.tasa).toBeGreaterThan(0)
      } else expect(c.tasa).toBeNull()
    }
  })
  it('cubre cada tipo de hogar con menores en alquiler y fuera de alquiler', () => {
    expect(new Set(arope.celdas.map((c) => c.tenencia))).toEqual(new Set(['alquiler', 'no_alquiler']))
    expect(new Set(arope.celdas.map((c) => c.tiphogar)).size).toBe(5)
  })
})

describe('alquiler.json', () => {
  it('la mediana es la del informe', () => expect(alquiler.mediana).toBe(19307))
  it('los percentiles están ordenados y el ratio cuadra', () => {
    for (const g of [alquiler.inquilinos, alquiler.no_inquilinos, alquiler.caseros, alquiler.no_caseros]) {
      expect(g.p10).toBeLessThan(g.p50)
      expect(g.p50).toBeLessThan(g.p90)
      expect(g.ratio_p90_p10).toBeCloseTo(g.p90 / g.p10, 1)
    }
  })
})

describe('limpieza.json y lof.json', () => {
  it('los pasos van en orden y con las cifras del análisis', () => {
    expect(limpieza.pasos.map((p) => p.id)).toEqual(['original', 'nulos', 'duplicados', 'outliers_iqr', 'outliers_lof'])
    expect(limpieza.pasos.every((p) => p.filas === 150000)).toBe(true)
    expect(limpieza.pasos.find((p) => p.id === 'duplicados')!.marcadas).toBe(2457)
  })
  it('la nube tiene 3.000 puntos e incluye el outlier', () => {
    expect(lof).toHaveLength(3000)
    expect(lof.filter((p) => p.outlier)).toHaveLength(1)
  })
})
