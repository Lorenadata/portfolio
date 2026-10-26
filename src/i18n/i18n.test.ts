import { describe, expect, it } from 'vitest'
import es from './es.json'
import en from './en.json'
import { detectLang } from './index'
import { STOP_IDS } from '../content/stopIds'

describe('detectLang', () => {
  it('es-ES → es', () => expect(detectLang('es-ES', null)).toBe('es'))
  it('en-US → en', () => expect(detectLang('en-US', null)).toBe('en'))
  it('otro idioma → en', () => expect(detectLang('fr', null)).toBe('en'))
  it('lo guardado manda', () => expect(detectLang('es', 'en')).toBe('en'))
  it('lo guardado inválido se ignora', () => expect(detectLang('es', 'xx')).toBe('es'))
})

describe('diccionarios', () => {
  it('es y en tienen exactamente las mismas claves', () =>
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort()))
  it('ningún valor está vacío', () => {
    for (const v of [...Object.values(es), ...Object.values(en)]) expect(String(v).trim()).not.toBe('')
  })
  it('cada parada tiene nombre, frase y rótulo en los dos idiomas', () => {
    for (const id of STOP_IDS)
      for (const k of [`name.${id}`, `tagline.${id}`, `sign.${id}`]) {
        expect(es).toHaveProperty([k])
        expect(en).toHaveProperty([k])
      }
  })
})
