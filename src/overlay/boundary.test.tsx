import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, screen } from '@testing-library/react'
import { renderI18n } from '../test/render'
import { ProjectOverlay } from './ProjectOverlay'

vi.mock('../projects/pobreza', () => ({
  default: () => {
    throw new Error('Failed to fetch dynamically imported module')
  },
}))
afterEach(cleanup)

describe('C1: un proyecto que no carga', () => {
  it('muestra un aviso con reintentar y volver, sin tirar la web', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderI18n(<ProjectOverlay id="pobreza" onClose={() => {}} />)
    expect(await screen.findByText(/couldn't load/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /back to the street/i }).length).toBeGreaterThan(0)
  })
})
