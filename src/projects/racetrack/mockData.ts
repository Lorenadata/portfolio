// Datos inventados para la demo. Ninguna carrera, persona ni pago es real.
export interface Carrera {
  id: string
  nombre: string
  ciudad: string
  fecha: string // ISO
  distanciaKm: 5 | 10 | 21 | 42
  precio: number
  plazas: number
  inscritos: number
  lon: number
  lat: number
}

export const carreras: Carrera[] = [
  { id: 'c1', nombre: 'Carrera Nocturna del Retiro', ciudad: 'Madrid', fecha: '2027-03-13', distanciaKm: 10, precio: 18, plazas: 3000, inscritos: 2410, lon: -3.68, lat: 40.41 },
  { id: 'c2', nombre: 'Media de la Ría', ciudad: 'Bilbao', fecha: '2027-03-28', distanciaKm: 21, precio: 32, plazas: 2500, inscritos: 1890, lon: -2.93, lat: 43.26 },
  { id: 'c3', nombre: '5K Solidaria del Turia', ciudad: 'Valencia', fecha: '2027-04-04', distanciaKm: 5, precio: 10, plazas: 1500, inscritos: 640, lon: -0.38, lat: 39.47 },
  { id: 'c4', nombre: 'Maratón de la Giralda', ciudad: 'Sevilla', fecha: '2027-02-21', distanciaKm: 42, precio: 55, plazas: 9000, inscritos: 8120, lon: -5.98, lat: 37.39 },
  { id: 'c5', nombre: '10K Puerto de Málaga', ciudad: 'Málaga', fecha: '2027-04-18', distanciaKm: 10, precio: 16, plazas: 2000, inscritos: 1230, lon: -4.42, lat: 36.72 },
  { id: 'c6', nombre: 'Volta al Born', ciudad: 'Barcelona', fecha: '2027-05-09', distanciaKm: 10, precio: 20, plazas: 4000, inscritos: 3950, lon: 2.18, lat: 41.39 },
  { id: 'c7', nombre: 'Media del Pilar', ciudad: 'Zaragoza', fecha: '2027-05-23', distanciaKm: 21, precio: 28, plazas: 2200, inscritos: 980, lon: -0.88, lat: 41.65 },
  { id: 'c8', nombre: '5K Atlántica', ciudad: 'A Coruña', fecha: '2027-06-06', distanciaKm: 5, precio: 9, plazas: 1200, inscritos: 410, lon: -8.41, lat: 43.36 },
]

export interface Resultado {
  posicion: number
  nombre: string
  categoria: string
  tiempo: string
}

export const resultados: Resultado[] = [
  { posicion: 1, nombre: 'Laura Gil', categoria: 'F-Senior', tiempo: '00:34:12' },
  { posicion: 2, nombre: 'Marcos Vidal', categoria: 'M-Senior', tiempo: '00:34:40' },
  { posicion: 3, nombre: 'Irene Sanz', categoria: 'F-M40', tiempo: '00:35:05' },
  { posicion: 4, nombre: 'Pablo Ruiz', categoria: 'M-M35', tiempo: '00:35:51' },
  { posicion: 5, nombre: 'Nerea Ortiz', categoria: 'F-Senior', tiempo: '00:36:20' },
]

export const TALLAS = ['XS', 'S', 'M', 'L', 'XL'] as const
