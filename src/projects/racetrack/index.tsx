import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { STOPS } from '../../content/stops'
import { useI18n } from '../../i18n'
import { formatInt } from '../../lib/format'
import { carreras, resultados, TALLAS, type Carrera } from './mockData'
import '../projects.css'
import './racetrack.css'

type Distancia = 'all' | 5 | 10 | 21 | 42
const FILTROS: Distancia[] = ['all', 5, 10, 21, 42]
const distLabel = (d: Distancia) => (d === 42 ? 'Maratón' : d === 21 ? '21K' : `${d}K`)

// Proyección lineal muy simple de la península para el mapa de la demo.
const toMap = (lon: number, lat: number) => ({ x: ((lon + 9.5) / 13) * 100, y: ((43.9 - lat) / 8) * 100 })
const PENINSULA = 'M10,8 L32,4 L58,6 L78,12 L92,24 L86,40 L74,52 L70,66 L60,82 L44,96 L28,94 L16,84 L18,66 L8,50 L6,30 Z'

function Buscar({ onPick }: { onPick(c: Carrera): void }) {
  const { t } = useI18n()
  const locale = t('fmt.locale')
  const [filtro, setFiltro] = useState<Distancia>('all')
  const lista = carreras.filter((c) => filtro === 'all' || c.distanciaKm === filtro)
  return (
    <div className="rt-search">
      <div className="rt-filters" role="group">
        {FILTROS.map((f) => (
          <button key={f} type="button" className={f === filtro ? 'is-on' : undefined} aria-pressed={f === filtro} onClick={() => setFiltro(f)}>
            {f === 'all' ? t('rt.all') : distLabel(f)}
          </button>
        ))}
      </div>
      <svg className="rt-map" viewBox="0 0 100 100" aria-hidden>
        <path d={PENINSULA} />
        {lista.map((c) => {
          const p = toMap(c.lon, c.lat)
          return <circle key={c.id} cx={p.x} cy={p.y} r={2.6} />
        })}
      </svg>
      <ul className="rt-list" aria-label={t('rt.races')}>
        {lista.map((c) => {
          const libres = c.plazas - c.inscritos
          return (
            <li key={c.id}>
              <div>
                <strong>{c.nombre}</strong>
                <span>
                  {c.ciudad} · {new Date(c.fecha).toLocaleDateString(locale, { day: 'numeric', month: 'short' })} · {distLabel(c.distanciaKm)}
                </span>
                <span className="rt-spots">{libres > 0 ? `${formatInt(libres, locale)} ${t('rt.spots')}` : t('rt.full')}</span>
              </div>
              <button type="button" className="rt-btn" onClick={() => onPick(c)} disabled={libres <= 0}>
                {t('rt.register')} · {c.precio} €
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Inscripcion({ carrera, onPaid, onBack }: { carrera: Carrera; onPaid(nombre: string): void; onBack(): void }) {
  const { t } = useI18n()
  const [nombre, setNombre] = useState('')
  const [talla, setTalla] = useState<string>('M')
  const [error, setError] = useState(false)
  return (
    <form
      className="rt-form"
      onSubmit={(e) => {
        e.preventDefault()
        if (nombre.trim().length < 3) return setError(true)
        onPaid(nombre.trim())
      }}
    >
      <h3>{t('rt.form.title')} · {carrera.nombre}</h3>
      <label>
        {t('rt.form.name')}
        <input value={nombre} onChange={(e) => { setNombre(e.target.value); setError(false) }} autoComplete="off" />
      </label>
      <label>
        {t('rt.form.shirt')}
        <select value={talla} onChange={(e) => setTalla(e.target.value)}>
          {TALLAS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>
        {t('rt.form.card')}
        <input value="4242 4242 4242 4242" readOnly />
      </label>
      {error && <p role="alert" className="rt-error">{t('rt.form.nameError')}</p>}
      <div className="rt-row">
        <button type="button" className="rt-btn rt-btn--ghost" onClick={onBack}>{t('rt.form.back')}</button>
        <button type="submit" className="rt-btn">{t('rt.form.pay')} {carrera.precio} €</button>
      </div>
    </form>
  )
}

function Dorsal({ carrera, nombre, onAgain }: { carrera: Carrera; nombre: string; onAgain(): void }) {
  const { t } = useI18n()
  const numero = useMemo(() => 1000 + ((nombre.length * 97 + carrera.inscritos) % 8999), [nombre, carrera])
  const [svg, setSvg] = useState('')
  useEffect(() => {
    QRCode.toString(`RT-DEMO-${carrera.id}-${numero}`, { type: 'svg', margin: 0, color: { dark: '#0b2e1f', light: '#ffffff' } }).then(setSvg)
  }, [carrera, numero])
  return (
    <div className="rt-bibwrap">
      <p className="rt-paid">{t('rt.paid')}</p>
      <div className="rt-bib" data-testid="bib">
        <p className="rt-bib__race">{carrera.nombre} · {distLabel(carrera.distanciaKm)}</p>
        <p className="rt-bib__num">{numero}</p>
        <p className="rt-bib__name">{nombre}</p>
        <div className="rt-bib__qr">
          {svg && <img data-testid="bib-qr" src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} alt="" />}
          <span>{t('rt.bib.scan')}</span>
        </div>
      </div>
      <button type="button" className="rt-btn rt-btn--ghost" onClick={onAgain}>{t('rt.again')}</button>
    </div>
  )
}

function Resultados() {
  const { t } = useI18n()
  return (
    <div>
      <h3 className="rt-h3">{t('rt.results.title')}</h3>
      <table className="rt-table">
        <thead><tr><th>{t('rt.results.pos')}</th><th>{t('rt.results.name')}</th><th>{t('rt.results.cat')}</th><th>{t('rt.results.time')}</th></tr></thead>
        <tbody>
          {resultados.map((r) => (
            <tr key={r.posicion}><td>{r.posicion}</td><td>{r.nombre}</td><td>{r.categoria}</td><td>{r.tiempo}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type Pantalla = { id: 'buscar' } | { id: 'inscripcion'; carrera: Carrera } | { id: 'dorsal'; carrera: Carrera; nombre: string } | { id: 'resultados' }

export default function Project() {
  const { t } = useI18n()
  const locale = t('fmt.locale')
  const [p, setP] = useState<Pantalla>({ id: 'buscar' })
  const repo = STOPS.find((s) => s.id === 'racetrack')!.repo!
  return (
    <div className="rt-layout">
      <div className="rt-phone">
        <div className="rt-phone__bar">
          <span className="rt-logo" aria-hidden>RT</span> RaceTrack
        </div>
        <p className="rt-demo">{t('rt.demo')}</p>
        <div className="rt-tabs" role="group">
          <button type="button" aria-pressed={p.id !== 'resultados'} onClick={() => setP({ id: 'buscar' })}>{t('rt.tab.search')}</button>
          <button type="button" aria-pressed={p.id === 'resultados'} onClick={() => setP({ id: 'resultados' })}>{t('rt.tab.results')}</button>
        </div>
        <div className="rt-screen">
          {p.id === 'buscar' && <Buscar onPick={(carrera) => setP({ id: 'inscripcion', carrera })} />}
          {p.id === 'inscripcion' && (
            <Inscripcion carrera={p.carrera} onBack={() => setP({ id: 'buscar' })} onPaid={(nombre) => setP({ id: 'dorsal', carrera: p.carrera, nombre })} />
          )}
          {p.id === 'dorsal' && <Dorsal carrera={p.carrera} nombre={p.nombre} onAgain={() => setP({ id: 'buscar' })} />}
          {p.id === 'resultados' && <Resultados />}
        </div>
      </div>

      <aside className="rt-side">
        <p className="proj__eyebrow">{t('rt.side.title')}</p>
        <div className="stats">
          <div className="stat stat--hot"><strong>~{formatInt(66000, locale)}</strong><span>{t('rt.side.loc')}</span></div>
          <div className="stat"><strong>{formatInt(2165, locale)}</strong><span>{t('rt.side.tests')}</span></div>
          <div className="stat"><strong>57</strong><span>{t('rt.side.migrations')}</span></div>
          <div className="stat"><strong>32</strong><span>{t('rt.side.modules')}</span></div>
        </div>
        <p className="rt-stack">{t('rt.side.stack')}</p>
        <ul className="rt-points">
          <li>{t('rt.side.p1')}</li>
          <li>{t('rt.side.p2')}</li>
          <li>{t('rt.side.p3')}</li>
        </ul>
        <a className="btn btn--ghost" href={repo} target="_blank" rel="noreferrer">{t('rt.side.code')} →</a>
      </aside>
    </div>
  )
}
