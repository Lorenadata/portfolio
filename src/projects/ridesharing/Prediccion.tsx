import { useState } from 'react'
import { useI18n } from '../../i18n'
import { formatPct } from '../../lib/format'
import cancelacion from '../../../public/data/cancelacion.json'

const FRANJAS = ['madrugada', 'manana', 'tarde', 'noche']
const VEHICULOS = [...new Set(cancelacion.celdas.map((c) => c.vehicle_type))].sort()

export function Prediccion() {
  const { t } = useI18n()
  const locale = t('fmt.locale')
  const n3 = (v: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(v)
  const [vehiculo, setVehiculo] = useState(VEHICULOS[0])
  const [franja, setFranja] = useState('tarde')
  const [finde, setFinde] = useState(false)
  const celda = cancelacion.celdas.find((c) => c.vehicle_type === vehiculo && c.franja === franja && c.finde === (finde ? 1 : 0))
  const m = cancelacion.metricas
  const b = cancelacion.asignacion

  return (
    <section className="rs-pred" data-testid="prediccion">
      <h3 className="rs-h">{t('rs.pred.title')}</h3>
      <p className="rs-pred__lead">{t('rs.pred.lead')}</p>
      <div className="rs-pred__grid">
        <div className="fi-form">
          <label>
            {t('rs.pred.vehicle')}
            <select value={vehiculo} onChange={(e) => setVehiculo(e.target.value)}>
              {VEHICULOS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label>
            {t('rs.pred.time')}
            <select value={franja} onChange={(e) => setFranja(e.target.value)}>
              {FRANJAS.map((f) => <option key={f} value={f}>{t(`rs.franja.${f}`)}</option>)}
            </select>
          </label>
          <label className="rs-check">
            <input type="checkbox" checked={finde} onChange={(e) => setFinde(e.target.checked)} />
            {t('rs.pred.weekend')}
          </label>
        </div>
        <div className="proj__result">
          <p className="proj__eyebrow">{t('rs.pred.chance')}</p>
          <p className="proj__big" data-testid="prob" aria-live="polite">
            {celda ? <strong>{formatPct(celda.prob_media * 100, locale)}</strong> : t('pobreza.insufficient')}
          </p>
          <p className="rs-pred__base">{t('rs.pred.base')} {formatPct(cancelacion.prevalencia * 100, locale)}</p>
        </div>
      </div>

      <table className="rt-table rs-metrics">
        <thead>
          <tr><th>{t('rs.pred.model')}</th><th>PR-AUC</th><th>ROC-AUC</th></tr>
        </thead>
        <tbody>
          <tr><td>{t('rs.pred.m.base')}</td><td>{n3(m.base.pr_auc)}</td><td>{n3(0.5)}</td></tr>
          <tr><td>{t('rs.pred.m.logit')}</td><td>{n3(m.logistica.pr_auc)}</td><td>{n3(m.logistica.roc_auc)}</td></tr>
          <tr><td><strong>{t('rs.pred.m.xgb')}</strong></td><td><strong>{n3(m.xgboost.pr_auc)}</strong></td><td>{n3(m.xgboost.roc_auc)}</td></tr>
          <tr className="rs-metrics__b"><td>{t('rs.pred.m.xgbB')}</td><td>{n3(b.xgboost.pr_auc)}</td><td>{n3(b.xgboost.roc_auc)}</td></tr>
        </tbody>
      </table>
      <p className="rs-pred__verdict">{t('rs.pred.verdict')}</p>
      <a className="btn btn--ghost" href="https://lorenadata.github.io/ncr-ride-sharing-eda/modelo_cancelaciones.html" target="_blank" rel="noreferrer">{t('rs.pred.report')} →</a>
    </section>
  )
}
