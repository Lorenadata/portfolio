# Portfolio "la calle": plan de implementación

> **Para agentes:** SUB-SKILL OBLIGATORIA: usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea a tarea. Los pasos usan checkboxes (`- [ ]`).

**Objetivo:** publicar en `lorenamarcos.dev`, antes del 15/11/2026, una web en la que se avanza por una calle nocturna fotorrealista con profundidad 3D, cada negocio es un proyecto interactivo de Lorena, y un Recruiter Mode da acceso directo a todo.

**Arquitectura:** SPA estática (Vite + React + TypeScript). Cada tramo de calle es una imagen fotorrealista con su mapa de profundidad, renderizada en Three.js (React Three Fiber) como malla desplazada. La cámara se mueve dentro de ella y viaja al siguiente tramo. Los rótulos de neón, la lluvia y la interfaz son capas de código encima. Los proyectos se abren en una capa interactiva cargada bajo demanda y leen JSON precalculados por scripts de R. No hay backend.

**Stack:** Vite 5, React 18, TypeScript, three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, Vitest + Testing Library, qrcode, R 4.6.1 (scripts de exportación) y Python 3 + transformers (mapas de profundidad, solo offline). Despliegue en Vercel.

**Spec:** `docs/superpowers/specs/2026-10-26-portfolio-calle-design.md` (leer entera antes de empezar).

## Restricciones globales

- Fecha de publicación: **15/11/2026**. Si no da tiempo, **se quitan paradas** (`enabled: false`) en orden inverso de prioridad: primero Fiscalis, luego Alquiler, luego Cómo se hizo. Nunca se publica una parada a medias ni un local "próximamente".
- Prioridad de paradas: 1 RaceTrack · 2 Recruiter Mode, Sobre mí, Contacto · 3 Pobreza infantil · 4 Ride-sharing · 5 Cómo se hizo · 6 Alquiler · 7 Fiscalis.
- **Nada inventado sobre Lorena**: solo cifras reales o calculadas con un script reproducible. La web no menciona el modelo XGBoost hasta que esté publicado en GitHub (plan aparte).
- La réplica de RaceTrack usa **datos inventados**, no hace ninguna llamada de red a producción y **no copia código** de `C:\Users\Usuario\racetrack-app`.
- Idiomas ES y EN: inglés por defecto, español si `navigator.language` empieza por `es`. **Ningún texto visible fuera de `src/i18n/{es,en}.json`.**
- Acento de la interfaz: turquesa `#2dd4bf`. Tipografía de marca: serif en mayúsculas espaciadas (Cormorant Garamond); interfaz: Inter.
- Rótulos de neón dibujados por código, nunca pintados en la imagen.
- CV: `public/cv/Lorena_Marcos_CV_EN.pdf`, copiado de `C:\Users\Usuario\OneDrive\Documentos\CIENCIA DE DATOS\portfolio web\CV Lorena Marcos EN.pdf`. **Antes de publicar, preguntar a Lorena si se publica con el teléfono** o si aporta una versión sin él.
- Foto de Lorena solo en "Sobre mí".
- Presupuestos (decisión del plan): JS inicial ≤ 450 KB gzip; cada imagen de escena ≤ 400 KB (WebP) en escritorio y ≤ 200 KB en móvil; primera escena visible en ≤ 4 s con red "Fast 4G"; Lighthouse móvil en `#/recruiter`: rendimiento ≥ 90 y accesibilidad ≥ 95.

## Puntos a vigilar en la revisión

1. **Red lenta o imágenes que no llegan:** la pantalla de carga nunca atrapa al visitante. A los 6 s ofrece "Ir al Recruiter Mode" (test en la Tarea 7).
2. **Sin WebGL, pérdida del contexto WebGL o `prefers-reduced-motion`:** se pasa al Recruiter Mode sin pantalla en blanco (tests en las Tareas 2 y 8).
3. **Móvil en vertical con gestos:** deslizar arriba o abajo avanza o retrocede, y los toques en botones no cuentan como gesto (test en la Tarea 5).
4. **Enlace directo a un proyecto inexistente o desactivado** (`#/p/fiscalis` con Fiscalis recortado): se vuelve a la calle sin errores (test en la Tarea 2).
5. **`localStorage` que lanza excepción** (modo privado): el idioma funciona igual (test en la Tarea 4).

---

## Estructura de archivos

```
portfolio/
  analysis/                       # Scripts R de exportación → public/data/*.json
    export_arope.R  export_alquiler.R  export_ridesharing.R  README.md
  tools/depth/make_depth.py       # imagen → mapa de profundidad (offline)
  docs/prompts-imagenes.md        # prompts para ChatGPT
  docs/como-funciona.md           # explicación para Lorena
  public/scenes/<sceneId>/{color.webp,color-m.webp,depth.png}
  public/data/*.json  public/cv/  public/img/lorena.webp
  src/
    main.tsx  App.tsx
    lib/route.ts  lib/capabilities.ts  lib/storage.ts
    i18n/es.json  i18n/en.json  i18n/index.tsx
    content/stops.ts
    world/scenes.ts  world/walk.ts  world/useWalkInput.ts
    world/StreetCanvas.tsx  world/DepthScene.tsx  world/depthMaterial.ts
    world/NeonSign.tsx  world/Rain.tsx  world/CameraRig.tsx
    ui/Brand.tsx  ui/TopBar.tsx  ui/ProjectCard.tsx  ui/Minimap.tsx
    ui/WalkControl.tsx  ui/Quote.tsx  ui/Loader.tsx  ui/LangToggle.tsx
    overlay/ProjectOverlay.tsx  overlay/useFocusTrap.ts
    recruiter/RecruiterMode.tsx
    projects/<stopId>/index.tsx   # uno por parada, cargado con React.lazy
  tests/  (junto a cada archivo: *.test.ts(x))
```

---

### Tarea 1: Prompts de imágenes para Lorena (día 1)

**Archivos:** crear `docs/prompts-imagenes.md`.

- [ ] **Paso 1:** escribir un **bloque de estilo base** que se repite en cada prompt, sacado de `docs/reference/version1.png`: noche, lluvia reciente, asfalto mojado con reflejos, Manhattan inventado, ventanas cálidas doradas, farolas de globo, fotografía de 35 mm a la altura de los ojos, formato 16:9 en máxima resolución, **todos los letreros en blanco o apagados, sin texto legible**, y zona segura central del 56 % del ancho para recortar en vertical.
- [ ] **Paso 2:** escribir un prompt por escena con los negocios y su posición en el encuadre:
  - `llegada`: el edificio principal a la derecha, con la puerta en arco iluminada (RaceTrack, salida de carrera), boca de metro a la izquierda y rascacielos al fondo, como en la referencia.
  - `escuela-taxis`: un colegio con patio o parque infantil y una parada de taxis con taxis amarillos.
  - `alquiler-gestoria`: una inmobiliaria con carteles "se alquila" sin texto y una gestoría con escaparate de oficina.
  - `facultad-taller`: la fachada de una facultad clásica y un taller o estudio de diseño con mesas y pantallas.
  - `plaza-buzon`: el final de la calle, una plaza con un buzón de correos clásico en primer plano.
  - `interior`: interior cálido y desenfocable, fondo para las capas de proyecto.
- [ ] **Paso 3:** añadir instrucciones para Lorena: cómo pedir variaciones si un encuadre no sirve, cómo descargar a máxima resolución y dónde dejar los archivos (`public/scenes/<sceneId>/original.png`).
- [ ] **Paso 4:** commit `docs: prompts de imágenes para las escenas` y **entregar el documento a Lorena**.

### Tarea 2: Proyecto base, rutas y capacidades

**Archivos:** crear el proyecto Vite React TS en la raíz (`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`), `src/lib/route.ts`, `src/lib/capabilities.ts` y sus tests.

**Interfaces producidas:**
- `type Route = {view:'street'} | {view:'recruiter'} | {view:'project'; id: StopId}`
- `parseRoute(hash: string, enabled: StopId[]): Route` · `toHash(r: Route): string` · `useRoute(): [Route, (r: Route) => void]`
- `canRender3D(env: {webgl: boolean; reducedMotion: boolean}): boolean`
- `detectQuality(env: {dpr: number; cores: number; mobile: boolean}): 'high' | 'low'`
- `hasWebGL(): boolean` (navegador)

- [ ] **Paso 1:** crear el proyecto (`npm create vite@5 . -- --template react-ts`), instalar las dependencias del stack, configurar Vitest con jsdom y añadir los scripts `test`, `build` y `typecheck`.
- [ ] **Paso 2: tests**
  ```ts
  expect(parseRoute('', ids)).toEqual({view:'street'})
  expect(parseRoute('#/recruiter', ids)).toEqual({view:'recruiter'})
  expect(parseRoute('#/p/racetrack', ids)).toEqual({view:'project', id:'racetrack'})
  expect(parseRoute('#/p/fiscalis', ids.filter(i=>i!=='fiscalis'))).toEqual({view:'street'})
  expect(parseRoute('#/p/<script>', ids)).toEqual({view:'street'})
  expect(canRender3D({webgl:false, reducedMotion:false})).toBe(false)
  expect(canRender3D({webgl:true, reducedMotion:true})).toBe(false)
  expect(detectQuality({dpr:3, cores:4, mobile:true})).toBe('low')
  expect(detectQuality({dpr:2, cores:8, mobile:false})).toBe('high')
  ```
- [ ] **Paso 3:** comprobar que fallan con `npx vitest run src/lib`.
- [ ] **Paso 4:** implementarlos. `low` si es móvil o `cores < 6`.
- [ ] **Paso 5:** comprobar que `npx vitest run` y `npm run typecheck` pasan.
- [ ] **Paso 6:** commit `feat: base del proyecto, rutas y capacidades`.

### Tarea 3: Mapas de profundidad y escenas provisionales

**Archivos:** crear `tools/depth/make_depth.py` y `tools/depth/requirements.txt`, y crear `public/scenes/*/` con imágenes provisionales.

- [ ] **Paso 1:** crear un venv en `tools/depth/.venv` (ignorado en git) con `torch` (CPU), `transformers` y `pillow`.
- [ ] **Paso 2:** implementar `make_depth.py <entrada.png> <carpeta_salida>`. Usa `depth-anything/Depth-Anything-V2-Small-hf` y escribe:
  - `depth.png`: escala de grises de 8 bits, blanco = cerca, misma relación de aspecto.
  - `color.webp`: 2560 px de ancho, calidad 80.
  - `color-m.webp`: recorte vertical centrado en la zona segura del 56 %, 1080 px de ancho.

  Tiene que fallar con un mensaje claro si la imagen no es 16:9 (±2 %).
- [ ] **Paso 3:** generar las 5 escenas provisionales a partir de `docs/reference/version1.png`, con recortes distintos de la misma imagen para que se noten los cambios de escena, y comprobar que los tamaños cumplen el presupuesto.
- [ ] **Paso 4:** commit `feat: herramienta de profundidad y escenas provisionales`.

### Tarea 4: Idiomas y contenido de las paradas

**Archivos:** crear `src/lib/storage.ts`, `src/i18n/index.tsx`, `src/i18n/es.json`, `src/i18n/en.json` y `src/content/stops.ts`, con sus tests.

**Interfaces producidas:**
- `safeGet(key: string): string | null` · `safeSet(key: string, v: string): void` (nunca lanzan excepciones)
- `type Lang = 'es' | 'en'` · `detectLang(navLang: string, stored: string | null): Lang`
- `I18nProvider` · `useI18n(): {lang: Lang; setLang(l: Lang): void; t(key: string): string}`
- `type StopId = 'racetrack'|'about'|'contact'|'pobreza'|'ridesharing'|'making-of'|'alquiler'|'fiscalis'`
- `interface Stop {id: StopId; sceneId: SceneId; priority: number; neon: string; repo?: string; report?: string; enabled: boolean}`
- `STOPS: Stop[]` en orden de calle · `activeStops(stops?: Stop[]): Stop[]`

- [ ] **Paso 1: tests**
  - `detectLang('es-ES', null) === 'es'`, `detectLang('en-US', null) === 'en'`, `detectLang('fr', null) === 'en'` y `detectLang('es', 'en') === 'en'` (lo guardado manda).
  - Con `localStorage.getItem` lanzando una excepción, `safeGet('lang') === null`.
  - **Mismas claves:** el conjunto de claves de `es.json` es igual al de `en.json` y ningún valor está vacío.
  - Cada `Stop` tiene `name.<id>`, `tagline.<id>` y `sign.<id>` en los dos idiomas.
  - `activeStops()` excluye las paradas desactivadas y mantiene el orden.
  - `STOPS.find(s=>s.id==='racetrack').sceneId === 'llegada'`.
- [ ] **Paso 2:** comprobar que fallan.
- [ ] **Paso 3:** implementarlos. Orden de calle y escenas: `llegada` (racetrack) → `escuela-taxis` (pobreza, ridesharing) → `alquiler-gestoria` (alquiler, fiscalis) → `facultad-taller` (about, making-of) → `plaza-buzon` (contact). Repos e informes: las URLs de la spec, §5. Colores de neón: racetrack `#2dd4bf`, pobreza `#a78bfa`, ridesharing `#fb923c`, alquiler `#60a5fa`, fiscalis `#4ade80`, about `#f472b6`, making-of `#facc15`, contact `#f87171`. Textos: los de la spec, §5. Lema y cita: **propuestas marcadas `// PENDIENTE APROBACIÓN LORENA`**.
- [ ] **Paso 4:** comprobar que pasan.
- [ ] **Paso 5:** commit `feat: idiomas y contenido de las paradas`.

### Tarea 5: Avanzar por la calle (lógica y controles)

**Archivos:** crear `src/world/walk.ts` y `src/world/useWalkInput.ts`, con sus tests.

**Interfaces producidas:**
- `interface WalkState {index: number; phase: 'idle' | 'moving'}`
- `type WalkAction = {type:'next'} | {type:'prev'} | {type:'goto'; index: number} | {type:'arrived'}`
- `walkReducer(s: WalkState, a: WalkAction, count: number): WalkState`
- `swipeToAction(dx: number, dy: number): 'next' | 'prev' | null` (umbral de 40 px; domina el eje vertical)
- `useWalkInput(dispatch)`: flechas, WASD, rueda con debounce de 600 ms y swipe; ignora eventos dentro de `input`, `button` y overlays.

- [ ] **Paso 1: tests**
  - `next` desde 0 → `{index:1, phase:'moving'}`.
  - `next` mientras está en `moving` → no cambia nada.
  - `next` en la última parada → no cambia nada; `prev` en la 0 → no cambia nada.
  - `goto` con un índice fuera de rango → no cambia nada.
  - `arrived` → `phase:'idle'`.
  - `swipeToAction(0,-60) === 'next'`, `swipeToAction(0,20) === null` y `swipeToAction(80,10) === null`.
- [ ] **Paso 2:** comprobar que fallan. **Paso 3:** implementarlos. **Paso 4:** comprobar que pasan.
- [ ] **Paso 5:** commit `feat: navegación por paradas`.

### Tarea 6: La calle en 3D

**Archivos:** crear `src/world/scenes.ts`, `depthMaterial.ts`, `DepthScene.tsx`, `NeonSign.tsx`, `Rain.tsx`, `CameraRig.tsx` y `StreetCanvas.tsx`.

**Interfaces:**
- `type SceneId = 'llegada'|'escuela-taxis'|'alquiler-gestoria'|'facultad-taller'|'plaza-buzon'`
- `interface SignAnchor {stopId: StopId; u: number; v: number; width: number; rotY: number}` (u y v en coordenadas de 0 a 1 sobre la imagen)
- `interface SceneDef {id: SceneId; signs: SignAnchor[]; depthScale: number}` · `SCENES: SceneDef[]`
- `<StreetCanvas walk={WalkState} onArrived={() => void} focusedStop={StopId|null} quality={'high'|'low'} />`
- `anchorToWorld(a: SignAnchor, depthAt: (u,v)=>number, scale: number): [x, y, z]` (función pura, con test)

- [ ] **Paso 1: test** de `anchorToWorld`: u=0.5, v=0.5 con profundidad 1 queda en x=0 y en la z más cercana; u=0 queda en x negativa; si se aumenta `depthScale`, aumenta |z|.
- [ ] **Paso 2:** comprobar que falla, implementarlo y comprobar que pasa.
- [ ] **Paso 3: `DepthScene`.** Plano subdividido (256×144 en calidad high, 128×72 en low) desplazado en el vertex shader según `depth.png`. Los bordes con saltos fuertes de profundidad se suavizan para evitar estiramientos.
- [ ] **Paso 4: `CameraRig`.** En `idle`, la cámara deriva levemente con el ratón o el giroscopio (±3°). En `moving`: dolly hacia el punto de fuga de 1,6 s con easing, fundido cruzado a la escena siguiente y llamada a `onArrived`.
- [ ] **Paso 5: `NeonSign`.** Texto con `drei/Text` y bloom. Animación de encendido al llegar a la escena, parpadeo aleatorio y más intensidad cuando el proyecto está enfocado.
- [ ] **Paso 6: `Rain`.** Partículas instanciadas (2.000 en high, 0 en low).
- [ ] **Paso 7:** si se pierde el contexto WebGL (`webglcontextlost`), se navega a `#/recruiter`.
- [ ] **Paso 8: verificación manual** con `npm run dev`: se recorren las 5 escenas con teclado y ratón, los rótulos están bien colocados sobre las fachadas, no hay estiramientos graves y se mantienen 60 fps en el portátil de Lorena (panel de rendimiento de Chrome).
- [ ] **Paso 9:** commit `feat: calle con profundidad, neones y lluvia`.

### Tarea 7: Interfaz sobre la calle

**Archivos:** crear `src/ui/*.tsx` (Brand, TopBar, ProjectCard, Minimap, WalkControl, Quote, Loader, LangToggle) y montarlos en `App.tsx`.

**Interfaces:** `<ProjectCard stop={Stop} onEnter={() => void} />` · `<Minimap stops={Stop[]} current={number} onGo={(i) => void} />` · `<Loader progress={number} onSkip={() => void} skipAfterMs={6000} />`

- [ ] **Paso 1: tests**
  - `Loader` no muestra el botón de saltar a los 5.999 ms y sí a los 6.000 ms (timers falsos).
  - `ProjectCard` muestra el nombre, la frase, el enlace a GitHub con el `repo` correcto y el botón Enter.
  - `Minimap` muestra solo las paradas activas y al hacer clic llama a `onGo` con el índice.
  - `TopBar` enlaza a `#/recruiter`, al CV, a GitHub y a LinkedIn.
- [ ] **Paso 2:** comprobar que fallan. **Paso 3:** implementarlos con el diseño de `docs/reference/version1.png`: marca arriba a la izquierda, menú y botón Recruiter Mode arriba a la derecha, tarjeta de cristal (`backdrop-filter`), minimapa circular abajo a la izquierda, "Walk to explore" abajo en el centro y cita abajo a la derecha. En móvil: barra superior compacta, tarjeta abajo a ancho completo y minimapa dentro del menú. **Paso 4:** comprobar que pasan.
- [ ] **Paso 5: verificación visual** en el navegador, poniendo una captura al lado de `version1.png` a 1440 px y a 390 px.
- [ ] **Paso 6:** commit `feat: interfaz superpuesta`.

### Tarea 8: Recruiter Mode y alternativa sin 3D

**Archivos:** crear `src/recruiter/RecruiterMode.tsx` y su test; modificar `App.tsx`.

- [ ] **Paso 1: tests**
  - Muestra el nombre, lo que busca Lorena (prácticas de Data Science / Analytics desde febrero de 2027), una tarjeta por cada parada de proyecto activa con su resultado clave y sus enlaces (Enter, código, informe), un enlace al CV con `href="/cv/Lorena_Marcos_CV_EN.pdf"`, un `mailto:` y el enlace de LinkedIn.
  - Con `canRender3D` en falso, `App` renderiza el Recruiter Mode y no el canvas.
  - Desde la calle, el CV queda a 2 clics: el botón Recruiter Mode y después el enlace al CV visible sin hacer scroll en una pantalla de 1366×768.
- [ ] **Paso 2:** comprobar que fallan. **Paso 3:** implementarlos con HTML semántico, sin three.js en este bundle (que se cargue sin el chunk 3D). **Paso 4:** comprobar que pasan.
- [ ] **Paso 5:** commit `feat: recruiter mode y alternativa sin WebGL`.

### Tarea 9: Capa de proyecto

**Archivos:** crear `src/overlay/ProjectOverlay.tsx`, `src/overlay/useFocusTrap.ts` y `src/projects/<id>/index.tsx` (un esqueleto por parada).

**Interfaces:** `<ProjectOverlay id={StopId} onClose={() => void} />`, que carga `projects/<id>/index.tsx` con `React.lazy`. Cada proyecto exporta `default function Project(): JSX.Element`.

- [ ] **Paso 1: tests**
  - Al abrirla, el foco pasa al título.
  - Tab no sale de la capa.
  - Escape llama a `onClose` y el foco vuelve al botón que la abrió.
  - La ruta `#/p/racetrack` abre la capa al cargar la página.
  - Al cerrar se vuelve a `#/` en la misma parada.
- [ ] **Paso 2:** comprobar que fallan. **Paso 3:** implementarlos: calle desenfocada detrás (CSS `filter` sobre el canvas) y fondo `interior`. **Paso 4:** comprobar que pasan.
- [ ] **Paso 5:** commit `feat: capa de proyecto con carga diferida`.

### Tarea 10: Exportar los datos desde R

**Archivos:** crear `analysis/export_arope.R`, `analysis/export_alquiler.R`, `analysis/export_ridesharing.R` y `analysis/README.md`; salida en `public/data/`.

**Interfaces producidas (JSON):**
- `arope.json`: `{general: {menores: number, resto: number}, celdas: [{tiphogar: string, tenencia: 'alquiler'|'no_alquiler', tasa: number|null, n: number, suficiente: boolean}]}`. Solo hogares con menores de 16 años; `suficiente = n >= 50` (n sin ponderar); si no es suficiente, `tasa = null`.
- `alquiler.json`: `{mediana: number, inquilinos: {pct_poblacion, pct_baja, renta_media, p10, p50, p90}, no_inquilinos: {…}, caseros: {pct_poblacion, pct_alta, p10, p50, p90, ratio_p90_p10}}`.
- `limpieza.json`: `{pasos: [{id: 'original'|'nulos'|'duplicados'|'outliers_iqr'|'outliers_lof', filas: number, marcadas: number}]}`.
- `lof.json`: `[{x, y, z, outlier: boolean}]`, con 3.000 puntos muestreados con semilla 2026 sobre las 3 primeras componentes principales.

- [ ] **Paso 1:** cada script termina con comprobaciones (`stopifnot`) de los valores ya publicados, que actúan como test:
  - AROPE: `round(menores,2) == 34.72` y `round(resto,2) == 24.31`.
  - Alquiler: mediana `19307` (±1).
  - Ride-sharing: `filas == 150000` en el paso `original`; `marcadas == 2457` en `duplicados`.
- [ ] **Paso 2:** ejecutarlos con `Rscript analysis/export_*.R`. Esperado: termina sin error y genera los JSON. Los datos de entrada son los `ECVpersona.RData` de los repos de la ECV (clonarlos a `C:\Users\Usuario\` si no están) y el CSV de `C:\Users\Usuario\Downloads\Estudio y depuración de datos\Depuración de datos\archive\ncr_ride_bookings.csv`. Las rutas se pasan como argumentos y nunca se copian los microdatos a `portfolio/`.
- [ ] **Paso 3:** test de Vitest `src/projects/data.test.ts`: cada JSON cumple su forma, ninguna celda con `suficiente:false` tiene tasa y `lof.json` tiene 3.000 puntos.
- [ ] **Paso 4:** commit `feat: datos exportados desde R`.

### Tarea 11: Parada "Pobreza infantil"

**Archivos:** `src/projects/pobreza/index.tsx`, `src/projects/pobreza/arope.ts` y su test.

**Interfaces:** `lookupArope(data, tiphogar: string, tenencia): {tasa: number|null; suficiente: boolean} | undefined`

- [ ] **Paso 1: tests:** la búsqueda devuelve la celda correcta; con una combinación insuficiente devuelve `{tasa:null, suficiente:false}`; el componente muestra "muestra insuficiente" en ese caso y nunca un número.
- [ ] **Paso 2:** comprobar que fallan. **Paso 3:** implementarlo: el visitante elige el tipo de hogar y la tenencia, y ve una cuadrícula de 100 figuras que se rellena con la tasa, comparada con el 34,7 % general y el 24,3 % del resto. Enlaces al repo y al informe. **Paso 4:** comprobar que pasan.
- [ ] **Paso 5:** commit `feat: parada pobreza infantil`.

### Tarea 12: Parada "RaceTrack" (réplica)

**Archivos:** `src/projects/racetrack/index.tsx`, `mockData.ts`, `screens/{Buscar,Inscripcion,Dorsal,Resultados}.tsx` y `racetrack.test.tsx`.

**Interfaces:** `mockData.ts` exporta `carreras: Carrera[]` (8 carreras inventadas en ciudades españolas, con fecha, distancia, precio, plazas y coordenadas) y `resultados: Resultado[]`.

- [ ] **Paso 1: tests**
  - Filtrar por distancia reduce la lista.
  - El flujo de inscripción (elegir carrera → formulario → "pagar" con una pasarela simulada) termina en un dorsal con QR.
  - **Ninguna petición de red:** con `fetch` espiado, ningún flujo lo llama.
  - Hay un aviso visible de "Demo con datos ficticios".
- [ ] **Paso 2:** comprobar que fallan. **Paso 3:** implementarlo con pantallas recreadas desde cero inspirándose en el aspecto de la app real (mirar capturas, no copiar código), un mapa SVG estilizado, QR con `qrcode` y, a la derecha, el panel de arquitectura y las cifras de la spec (≈66.000 líneas, 2.165 tests, 57 migraciones). **Paso 4:** comprobar que pasan.
- [ ] **Paso 5:** commit `feat: parada racetrack con réplica de demostración`.

### Tarea 13: Parada "Ride-sharing"

**Archivos:** `src/projects/ridesharing/index.tsx`, `LofCloud.tsx` y su test.

- [ ] **Paso 1: tests:** al activar los pasos en orden, el contador muestra las `filas` y `marcadas` de `limpieza.json`; el texto **no menciona** XGBoost ni ninguna predicción.
- [ ] **Paso 2:** comprobar que fallan. **Paso 3:** implementarlo: interruptores por paso de limpieza y nube 3D de `lof.json` (outliers en naranja, rotable). En calidad low es un gráfico 2D. **Paso 4:** comprobar que pasan.
- [ ] **Paso 5:** commit `feat: parada ride-sharing`.

### Tarea 14: Sobre mí, Contacto y Cómo se hizo

**Archivos:** `src/projects/{about,contact,making-of}/index.tsx` y `public/img/lorena.webp` (recorte de la foto del CV, ≤ 60 KB).

- [ ] **Paso 1:** **preguntar a Lorena**, en un solo mensaje:
  - (a) Para "Cómo se hizo": qué le sorprendió, qué decidió ella, qué cambiaría y cómo usó la IA.
  - (b) Si aprueba el lema y la cita propuestos.
  - (c) Si el CV se publica con su teléfono.

  Usar solo sus respuestas.
- [ ] **Paso 2: tests:** Contacto tiene `mailto:lorena.loremarcos@gmail.com`, LinkedIn, GitHub y el CV; Sobre mí muestra la foto con `alt`; no hay ningún texto fuera de i18n.
- [ ] **Paso 3:** implementarlas. "Cómo se hizo" incluye la línea de tiempo del proyecto, las decisiones (fotorrealismo frente a 3D libre, neones por código, sin backend) y las herramientas.
- [ ] **Paso 4:** comprobar que los tests pasan y hacer commit `feat: paradas sobre mí, contacto y cómo se hizo`.

### Tarea 15: Parada "Alquiler" (prioridad 6, recortable)

- [ ] Test: los dos grupos muestran los valores de `alquiler.json` y el ratio P90/P10 tiene un decimal.
- [ ] Implementarla en `src/projects/alquiler/index.tsx`: barras de distribución P10/P50/P90 de inquilinos frente a caseros y conmutador "clase baja / clase alta".
- [ ] Comprobar los tests y hacer commit `feat: parada alquiler`.

### Tarea 16: Parada "Fiscalis" (prioridad 7, recortable)

**Interfaces:** `calcularFactura(base: number, iva: 0|4|10|21, retencion: 0|7|15): {base, iva, retencion, total}` en `src/projects/fiscalis/factura.ts` (redondeo a céntimos).

- [ ] Tests: `calcularFactura(1000,21,15)` devuelve `{base:1000, iva:210, retencion:150, total:1060}` y `calcularFactura(99.99,21,0).iva === 21`. Una base negativa o que no sea un número lanza un error y el formulario lo muestra.
- [ ] Implementarlo: formulario de factura y animación del recorrido por las tablas `usuario → perfil_fiscal → actividad → cliente → factura → factura_linea → obligacion_fiscal → alerta`.
- [ ] Comprobar los tests y hacer commit `feat: parada fiscalis`.

### Tarea 17: Imágenes definitivas (cuando las entregue Lorena)

- [ ] Por cada imagen recibida: ejecutar `make_depth.py`, reajustar `SignAnchor` en `scenes.ts` sobre las fachadas reales y repetir la verificación manual de la Tarea 6, Paso 8.
- [ ] Si una imagen no sirve (fachada mal colocada, texto pintado, recorte vertical roto), escribir a Lorena un ajuste concreto del prompt.
- [ ] Commit por escena: `feat: escena <id> definitiva`.

### Tarea 18: Predicción en Ride-sharing (solo si el plan XGBoost está publicado)

- [ ] Requisito previo: el modelo está publicado en `github.com/Lorenadata/ncr-ride-sharing-eda` y existe `public/data/cancelacion.json` (lo exporta ese plan).
- [ ] Tests: la interacción muestra la probabilidad de la combinación elegida y las métricas reales de test (PR-AUC del modelo frente a la línea base) leídas del JSON, sin cifras escritas a mano.
- [ ] Implementarla, quitar la aserción "no menciona XGBoost" de la Tarea 13 y hacer commit `feat: predicción de cancelaciones`.

### Tarea 19: Documentación

- [ ] `docs/como-funciona.md`, en lenguaje claro para Lorena: las piezas, el recorrido de un clic, por qué profundidad en vez de 3D libre, cómo se generaron las imágenes y su profundidad, y de dónde sale cada dato.
- [ ] `README.md` en inglés con captura, demo, stack y cómo ejecutarlo.
- [ ] Commit `docs: cómo funciona y README`.

### Tarea 20: Publicación y QA final

- [ ] **Paso 1:** comprobar que `npm run build` funciona y que el JS inicial pesa ≤ 450 KB gzip (`npx vite-bundle-visualizer`, o los tamaños que imprime el build).
- [ ] **Paso 2:** QA con la skill `/qa` (gstack) a 1440×900 y 390×844:
  - recorrer todas las paradas activas;
  - Recruiter Mode;
  - enlace directo `#/p/<id>`;
  - sin WebGL (`--disable-webgl`);
  - con `prefers-reduced-motion`;
  - red "Fast 4G": primera escena en ≤ 4 s y botón de saltar a los 6 s;
  - Lighthouse móvil en `#/recruiter`: rendimiento ≥ 90 y accesibilidad ≥ 95.
- [ ] **Paso 3:** crear el repo público `Lorenadata/portfolio` y hacer push.
- [ ] **Paso 4:** Lorena inicia sesión (`! npx vercel login`) y se despliega con `npx vercel --prod`. Ella compra `lorenamarcos.dev` y se configura el DNS (registro A/CNAME que indique Vercel). Comprobar HTTPS.
- [ ] **Paso 5:** actualizar el README del perfil de GitHub y la bio con el enlace a la web.
- [ ] **Paso 6:** Lorena recorre la web y aprueba el resultado frente a `version1.png` y su explicación (criterios de la spec, §12).

---

## Calendario orientativo

| Fechas | Tareas |
|---|---|
| 27–28/10 | 1, 2, 3, 4 (prompts entregados a Lorena el 27) |
| 29/10–02/11 | 5, 6, 7, 8, 9 |
| 03–07/11 | 10, 11, 12, 13 |
| 08–11/11 | 14, 17 (imágenes definitivas), 15, 16 si hay tiempo |
| 12–14/11 | 18 si el modelo está listo, 19, 20 |
| **15/11** | Publicación |

Si el 11/11 las Tareas 15 o 16 no están terminadas, se ponen a `enabled: false` y salen después de la v1.
