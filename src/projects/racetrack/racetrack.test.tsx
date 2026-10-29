import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { renderI18n } from '../../test/render'
import Project from './index'
import { carreras } from './mockData'

let fetchSpy: MockInstance<typeof fetch>
beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, 'fetch')
})
afterEach(() => {
  expect(fetchSpy).not.toHaveBeenCalled()
  fetchSpy.mockRestore()
  cleanup()
})

describe('réplica de RaceTrack', () => {
  it('avisa de que es una demo con datos ficticios', () => {
    renderI18n(<Project />)
    expect(screen.getByText(/demo with fictitious data/i)).toBeInTheDocument()
  })

  it('lista las carreras y el filtro por distancia reduce la lista', () => {
    renderI18n(<Project />)
    const list = screen.getByRole('list', { name: /races/i })
    expect(within(list).getAllByRole('listitem')).toHaveLength(carreras.length)
    fireEvent.click(screen.getByRole('button', { name: '10K' }))
    const n10k = carreras.filter((c) => c.distanciaKm === 10).length
    expect(n10k).toBeGreaterThan(0)
    expect(n10k).toBeLessThan(carreras.length)
    expect(within(list).getAllByRole('listitem')).toHaveLength(n10k)
  })

  it('inscribirse termina en un dorsal con QR', async () => {
    renderI18n(<Project />)
    fireEvent.click(screen.getAllByRole('button', { name: /register/i })[0])
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ana Pérez' } })
    fireEvent.change(screen.getByLabelText(/t-shirt/i), { target: { value: 'M' } })
    fireEvent.click(screen.getByRole('button', { name: /pay/i }))
    expect(await screen.findByText(/payment simulated/i)).toBeInTheDocument()
    const bib = await screen.findByTestId('bib')
    expect(within(bib).getByText('Ana Pérez')).toBeInTheDocument()
    expect((await within(bib).findByTestId('bib-qr')).getAttribute('src')).toMatch(/^data:image\/svg\+xml/)
  })

  it('no deja pagar sin nombre', () => {
    renderI18n(<Project />)
    fireEvent.click(screen.getAllByRole('button', { name: /register/i })[0])
    fireEvent.click(screen.getByRole('button', { name: /pay/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/name/i)
    expect(screen.queryByTestId('bib')).toBeNull()
  })

  it('muestra las cifras reales del proyecto', () => {
    renderI18n(<Project />)
    expect(screen.getByText(/2,165/)).toBeInTheDocument()
    expect(screen.getByText(/57/)).toBeInTheDocument()
  })
})
