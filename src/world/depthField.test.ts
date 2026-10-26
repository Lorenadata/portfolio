import { describe, expect, it } from 'vitest'
import { sampleField, displacePlane, type DepthField } from './depthField'
import * as THREE from 'three'

// 2x2: arriba-izquierda negro (lejos), abajo-derecha blanco (cerca)
const field: DepthField = { width: 2, height: 2, data: new Uint8ClampedArray([0, 128, 128, 255]) }

describe('sampleField', () => {
  it('lee arriba a la izquierda como lejos (0)', () => expect(sampleField(field, 0, 0)).toBe(0))
  it('lee abajo a la derecha como cerca (1)', () => expect(sampleField(field, 1, 1)).toBe(1))
  it('recorta coordenadas fuera de rango', () => expect(sampleField(field, 2, -1)).toBeCloseTo(128 / 255))
})

describe('displacePlane', () => {
  it('desplaza en z según la profundidad y la escala', () => {
    const g = new THREE.PlaneGeometry(2, 2, 1, 1)
    displacePlane(g, field, 2, [0, 1])
    const z = g.attributes.position.array as Float32Array
    // vértices de PlaneGeometry: arriba-izq, arriba-der, abajo-izq, abajo-der
    expect(z[2]).toBeCloseTo(0)
    expect(z[11]).toBeCloseTo(2)
  })
  it('con el recorte móvil solo usa la franja central', () => {
    const g = new THREE.PlaneGeometry(2, 2, 1, 1)
    displacePlane(g, field, 1, [0.6, 0.4])
    const z = g.attributes.position.array as Float32Array
    expect(z[2]).toBeCloseTo(sampleField(field, 0.6, 0))
  })
})
