import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Solo en desarrollo (?debug): vuelca en pantalla el estado del motor 3D y los errores, para diagnosticar en el navegador de Lorena.
const errors: string[] = []
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => errors.push(`error: ${e.message}`))
  window.addEventListener('unhandledrejection', (e) => errors.push(`promise: ${String(e.reason)}`))
  const orig = console.error
  console.error = (...a: unknown[]) => {
    errors.push(`console: ${a.map(String).join(' ').slice(0, 300)}`)
    orig(...a)
  }
}

export function DebugPanel() {
  const { gl, scene, camera, size } = useThree()
  const box = useRef<HTMLPreElement | null>(null)
  const last = useRef(0)

  useEffect(() => {
    const el = document.createElement('pre')
    el.style.cssText = 'position:fixed;top:90px;left:12px;z-index:99;max-width:46vw;max-height:70vh;overflow:auto;margin:0;padding:10px;background:rgba(0,0,0,.85);color:#7fffd4;font:11px/1.4 monospace;white-space:pre-wrap;pointer-events:auto'
    document.body.appendChild(el)
    box.current = el
    return () => el.remove()
  }, [])

  useFrame(({ clock }) => {
    if (!box.current || clock.elapsedTime - last.current < 0.5) return
    last.current = clock.elapsedTime
    const ctx = gl.getContext()
    const dbg = ctx.getExtension('WEBGL_debug_renderer_info')
    const meshes: string[] = []
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const mat = m.material as THREE.MeshBasicMaterial
      const p = new THREE.Vector3()
      m.getWorldPosition(p)
      const map = mat.map?.image as { width?: number } | undefined
      meshes.push(`${m.geometry.type} vis=${m.visible} op=${mat.opacity?.toFixed(2)} map=${map?.width ?? '-'} z=${p.z.toFixed(2)} verts=${m.geometry.attributes.position?.count}`)
    })
    box.current.textContent = [
      `GPU: ${dbg ? ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'n/a'}`,
      `WebGL2: ${gl.capabilities.isWebGL2} lost: ${ctx.isContextLost()}`,
      `canvas: ${gl.domElement.width}x${gl.domElement.height} css ${size.width}x${size.height}`,
      `t=${clock.elapsedTime.toFixed(1)}s frame=${gl.info.render.frame} calls=${gl.info.render.calls} programs=${gl.info.programs?.length}`,
      `camera: ${camera.position.toArray().map((v) => v.toFixed(2)).join(', ')}`,
      `meshes (${meshes.length}):`,
      ...meshes.slice(0, 8),
      `errors (${errors.length}):`,
      ...errors.slice(-8),
    ].join('\n')
  })
  return null
}
