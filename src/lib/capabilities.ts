export type Quality = 'high' | 'low'

export function canRender3D(env: { webgl: boolean; reducedMotion: boolean }): boolean {
  return env.webgl && !env.reducedMotion
}

export function detectQuality(env: { dpr: number; cores: number; mobile: boolean }): Quality {
  return env.mobile || env.cores < 6 ? 'low' : 'high'
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function currentEnv() {
  const mobile = window.matchMedia?.('(pointer: coarse)').matches ?? false
  return {
    webgl: hasWebGL(),
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    dpr: window.devicePixelRatio || 1,
    cores: navigator.hardwareConcurrency || 4,
    mobile,
  }
}
