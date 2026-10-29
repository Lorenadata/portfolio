import { useId, useState } from 'react'
import { useI18n } from '../../i18n'
import { formatInt, formatPct } from '../../lib/format'
import data from '../../../public/data/alquiler.json'
import '../projects.css'
import './alquiler.css'

type Vista = 'inquilinos' | 'caseros'
type Grupo = { pct_poblacion: number; p10: number; p50: number; p90: number; ratio_p90_p10: number; pct_baja?: number; pct_alta?: number }

const PARES: Record<Vista, [keyof typeof data, keyof typeof data]> = {
  inquilinos: ['inquilinos', 'no_inquilinos'],
  caseros: ['caseros', 'no_caseros'],
}
const MAX = Math.max(data.no_caseros.p90, data.caseros.p90, data.no_inquilinos.p90)

function Grupo({ id, g, vista, testId }: { id: string; g: Grupo; vista: Vista; testId: string }) {
  const { t } = useI18n()
  const locale = t('fmt.locale')
  const clase = vista === 'inquilinos' ? g.pct_baja! : g.pct_alta!
  return (
    <div className="aq-group" data-testid={testId}>
      <h3>{t(`aq.g.${id}`)}</h3>
      <p className="aq-share">{formatPct(g.pct_poblacion, locale)} {t('aq.share')}</p>
      <p className="aq-class"><strong>{formatPct(clase, locale)}</strong> {t(vista === 'inquilinos' ? 'aq.baja' : 'aq.alta')}</p>
      <div className="aq-bars">
        {(['p10', 'p50', 'p90'] as const).map((k) => (
          <div key={k} className="aq-bar">
            <span className="aq-bar__k">{k.toUpperCase()}</span>
            <span className="aq-bar__track"><span style={{ width: `${(g[k] / MAX) * 100}%` }} /></span>
            <span className="aq-bar__v">{formatInt(g[k], locale)} €</span>
          </div>
        ))}
      </div>
      <p className="aq-ratio" title={t('aq.ratio')}>
        <strong>{g.ratio_p90_p10.toFixed(1)}×</strong> <span>{t('aq.ratio')}</span>
      </p>
    </div>
  )
}

export default function Project() {
  const { t } = useI18n()
  const locale = t('fmt.locale')
  const name = useId()
  const [vista, setVista] = useState<Vista>('inquilinos')
  const [a, b] = PARES[vista]
  return (
    <div className="proj">
      <p className="proj__lead">{t('aq.intro')}</p>
      <fieldset className="choice">
        <legend>{t('aq.view')}</legend>
        {(['inquilinos', 'caseros'] as Vista[]).map((v) => (
          <label key={v} className={v === vista ? 'is-on' : undefined}>
            <input type="radio" name={name} checked={v === vista} onChange={() => setVista(v)} />
            {t(`aq.view.${v}`)}
          </label>
        ))}
      </fieldset>
      <div className="aq-pair">
        <Grupo id={a} g={data[a] as Grupo} vista={vista} testId="grupo-a" />
        <Grupo id={b} g={data[b] as Grupo} vista={vista} testId="grupo-b" />
      </div>
      <p className="proj__note">{t('aq.median')}{formatInt(data.mediana, locale)} € · {t('pobreza.source')}</p>
    </div>
  )
}
