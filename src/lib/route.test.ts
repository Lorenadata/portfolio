import { describe, expect, it } from 'vitest'
import { parseRoute, toHash } from './route'
import { STOP_IDS } from '../content/stopIds'

const ids = [...STOP_IDS]

describe('parseRoute', () => {
  it('vacío es la calle', () => expect(parseRoute('', ids)).toEqual({ view: 'street' }))
  it('recruiter', () => expect(parseRoute('#/recruiter', ids)).toEqual({ view: 'recruiter' }))
  it('proyecto conocido', () =>
    expect(parseRoute('#/p/racetrack', ids)).toEqual({ view: 'project', id: 'racetrack' }))
  it('proyecto desactivado vuelve a la calle', () =>
    expect(parseRoute('#/p/fiscalis', ids.filter((i) => i !== 'fiscalis'))).toEqual({ view: 'street' }))
  it('basura vuelve a la calle', () => expect(parseRoute('#/p/<script>', ids)).toEqual({ view: 'street' }))
  it('toHash es inverso de parseRoute', () => {
    expect(toHash({ view: 'street' })).toBe('#/')
    expect(toHash({ view: 'recruiter' })).toBe('#/recruiter')
    expect(toHash({ view: 'project', id: 'pobreza' })).toBe('#/p/pobreza')
  })
})
