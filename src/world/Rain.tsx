import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Lluvia en el shader: cada gota es un segmento cuya altura depende del tiempo, sin tocar la CPU por frame.
const vertex = /* glsl */ `
  attribute vec4 aDrop; // x, y0, z, velocidad
  attribute float aTail;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    float y = mod(aDrop.y - uTime * aDrop.w, 12.0) - 6.0;
    vec3 p = vec3(aDrop.x + aTail * 0.04, y + aTail * 0.35, aDrop.z);
    vAlpha = 0.35 * (1.0 - aTail * 0.8);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
const fragment = /* glsl */ `
  varying float vAlpha;
  void main() { gl_FragColor = vec4(0.75, 0.85, 1.0, vAlpha); }
`

export function Rain({ count }: { count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const geometry = useMemo(() => {
    const drops = new Float32Array(count * 2 * 4)
    const tails = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      const d = [(Math.random() - 0.5) * 18, Math.random() * 12, 1 + Math.random() * 6, 6 + Math.random() * 4]
      drops.set(d, i * 8)
      drops.set(d, i * 8 + 4)
      tails[i * 2] = 0
      tails[i * 2 + 1] = 1
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 2 * 3), 3))
    g.setAttribute('aDrop', new THREE.BufferAttribute(drops, 4))
    g.setAttribute('aTail', new THREE.BufferAttribute(tails, 1))
    return g
  }, [count])

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime
  })

  if (count === 0) return null
  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
      />
    </lineSegments>
  )
}
