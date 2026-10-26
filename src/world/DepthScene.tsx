import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { SceneId, Stop } from '../content/stops'
import type { StopId } from '../content/stopIds'
import { displacePlane, readDepthField, sampleField } from './depthField'
import { anchorToWorld, PLANE_H, PLANE_W } from './geometry'
import { NeonSign } from './NeonSign'
import { sceneById, sceneUrls } from './scenes'

export interface DepthSceneHandle {
  group: THREE.Group
  setOpacity(o: number): void
}

interface Props {
  id: SceneId
  mobile: boolean
  segments: [number, number]
  stops: Stop[]
  signText: (id: StopId) => string
  lit: boolean
  focusedStop: StopId | null
  /** 0 si la escena entra con un fundido. */
  initialOpacity: number
}

const MOBILE_U: [number, number] = [0.22, 0.56]
const DESKTOP_U: [number, number] = [0, 1]

export const DepthScene = forwardRef<DepthSceneHandle, Props>(function DepthScene(
  { id, mobile, segments, stops, signText, lit, focusedStop, initialOpacity },
  ref,
) {
  const def = sceneById(id)
  const urls = sceneUrls(id, mobile)
  const [color, depth] = useTexture([urls.color, urls.depth])
  const field = useMemo(() => readDepthField(depth.image as HTMLImageElement), [depth])

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(mobile ? PLANE_W * MOBILE_U[1] : PLANE_W, PLANE_H, segments[0], segments[1])
    if (field) displacePlane(g, field, def.depthScale, mobile ? MOBILE_U : DESKTOP_U)
    return g
  }, [field, def, mobile, segments])

  const material = useMemo(() => {
    color.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshBasicMaterial({ map: color, transparent: true, depthWrite: false, toneMapped: false })
  }, [color])

  const group = useRef<THREE.Group>(null!)
  const signsGroup = useRef<THREE.Group>(null!)

  useLayoutEffect(() => {
    material.opacity = initialOpacity
    group.current.position.z = initialOpacity === 0 ? -3 : 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material])

  useImperativeHandle(ref, () => ({
    group: group.current,
    setOpacity(o: number) {
      material.opacity = o
      signsGroup.current.visible = o > 0.05
    },
  }))

  const enabled = new Set(stops.map((s) => s.id))
  const depthAt = (u: number, v: number) => (field ? sampleField(field, u, v) : 0.5)

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} />
      <group ref={signsGroup}>
        {def.signs
          .filter((a) => enabled.has(a.stopId))
          .map((a) => {
            const stop = stops.find((s) => s.id === a.stopId)!
            const [x, y, z] = anchorToWorld(a, depthAt, def.depthScale)
            return (
              <NeonSign
                key={a.stopId}
                text={signText(a.stopId)}
                color={stop.neon}
                position={[x, y, z + 0.05]}
                width={a.width}
                rotY={a.rotY}
                lit={lit}
                focused={focusedStop === a.stopId}
              />
            )
          })}
      </group>
    </group>
  )
})
