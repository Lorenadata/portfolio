import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { applyNeon } from './neon'

// Un Text de troika con contorno expone `material` como una LISTA [contorno, relleno]: no se puede tocar material.color.
function fakeTroikaText() {
  return {
    material: [new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial()],
    color: '#000000' as THREE.ColorRepresentation,
    fillOpacity: 1,
    outlineOpacity: 1,
  }
}

describe('applyNeon', () => {
  it('no falla cuando el material es una lista (texto con contorno)', () => {
    expect(() => applyNeon(fakeTroikaText(), '#2dd4bf', 0.5)).not.toThrow()
  })
  it('usa las propiedades del texto: color más intenso cuanto más nivel', () => {
    const a = fakeTroikaText()
    const b = fakeTroikaText()
    applyNeon(a, '#2dd4bf', 0.2)
    applyNeon(b, '#2dd4bf', 1)
    expect(new THREE.Color(b.color).r + new THREE.Color(b.color).g).toBeGreaterThan(new THREE.Color(a.color).r + new THREE.Color(a.color).g)
  })
  it('la opacidad sigue al nivel y nunca pasa de 1', () => {
    const t = fakeTroikaText()
    applyNeon(t, '#2dd4bf', 0.3)
    expect(t.fillOpacity).toBeCloseTo(0.3)
    applyNeon(t, '#2dd4bf', 1.6)
    expect(t.fillOpacity).toBe(1)
    expect(t.outlineOpacity).toBeLessThanOrEqual(0.5)
  })
})
