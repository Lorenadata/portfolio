import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import { renderI18n } from '../test/render'
import { Loader, ProjectCard, Minimap, TopBar } from './components'
import { STOPS } from '../content/stops'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('Loader', () => {
  it('ofrece saltar al Recruiter Mode a los 6 s, no antes', () => {
    vi.useFakeTimers()
    const onSkip = vi.fn()
    renderI18n(<Loader progress={10} onSkip={onSkip} skipAfterMs={6000} />)
    act(() => vi.advanceTimersByTime(5999))
    expect(screen.queryByRole('button', { name: /recruiter/i })).toBeNull()
    act(() => vi.advanceTimersByTime(1))
    fireEvent.click(screen.getByRole('button', { name: /recruiter/i }))
    expect(onSkip).toHaveBeenCalled()
  })
})

describe('ProjectCard', () => {
  const pobreza = STOPS.find((s) => s.id === 'pobreza')!
  it('muestra nombre, frase, GitHub, informe y botón de entrar', () => {
    const onEnter = vi.fn()
    renderI18n(<ProjectCard stop={pobreza} onEnter={onEnter} />)
    expect(screen.getByRole('heading', { name: 'Child poverty in Spain' })).toBeInTheDocument()
    expect(screen.getByText(/AROPE indicator/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', pobreza.repo)
    expect(screen.getByRole('link', { name: /report/i })).toHaveAttribute('href', pobreza.report)
    fireEvent.click(screen.getByRole('button', { name: /enter project/i }))
    expect(onEnter).toHaveBeenCalled()
  })
  it('sin repo no muestra el enlace a GitHub', () => {
    renderI18n(<ProjectCard stop={STOPS.find((s) => s.id === 'about')!} onEnter={() => {}} />)
    expect(screen.queryByRole('link', { name: /github/i })).toBeNull()
  })
})

describe('Minimap', () => {
  it('muestra solo las paradas recibidas y viaja al hacer clic', () => {
    const onGo = vi.fn()
    const stops = STOPS.filter((s) => s.id !== 'fiscalis')
    renderI18n(<Minimap stops={stops} current={0} onGo={onGo} />)
    expect(screen.queryByRole('button', { name: /fiscalis/i })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /child poverty/i }))
    expect(onGo).toHaveBeenCalledWith(1)
  })
})

describe('TopBar', () => {
  it('enlaza a Recruiter Mode, CV, GitHub y LinkedIn', () => {
    renderI18n(<TopBar />)
    expect(screen.getByRole('link', { name: /recruiter mode/i })).toHaveAttribute('href', '#/recruiter')
    expect(screen.getByRole('link', { name: 'CV' })).toHaveAttribute('href', '/cv/Lorena_Marcos_CV_EN.pdf')
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/Lorenadata')
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/lorena-marcos-6516272b5/')
  })
  it('cambia de idioma', () => {
    renderI18n(<TopBar />)
    fireEvent.click(screen.getByRole('button', { name: 'Español' }))
    expect(screen.getByRole('link', { name: /modo recruiter/i })).toBeInTheDocument()
  })
})
