import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { renderI18n } from '../../test/render'
import { parsePrompts } from './prompts'
import md from '../../../docs/prompts-imagenes.md?raw'
import Project from './index'

afterEach(cleanup)

describe('parsePrompts', () => {
  it('saca los 9 prompts del documento real, en orden', () => {
    const ps = parsePrompts(md)
    expect(ps.map((p) => p.id)).toEqual(['llegada', 'escuela-taxis', 'alquiler-gestoria', 'facultad-taller', 'plaza-buzon', 'interior', 'taxis', 'gestoria', 'taller'])
  })
  it('cada prompt prohíbe texto legible e interfaz', () => {
    for (const p of parsePrompts(md)) {
      expect(p.text).toMatch(/no readable text/i)
      expect(p.text.length).toBeGreaterThan(200)
    }
  })
  it('un documento sin prompts devuelve una lista vacía', () => expect(parsePrompts('# nada')).toEqual([]))
})

describe('parada Cómo se hizo', () => {
  it('cuenta el proceso por etapas y separa lo que decidió Lorena de lo que hizo la IA', () => {
    renderI18n(<Project />)
    expect(screen.getAllByRole('listitem', { name: /step/i }).length).toBeGreaterThanOrEqual(5)
    expect(screen.getByRole('heading', { name: /what i decided/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /what the ai did/i })).toBeInTheDocument()
  })
  it('enseña los prompts reales al desplegarlos', () => {
    renderI18n(<Project />)
    const box = screen.getByTestId('prompts')
    fireEvent.click(within(box).getAllByText(/llegada/i)[0])
    expect(within(box).getAllByText(/Photorealistic night street photograph/i).length).toBeGreaterThan(0)
  })
  it('enlaza al repositorio con todo el proceso', () => {
    renderI18n(<Project />)
    expect(screen.getByRole('link', { name: /full process on github/i })).toHaveAttribute('href', 'https://github.com/Lorenadata/portfolio')
  })
})
