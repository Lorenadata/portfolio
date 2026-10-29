import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, screen } from '@testing-library/react'
import { renderI18n } from '../test/render'
import About from './about'
import Contact from './contact'

afterEach(cleanup)

describe('Sobre mí', () => {
  it('muestra la foto con texto alternativo, la formación y lo que busca', () => {
    renderI18n(<About />)
    expect(screen.getByRole('img', { name: /lorena marcos/i })).toHaveAttribute('src', '/img/lorena.webp')
    expect(screen.getByText(/BSc Applied Data Science/)).toBeInTheDocument()
    expect(screen.getByText(/February 2027/)).toBeInTheDocument()
  })
})

describe('Contacto', () => {
  it('tiene email, LinkedIn, GitHub y CV', () => {
    renderI18n(<Contact />)
    expect(screen.getByRole('link', { name: /lorena.loremarcos@gmail.com/ })).toHaveAttribute('href', 'mailto:lorena.loremarcos@gmail.com')
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', 'https://www.linkedin.com/in/lorena-marcos-6516272b5/')
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/Lorenadata')
    expect(screen.getByRole('link', { name: /cv/i })).toHaveAttribute('href', '/cv/Lorena_Marcos_CV_EN.pdf')
  })
})
