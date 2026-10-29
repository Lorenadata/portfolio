import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { renderI18n } from './test/render'
import App from './App'
import { stepTransition } from './world/transition'

const street = vi.hoisted(() => ({ mode: 'ok' as 'ok' | 'throw', lastProps: null as null | Record<string, unknown> }))

vi.mock('./world/StreetCanvas', () => ({
  default: (props: Record<string, unknown> & { onReady?: () => void }) => {
    street.lastProps = props
    if (street.mode === 'throw') throw new Error('WebGL renderer creation failed')
    queueMicrotask(() => props.onReady?.())
    return <div data-testid="street" />
  },
}))

beforeEach(() => {
  street.mode = 'ok'
  street.lastProps = null
  window.location.hash = ''
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('C1: un fallo de la calle 3D no deja la web en negro', () => {
  it('si la escena lanza un error, se pasa al Recruiter Mode', async () => {
    street.mode = 'throw'
    renderI18n(<App env={{ webgl: true, reducedMotion: false }} />)
    expect(await screen.findByRole('link', { name: /download cv/i })).toBeInTheDocument()
  })
})

describe('I1: sin 3D se puede entrar igualmente a los proyectos', () => {
  it('el Recruiter Mode sin WebGL enseña "Enter project"', () => {
    renderI18n(<App env={{ webgl: false, reducedMotion: false }} />)
    expect(screen.getAllByRole('link', { name: /enter project/i }).length).toBeGreaterThan(0)
  })
  it('un enlace directo a un proyecto lo abre aunque no haya WebGL', async () => {
    window.location.hash = '#/p/fiscalis'
    renderI18n(<App env={{ webgl: false, reducedMotion: true }} />)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })
})

describe('I3: la calle se pausa con un proyecto abierto', () => {
  it('StreetCanvas recibe paused=true al abrir un proyecto y false al cerrarlo', async () => {
    renderI18n(<App env={{ webgl: true, reducedMotion: false }} />)
    fireEvent.click(await screen.findByRole('button', { name: /enter project/i }))
    await screen.findByRole('dialog')
    expect(street.lastProps?.paused).toBe(true)
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /back to the street/i })))
    await waitFor(() => expect(street.lastProps?.paused).toBe(false))
  })
})

describe('I4: no se viaja a una escena que aún no ha cargado', () => {
  it('sin la escena de destino lista, la transición no avanza', () => expect(stepTransition(0, 0.5, false)).toBe(0))
  it('con la escena lista, avanza según el tiempo', () => expect(stepTransition(0, 0.8, true)).toBeCloseTo(0.5))
  it('nunca pasa de 1', () => expect(stepTransition(0.9, 1, true)).toBe(1))
})

describe('I5: el foco vuelve al botón aunque el navegador lo haya movido', () => {
  it('se recuerda el botón al pulsar, no cuando se abre la capa', async () => {
    renderI18n(<App env={{ webgl: true, reducedMotion: false }} />)
    const enter = await screen.findByRole('button', { name: /enter project/i })
    enter.focus()
    fireEvent.click(enter)
    enter.blur() // Chrome quita el foco al volver inerte la interfaz antes de abrir la capa
    await screen.findByRole('dialog')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /back to the street/i })))
    await waitFor(() => expect(screen.getByRole('button', { name: /enter project/i })).toHaveFocus())
  })
})
