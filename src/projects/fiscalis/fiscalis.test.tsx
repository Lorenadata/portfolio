import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { renderI18n } from '../../test/render'
import { calcularFactura } from './factura'
import Project from './index'

afterEach(cleanup)

describe('calcularFactura', () => {
  it('el caso del seed: 1.000 € + 21 % IVA − 15 % IRPF', () =>
    expect(calcularFactura(1000, 21, 15)).toEqual({ base: 1000, iva: 210, retencion: 150, total: 1060 }))
  it('redondea a céntimos', () => expect(calcularFactura(99.99, 21, 0).iva).toBe(21))
  it('sin IVA ni retención el total es la base', () => expect(calcularFactura(250, 0, 0).total).toBe(250))
  it('base negativa lanza un error', () => expect(() => calcularFactura(-5, 21, 15)).toThrow())
  it('base no numérica lanza un error', () => expect(() => calcularFactura(Number.NaN, 21, 15)).toThrow())
})

describe('parada Fiscalis', () => {
  it('emitir la factura del ejemplo muestra el total y recorre las tablas', () => {
    renderI18n(<Project />)
    fireEvent.click(screen.getByRole('button', { name: /issue invoice/i }))
    expect(screen.getByTestId('total')).toHaveTextContent('1,060.00')
    expect(screen.getAllByTestId('tabla').map((n) => n.textContent)).toEqual([
      'usuario', 'perfil_fiscal', 'actividad', 'cliente', 'factura', 'factura_linea', 'obligacion_fiscal', 'alerta',
    ])
  })
  it('una base inválida muestra un error en el formulario', () => {
    renderI18n(<Project />)
    fireEvent.change(screen.getByLabelText(/taxable base/i), { target: { value: '-20' } })
    fireEvent.click(screen.getByRole('button', { name: /issue invoice/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.queryByTestId('total')).toBeNull()
  })
})
