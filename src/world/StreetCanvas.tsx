import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useProgress, useTexture } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { SceneId, Stop } from '../content/stops'
import type { StopId } from '../content/stopIds'
import type { Quality } from '../lib/capabilities'
import { DepthScene, type DepthSceneHandle } from './DepthScene'
import { focusFor, PLANE_H, PLANE_W } from './geometry'
import { Rain } from './Rain'
import { SCENES, sceneById, sceneUrls } from './scenes'
import type { WalkState } from './walk'

const FOV = 50
const TRANSITION_S = 1.6
const PAN_MAX_S = 1.5

interface Props {
  walk: WalkState
  stops: Stop[]
  quality: Quality
  signText: (id: StopId) => string
  onArrived(): void
  onContextLost(): void
  onReady?(): void
  onProgress?(p: number): void
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Street({ walk, stops, quality, signText, onArrived, onReady, onProgress }: Omit<Props, 'onContextLost'>) {
  const progress = useProgress((s) => s.progress)
  useEffect(() => onProgress?.(progress), [progress, onProgress])
  const { camera, size, pointer } = useThree()
  const mobile = size.width / size.height < 1
  const stop = stops[walk.index]
  const sceneId = stop.sceneId
  const [shown, setShown] = useState<{ current: SceneId; leaving: SceneId | null }>({ current: sceneId, leaving: null })
  const refs = useRef<Partial<Record<SceneId, DepthSceneHandle | null>>>({})
  const anim = useRef({ t: 0, panning: false, panT: 0 })
  const segments: [number, number] = quality === 'high' ? [256, 144] : [128, 72]

  // Precarga del resto de escenas cuando la primera ya está en pantalla.
  const [firstShown, setFirstShown] = useState(false)
  useEffect(() => {
    if (!firstShown) return
    onReady?.()
    for (const s of SCENES) useTexture.preload(Object.values(sceneUrls(s.id, mobile)))
  }, [firstShown, mobile, onReady])

  // Cambio de parada: si cambia la escena, viaje; si no, paneo hacia el rótulo.
  useEffect(() => {
    if (walk.phase !== 'moving') return
    if (sceneId !== shown.current) {
      setShown({ current: sceneId, leaving: shown.current })
      anim.current.t = 0
    } else {
      anim.current.panning = true
      anim.current.panT = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walk.index, walk.phase])

  // Encuadre de la parada actual: la cámara se acerca a su escaparate.
  const planeW = mobile ? PLANE_W * 0.56 : PLANE_W
  const anchor = sceneById(sceneId).signs.find((a) => a.stopId === stop.id)
  const focus = focusFor(anchor, size.width / size.height, planeW, PLANE_H, FOV)

  useFrame((_, dt) => {
    const a = anim.current
    if (shown.leaving) {
      a.t = Math.min(1, a.t + dt / TRANSITION_S)
      const e = ease(a.t)
      const out = refs.current[shown.leaving]
      const inc = refs.current[shown.current]
      if (out) {
        out.group.position.z = e * 6
        out.setOpacity(1 - e)
      }
      if (inc) {
        inc.group.position.z = -3 * (1 - e)
        inc.setOpacity(e)
      }
      if (a.t >= 1) {
        setShown({ current: shown.current, leaving: null })
        onArrived()
      }
    }

    // La cámara viaja suavemente hacia el escaparate, con un poco de paralaje al mover el ratón.
    const k = 1 - Math.exp(-dt * 3.2)
    const tx = focus.x + pointer.x * 0.45
    const ty = focus.y + pointer.y * 0.25
    camera.position.x += (tx - camera.position.x) * k
    camera.position.y += (ty - camera.position.y) * k
    camera.position.z += (focus.z - camera.position.z) * k
    camera.lookAt(camera.position.x - pointer.x * 0.2, camera.position.y - pointer.y * 0.1, 0)

    // Paso dentro de la misma foto: llega cuando la cámara alcanza el nuevo encuadre.
    if (a.panning) a.panT += dt
    if (a.panning && ((Math.abs(camera.position.x - tx) < 0.06 && Math.abs(camera.position.z - focus.z) < 0.06) || a.panT > PAN_MAX_S)) {
      a.panning = false
      onArrived()
    }
  })

  const rendered = [shown.current, ...(shown.leaving ? [shown.leaving] : [])]
  return (
    <>
      {rendered.map((id) => (
        <Suspense key={id} fallback={null}>
          <DepthScene
            ref={(h) => {
              refs.current[id] = h
            }}
            id={id}
            mobile={mobile}
            segments={segments}
            stops={stops}
            signText={signText}
            lit={id === shown.current && !shown.leaving}
            focusedStop={walk.phase === 'idle' ? stop.id : null}
            initialOpacity={id === shown.current && shown.leaving ? 0 : 1}
            onShown={firstShown ? undefined : () => setFirstShown(true)}
          />
        </Suspense>
      ))}
    </>
  )
}

export default function StreetCanvas(props: Props) {
  const { quality, onContextLost } = props
  const lost = useRef(onContextLost)
  lost.current = onContextLost
  const dpr = useMemo<[number, number]>(() => (quality === 'high' ? [1, 2] : [1, 1.5]), [quality])

  return (
    <Canvas
      dpr={dpr}
      camera={{ fov: FOV, near: 0.1, far: 100, position: [0, 0, 10] }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene, camera }) => {
        if (import.meta.env.DEV) Object.assign(window, { __scene: scene, __camera: camera, __gl: gl })
        gl.toneMapping = THREE.NoToneMapping
        gl.domElement.addEventListener('webglcontextlost', () => lost.current())
      }}
      style={{ position: 'fixed', inset: 0 }}
      aria-hidden
    >
      <color attach="background" args={['#05070c']} />
      <Street {...props} />
      <Rain count={quality === 'high' ? 2000 : 0} />
      {quality === 'high' && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  )
}
