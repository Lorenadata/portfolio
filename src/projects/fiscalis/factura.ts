export type TipoIva = 0 | 4 | 10 | 21
export type TipoRetencion = 0 | 7 | 15

const cents = (v: number) => Math.round(v * 100) / 100

/** Factura de autónomo: base + IVA − retención de IRPF, redondeado a céntimos. */
export function calcularFactura(base: number, iva: TipoIva, retencion: TipoRetencion) {
  if (!Number.isFinite(base) || base < 0) throw new Error('La base imponible tiene que ser un número positivo')
  const b = cents(base)
  const i = cents((b * iva) / 100)
  const r = cents((b * retencion) / 100)
  return { base: b, iva: i, retencion: r, total: cents(b + i - r) }
}
