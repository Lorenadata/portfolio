import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, screen, within } from '@testing-library/react'
import { renderI18n } from '../test/render'
import { RecruiterMode } from './RecruiterMode'
import App from '../App'
import { STOPS } from '../content/stops'

afterEach(() => {
  cleanup()
  window.location.hash = ''
})

describe('RecruiterMode', () => {
  it('dice quién es Lorena y qué busca', () => {
    renderI18n(<RecruiterMode stops={STOPS} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Lorena Marcos' })).toBeInTheDocument()
    expect(screen.getByText(/internship from February 2027/)).toBeInTheDocument()
  })

  it('el CV, el email y LinkedIn están en la cabecera, antes de los proyectos', () => {
    renderI18n(<RecruiterMode stops={STOPS} />)
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/cv/Lorena_Marcos_CV_EN.pdf')
    expect(within(header).getByRole('link', { name: /lorena.loremarcos@gmail.com/ })).toHaveAttribute('href', 'mailto:lorena.loremarcos@gmail.com')
    expect(within(header).getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/lorena-marcos-6516272b5/')
  })

  it('una tarjeta por cada proyecto activo, con resultado y enlaces', () => {
    const stops = STOPS.filter((s) => s.id !== 'fiscalis')
    renderI18n(<RecruiterMode stops={stops} />)
    const cards = screen.getAllByRole('article')
    const projectIds = stops.filter((s) => s.id !== 'about' && s.id !== 'contact').map((s) => s.id)
    expect(cards).toHaveLength(projectIds.length)
    expect(screen.queryByText('Fiscalis data model')).toBeNull()
    const pobreza = cards.find((c) => within(c).queryByText('Child poverty in Spain'))!
    expect(within(pobreza).getByText(/34.7%/)).toBeInTheDocument()
    expect(within(pobreza).getByRole('link', { name: /enter project/i })).toHaveAttribute('href', '#/p/pobreza')
    expect(within(pobreza).getByRole('link', { name: /code/i })).toHaveAttribute('href', 'https://github.com/Lorenadata/pobreza_infantil_espana')
    expect(within(pobreza).getByRole('link', { name: /full report/i })).toBeInTheDocument()
  })

  it('ofrece volver a la calle', () => {
    renderI18n(<RecruiterMode stops={STOPS} />)
    expect(screen.getByRole('link', { name: /walk the street/i })).toHaveAttribute('href', '#/')
  })
})

describe('App sin 3D', () => {
  it('sin WebGL muestra el Recruiter Mode y no la calle', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = renderI18n(<App env={{ webgl: false, reducedMotion: false }} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Lorena Marcos' })).toBeInTheDocument()
    expect(container.querySelector('canvas')).toBeNull()
    expect(screen.queryByRole('link', { name: /walk the street/i })).toBeNull()
  })
  it('con movimiento reducido también', () => {
    renderI18n(<App env={{ webgl: true, reducedMotion: true }} />)
    expect(screen.getByRole('link', { name: /download cv/i })).toBeInTheDocument()
  })
})
