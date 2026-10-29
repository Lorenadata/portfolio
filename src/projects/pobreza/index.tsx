import { useId, useState } from 'react'
import { useI18n } from '../../i18n'
import { formatPct } from '../../lib/format'
import realData from '../../../public/data/arope.json'
import { lookupArope, type AropeData, type Tenencia } from './arope'
import '../projects.css'

const HOGARES = ['monoparental', 'dos_adultos_1', 'dos_adultos_2', 'dos_adultos_3mas', 'otros_con_ninos']
const TENENCIAS: Tenencia[] = ['alquiler', 'no_alquiler']

function Choice<T extends string>({ legend, options, value, onChange, label }: {
  legend: string; options: T[]; value: T; onChange(v: T): void; label(v: T): string
}) {
  const name = useId()
  return (
    <fieldset className="choice">
      <legend>{legend}</legend>
      {options.map((o) => (
        <label key={o} className={o === value ? 'is-on' : undefined}>
          <input type="radio" name={name} value={o} checked={o === value} onChange={() => onChange(o)} />
          {label(o)}
        </label>
      ))}
    </fieldset>
  )
}

function People({ rate }: { rate: number | null }) {
  const filled = rate === null ? 0 : Math.round(rate)
  return (
    <div className="people" aria-hidden>
      {Array.from({ length: 100 }, (_, i) => (
        <span key={i} className={i < filled ? 'is-risk' : undefined} style={{ transitionDelay: `${i * 6}ms` }} />
      ))}
    </div>
  )
}

export default function Project({ data = realData as AropeData }: { data?: AropeData }) {
  const { t } = useI18n()
  const locale = t('fmt.locale')
  const [hogar, setHogar] = useState(HOGARES[0])
  const [tenencia, setTenencia] = useState<Tenencia>('no_alquiler')
  const cell = lookupArope(data, hogar, tenencia)
  const rate = cell?.tasa ?? null

  return (
    <div className="proj">
      <p className="proj__lead">{t('pobreza.intro')}</p>
      <div className="stats">
        <div className="stat stat--hot"><strong>{formatPct(data.general.menores, locale)}</strong><span>{t('pobreza.children')}</span></div>
        <div className="stat"><strong>{formatPct(data.general.resto, locale)}</strong><span>{t('pobreza.rest')}</span></div>
      </div>

      <div className="proj__split">
        <div>
          <Choice legend={t('pobreza.household')} options={HOGARES} value={hogar} onChange={setHogar} label={(v) => t(`hogar.${v}`)} />
          <Choice<Tenencia> legend={t('pobreza.tenure')} options={TENENCIAS} value={tenencia} onChange={setTenencia} label={(v) => t(`tenencia.${v}`)} />
        </div>
        <div className="proj__result">
          <p className="proj__eyebrow">{t('pobreza.of100')}</p>
          <People rate={rate} />
          <p className="proj__big" data-testid="arope-tasa" aria-live="polite">
            {cell && cell.suficiente && rate !== null ? (
              <>
                <strong>{formatPct(rate, locale)}</strong> {t('pobreza.result')}
              </>
            ) : (
              t('pobreza.insufficient')
            )}
          </p>
        </div>
      </div>

      <p className="proj__note">{t('pobreza.method')} {t('pobreza.source')}</p>
    </div>
  )
}
