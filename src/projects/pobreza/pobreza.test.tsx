import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { renderI18n } from '../../test/render'
import { lookupArope, type AropeData } from './arope'
import Project from './index'
import real from '../../../public/data/arope.json'

afterEach(cleanup)

const data: AropeData = {
  general: { menores: 34.72, resto: 24.31 },
  celdas: [
    { tiphogar: 'monoparental', tenencia: 'alquiler', tasa: 68.63, n: 441, suficiente: true },
    { tiphogar: 'otros_con_ninos', tenencia: 'alquiler', tasa: null, n: 12, suficiente: false },
  ],
}

describe('lookupArope', () => {
  it('devuelve la celda pedida', () =>
    expect(lookupArope(data, 'monoparental', 'alquiler')).toEqual({ tasa: 68.63, suficiente: true }))
  it('una celda con poca muestra no tiene tasa', () =>
    expect(lookupArope(data, 'otros_con_ninos', 'alquiler')).toEqual({ tasa: null, suficiente: false }))
  it('una combinación que no existe devuelve undefined', () =>
    expect(lookupArope(data, 'monoparental', 'no_alquiler')).toBeUndefined())
})

describe('parada Pobreza infantil', () => {
  it('muestra las cifras generales del informe', () => {
    renderI18n(<Project data={real as AropeData} />)
    expect(screen.getAllByText(/34\.7%/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/24\.3%/).length).toBeGreaterThan(0)
  })
  it('al construir un hogar muestra su tasa', () => {
    renderI18n(<Project data={real as AropeData} />)
    fireEvent.click(screen.getByRole('radio', { name: /single parent/i }))
    fireEvent.click(screen.getByRole('radio', { name: /^rents/i }))
    expect(screen.getByTestId('arope-tasa')).toHaveTextContent('68.6%')
  })
  it('con muestra insuficiente dice "muestra insuficiente" y no da número', () => {
    renderI18n(<Project data={data} />)
    fireEvent.click(screen.getByRole('radio', { name: /other households/i }))
    fireEvent.click(screen.getByRole('radio', { name: /^rents/i }))
    expect(screen.getByTestId('arope-tasa')).toHaveTextContent(/sample too small/i)
    expect(screen.getByTestId('arope-tasa').textContent).not.toMatch(/\d+(\.\d+)?%/)
  })
})
