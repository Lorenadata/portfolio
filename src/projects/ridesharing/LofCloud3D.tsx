import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { LofPoint } from './index'

export default function LofCloud3D({ points, caption }: { points: LofPoint[]; caption: string }) {
  const { normal, outliers } = useMemo(() => {
    const ext = Math.max(...points.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y), Math.abs(p.z))))
    const toArr = (ps: LofPoint[]) => new Float32Array(ps.flatMap((p) => [p.x / ext * 3, p.y / ext * 3, p.z / ext * 3]))
    return { normal: toArr(points.filter((p) => !p.outlier)), outliers: points.filter((p) => p.outlier).map((p) => new THREE.Vector3(p.x / ext * 3, p.y / ext * 3, p.z / ext * 3)) }
  }, [points])

  return (
    <figure className="rs-cloud">
      <div className="rs-cloud3d" role="img" aria-label={caption}>
        <Canvas camera={{ position: [5, 3, 6], fov: 45 }} dpr={[1, 2]}>
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[normal, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.035} color="#fdba74" transparent opacity={0.55} sizeAttenuation />
          </points>
          {outliers.map((v, i) => (
            <mesh key={i} position={v}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshBasicMaterial color="#fb923c" />
            </mesh>
          ))}
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
