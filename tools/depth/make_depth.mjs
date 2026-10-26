// Uso: node tools/depth/make_depth.mjs <entrada.png> <carpeta_salida>
// Genera color.webp (escritorio), color-m.webp (móvil) y depth.png (blanco = cerca).
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { pipeline, RawImage } from '@huggingface/transformers'
import { assert169, mobileCrop, outputWidth } from './geometry.mjs'

const [input, outDir] = process.argv.slice(2)
if (!input || !outDir) {
  console.error('Uso: node tools/depth/make_depth.mjs <entrada.png> <carpeta_salida>')
  process.exit(2)
}

const meta = await sharp(input).metadata()
assert169(meta.width, meta.height)
mkdirSync(outDir, { recursive: true })

const w = outputWidth(meta.width, 2560)
await sharp(input).resize({ width: w }).webp({ quality: 80 }).toFile(join(outDir, 'color.webp'))
const crop = mobileCrop(meta.width, meta.height)
await sharp(input).extract(crop).resize({ width: Math.min(1080, crop.width) }).webp({ quality: 78 }).toFile(join(outDir, 'color-m.webp'))

const estimator = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small')
const { depth } = await estimator(await RawImage.read(input))
// Depth Anything devuelve disparidad relativa (más alto = más cerca); se normaliza a 0–255 y se suaviza.
await sharp(Buffer.from(depth.data), { raw: { width: depth.width, height: depth.height, channels: 1 } })
  .normalise()
  .resize({ width: Math.round(w / 2), height: Math.round(w / 2 / (meta.width / meta.height)) })
  .blur(1.2)
  .png()
  .toFile(join(outDir, 'depth.png'))

console.log(`OK ${outDir}: color.webp (${w}px), color-m.webp, depth.png`)
