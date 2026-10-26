import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { renderI18n } from '../test/render'
import { ProjectOverlay } from './ProjectOverlay'
import App from '../App'

vi.mock('../world/StreetCanvas', () => ({
  default: ({ onReady }: { onReady?: () => void }) => {
    queueMicrotask(() => onReady?.())
    return <div data-testid="street" />
  },
}))

beforeEach(() => {
  window.location.hash = ''
})
afterEach(cleanup)

describe('ProjectOverlay', () => {
  it('al abrir, el foco va al título del proyecto', async () => {
    renderI18n(<ProjectOverlay id="pobreza" onClose={() => {}} />)
    const title = await screen.findByRole('heading', { level: 2, name: 'Child poverty in Spain' })
    await waitFor(() => expect(title).toHaveFocus())
  })

  it('Escape cierra', async () => {
    const onClose = vi.fn()
    renderI18n(<ProjectOverlay id="pobreza" onClose={onClose} />)
    await screen.findByRole('dialog')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('Tab no sale de la capa', async () => {
    renderI18n(
      <>
        <button>fuera</button>
        <ProjectOverlay id="pobreza" onClose={() => {}} />
      </>,
    )
    const dialog = await screen.findByRole('dialog')
    const close = screen.getByRole('button', { name: /back to the street/i })
    close.focus()
    // Shift+Tab desde el primer elemento salta al último de la capa, nunca fuera.
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(dialog.contains(document.activeElement)).toBe(true)
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(dialog.contains(document.activeElement)).toBe(true)
  })
})

describe('App con enlaces directos', () => {
  it('#/p/racetrack abre la capa al cargar', async () => {
    window.location.hash = '#/p/racetrack'
    renderI18n(<App env={{ webgl: true, reducedMotion: false }} />)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('Entrar abre la capa y al cerrarla el foco vuelve al botón y la URL a #/', async () => {
    renderI18n(<App env={{ webgl: true, reducedMotion: false }} />)
    const enter = await screen.findByRole('button', { name: /enter project/i })
    enter.focus()
    fireEvent.click(enter)
    await screen.findByRole('dialog')
    expect(window.location.hash).toBe('#/p/racetrack')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /back to the street/i })))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(window.location.hash).toBe('#/')
    await waitFor(() => expect(screen.getByRole('button', { name: /enter project/i })).toHaveFocus())
  })
})
