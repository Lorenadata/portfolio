import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { renderI18n } from '../../test/render'
import Project from './index'
import limpieza from '../../../public/data/limpieza.json'
import cancelacion from '../../../public/data/cancelacion.json'

afterEach(cleanup)

const marcadas = (id: string) => limpieza.pasos.find((p) => p.id === id)!.marcadas

describe('parada Ride-sharing', () => {
  it('al activar cada paso muestra lo que marca, sin borrar filas', () => {
    renderI18n(<Project quality="low" />)
    expect(screen.getByTestId('rows-kept')).toHaveTextContent('150,000')
    fireEvent.click(screen.getByRole('switch', { name: /missing/i }))
    expect(screen.getByTestId('flag-nulos')).toHaveTextContent('57,000')
    fireEvent.click(screen.getByRole('switch', { name: /duplicate/i }))
    expect(screen.getByTestId('flag-duplicados')).toHaveTextContent('2,457')
    fireEvent.click(screen.getByRole('switch', { name: /iqr/i }))
    expect(screen.getByTestId('flag-outliers_iqr')).toHaveTextContent(marcadas('outliers_iqr').toLocaleString('en-GB'))
    fireEvent.click(screen.getByRole('switch', { name: /lof/i }))
    expect(screen.getByTestId('flag-outliers_lof')).toHaveTextContent('1')
    expect(screen.getByTestId('rows-kept')).toHaveTextContent('150,000')
  })

  it('un paso no se activa antes que el anterior', () => {
    renderI18n(<Project quality="low" />)
    expect(screen.getByRole('switch', { name: /duplicate/i })).toBeDisabled()
  })

  it('en calidad baja la nube LOF es un gráfico 2D', () => {
    renderI18n(<Project quality="low" />)
    expect(screen.getByTestId('lof-2d')).toBeInTheDocument()
  })

  it('la predicción muestra la probabilidad de la combinación elegida, leída del modelo', () => {
    renderI18n(<Project quality="low" />)
    const box = screen.getByTestId('prediccion')
    fireEvent.change(within(box).getByLabelText(/vehicle/i), { target: { value: 'Auto' } })
    fireEvent.change(within(box).getByLabelText(/time of day/i), { target: { value: 'noche' } })
    fireEvent.click(within(box).getByRole('checkbox', { name: /weekend/i }))
    const celda = cancelacion.celdas.find((c) => c.vehicle_type === 'Auto' && c.franja === 'noche' && c.finde === 1)!
    expect(within(box).getByTestId('prob')).toHaveTextContent((celda.prob_media * 100).toFixed(1))
  })

  it('las métricas son las reales del modelo, no números escritos a mano', () => {
    renderI18n(<Project quality="low" />)
    const box = screen.getByTestId('prediccion')
    expect(within(box).getByText(cancelacion.metricas.xgboost.pr_auc.toFixed(3))).toBeInTheDocument()
    expect(within(box).getByText(cancelacion.metricas.base.pr_auc.toFixed(3))).toBeInTheDocument()
    expect(within(box).getByText(cancelacion.asignacion.xgboost.pr_auc.toFixed(3))).toBeInTheDocument()
  })
})
