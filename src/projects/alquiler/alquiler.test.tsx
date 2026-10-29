import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { renderI18n } from '../../test/render'
import Project from './index'
import data from '../../../public/data/alquiler.json'

afterEach(cleanup)

describe('parada Alquiler', () => {
  it('por defecto compara inquilinos con el resto y su tasa de renta baja', () => {
    renderI18n(<Project />)
    const a = screen.getByTestId('grupo-a')
    const b = screen.getByTestId('grupo-b')
    expect(within(a).getByText('46.2%')).toBeInTheDocument()
    expect(within(b).getByText('26.2%')).toBeInTheDocument()
    expect(within(a).getByText(`${data.inquilinos.ratio_p90_p10.toFixed(1)}×`)).toBeInTheDocument()
  })

  it('al cambiar a "clase alta" compara caseros con el resto', () => {
    renderI18n(<Project />)
    fireEvent.click(screen.getByRole('radio', { name: /landlords/i }))
    expect(within(screen.getByTestId('grupo-a')).getByText('21.7%')).toBeInTheDocument()
    expect(within(screen.getByTestId('grupo-b')).getByText('6.2%')).toBeInTheDocument()
    expect(within(screen.getByTestId('grupo-a')).getByText('3.8×')).toBeInTheDocument()
  })

  it('muestra P10, P50 y P90 en euros', () => {
    renderI18n(<Project />)
    expect(within(screen.getByTestId('grupo-a')).getByText(/15,178/)).toBeInTheDocument()
  })
})
