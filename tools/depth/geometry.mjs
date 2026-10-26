export const SAFE_ZONE = 0.56

export function assert169(width, height) {
  const ratio = width / height / (16 / 9)
  if (Math.abs(ratio - 1) > 0.02) {
    throw new Error(`La imagen mide ${width}x${height}; tiene que ser 16:9 (±2 %). Pide a ChatGPT "16:9 landscape".`)
  }
}

export function mobileCrop(width, height) {
  const w = Math.round(width * SAFE_ZONE)
  return { left: Math.round((width - w) / 2), top: 0, width: w, height }
}

export function outputWidth(width, max) {
  return Math.min(width, max)
}
