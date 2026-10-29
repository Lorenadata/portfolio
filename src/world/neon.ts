import * as THREE from 'three'

/** Lo que necesitamos de un Text de troika. Su `material` puede ser una lista si hay contorno, así que no se toca. */
export interface NeonText {
  color: THREE.ColorRepresentation
  fillOpacity: number
  outlineOpacity: number
}

const tmp = new THREE.Color()

/** Aplica el brillo del neón (nivel 0 = apagado, >1 = enfocado) mediante las propiedades del texto, no del material. */
export function applyNeon(text: NeonText, base: string, level: number) {
  text.color = tmp.set(base).multiplyScalar(0.6 + level * 1.4).getHex()
  text.fillOpacity = Math.min(1, level)
  text.outlineOpacity = Math.min(0.5, level * 0.5)
}
