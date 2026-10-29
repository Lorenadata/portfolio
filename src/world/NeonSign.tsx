import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { applyNeon, type NeonText } from './neon'

const FONT = '/fonts/cormorant-garamond-latin-600-normal.woff'

interface Props {
  text: string
  color: string
  position: [number, number, number]
  width: number
  rotY: number
  /** La escena está presente: el rótulo se enciende. */
  lit: boolean
  /** Es la parada en la que está el visitante: brilla más. */
  focused: boolean
}

export function NeonSign({ text, color, position, width, rotY, lit, focused }: Props) {
  const ref = useRef<THREE.Mesh>(null)
  const state = useRef({ level: 0, litAt: -1, nextFlicker: 2 + Math.random() * 6 })

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    const t = clock.elapsedTime
    const s = state.current
    if (lit && s.litAt < 0) s.litAt = t
    if (!lit) s.litAt = -1

    let target = 0
    if (lit) {
      const since = t - s.litAt
      // Encendido con tartamudeo durante el primer medio segundo, como un neón de verdad.
      target = since < 0.5 ? (Math.sin(since * 60) > 0.2 ? 1 : 0.15) : 1
      if (t > s.nextFlicker) {
        target = 0.35
        if (t > s.nextFlicker + 0.08) s.nextFlicker = t + 3 + Math.random() * 8
      }
      if (focused) target *= 1.6
    }
    s.level += (target - s.level) * 0.25
    applyNeon(mesh as unknown as NeonText, color, s.level)
  })

  return (
    <Text
      ref={ref}
      font={FONT}
      position={position}
      rotation={[0, rotY, 0]}
      fontSize={width / Math.max(4, text.length * 0.55)}
      maxWidth={width}
      anchorX="center"
      anchorY="middle"
      color={color}
      outlineWidth="4%"
      outlineBlur="25%"
      outlineColor={color}
      outlineOpacity={0.5}
      material-toneMapped={false}
      material-transparent
    >
      {text}
    </Text>
  )
}
