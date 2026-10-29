import { useState } from 'react'
import { useI18n } from '../../i18n'
import { calcularFactura, type TipoIva, type TipoRetencion } from './factura'
import '../projects.css'
import './fiscalis.css'

const TABLAS = ['usuario', 'perfil_fiscal', 'actividad', 'cliente', 'factura', 'factura_linea', 'obligacion_fiscal', 'alerta']
const IVAS: TipoIva[] = [0, 4, 10, 21]
const RETENCIONES: TipoRetencion[] = [0, 7, 15]

export default function Project() {
  const { t } = useI18n()
  const money = new Intl.NumberFormat(t('fmt.locale'), { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const [base, setBase] = useState('1000')
  const [iva, setIva] = useState<TipoIva>(21)
  const [ret, setRet] = useState<TipoRetencion>(15)
  const [result, setResult] = useState<ReturnType<typeof calcularFactura> | null>(null)
  const [error, setError] = useState(false)

  const emitir = () => {
    try {
      setResult(calcularFactura(Number(base.replace(',', '.')), iva, ret))
      setError(false)
    } catch {
      setResult(null)
      setError(true)
    }
  }

  return (
    <div className="proj">
      <p className="proj__lead">{t('fi.intro')}</p>
      <div className="proj__split">
        <form className="fi-form" onSubmit={(e) => { e.preventDefault(); emitir() }}>
          <label>
            {t('fi.base')}
            <input inputMode="decimal" value={base} onChange={(e) => setBase(e.target.value)} />
          </label>
          <label>
            {t('fi.iva')}
            <select value={iva} onChange={(e) => setIva(Number(e.target.value) as TipoIva)}>
              {IVAS.map((v) => <option key={v} value={v}>{v} %</option>)}
            </select>
          </label>
          <label>
            {t('fi.irpf')}
            <select value={ret} onChange={(e) => setRet(Number(e.target.value) as TipoRetencion)}>
              {RETENCIONES.map((v) => <option key={v} value={v}>{v} %</option>)}
            </select>
          </label>
          {error && <p role="alert" className="fi-error">{t('fi.error')}</p>}
          <button type="submit" className="btn btn--primary">{t('fi.issue')}</button>
          {result && (
            <dl className="fi-invoice">
              <div><dt>{t('fi.l.base')}</dt><dd>{money.format(result.base)} €</dd></div>
              <div><dt>+ {t('fi.l.iva')} {iva} %</dt><dd>{money.format(result.iva)} €</dd></div>
              <div><dt>− {t('fi.l.irpf')} {ret} %</dt><dd>{money.format(result.retencion)} €</dd></div>
              <div className="fi-total"><dt>{t('fi.total')}</dt><dd data-testid="total">{money.format(result.total)} €</dd></div>
            </dl>
          )}
        </form>
        <div className="proj__result">
          <p className="proj__eyebrow">{t('fi.flow')}</p>
          <ol className={`fi-flow${result ? ' is-running' : ''}`} key={result ? JSON.stringify(result) : 'idle'}>
            {TABLAS.map((tabla, i) => (
              <li key={tabla} style={{ animationDelay: `${i * 160}ms` }}>
                {result && <code data-testid="tabla">{tabla}</code>}
                {!result && <code>{tabla}</code>}
                <span>{t(`fi.t.${tabla}`)}</span>
              </li>
            ))}
          </ol>
          <p className="proj__note">{t('fi.schema')}</p>
        </div>
      </div>
    </div>
  )
}
