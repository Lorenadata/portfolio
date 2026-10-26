# Portfolio de Lorena Marcos: "la calle", documento de diseño

Fecha: 26/10/2026 · Estado: borrador para aprobación
Referencia visual: [`docs/reference/version1.png`](../../reference/version1.png)

---

## 1. Intención

Lorena estudia el Grado en Ciencia de los Datos Aplicada en la UCM y busca **prácticas de Data Science / Analytics a partir de febrero de 2027**. Su GitHub ([github.com/Lorenadata](https://github.com/Lorenadata)) ya está ordenado; esta web tiene que hacer lo que un GitHub no puede: **sorprender**.

Lo que debe pensar quien la abra (con sus palabras): *"¿Cómo ha hecho esto? Necesito a esta persona."* Lorena quiere que se vea como **alguien que construye producto**, con proyectos reales e impacto real, no solo como alguien que entrega ejercicios de la universidad o modelos estadísticos.

La web es en sí misma la prueba. No *cuenta* que sabe construir: lo *demuestra* desde el primer segundo. También demuestra que sabe **dirigir herramientas de IA** para construir producto: la web se construye con IA y lo dice con orgullo (ver la parada "Cómo se hizo").

## 2. El concepto

Una **calle nocturna fotorrealista, inventada pero inspirada en Manhattan**: lluvia, asfalto mojado lleno de reflejos, rascacielos al fondo, taxis amarillos, farolas, gente, boca de metro. Cada **negocio de la calle es un proyecto**, con su rótulo de neón. El visitante **avanza por la acera de parada en parada** con movimiento de cámara 3D real dentro de imágenes fotorrealistas (profundidad y paralaje), mira los escaparates y **entra** en los proyectos.

La imagen de referencia `version1.png` (generada por Lorena con ChatGPT) es el listón de calidad visual y de la interfaz. **La web tiene que parecerse a esa imagen.**

## 3. Objetivos, no-objetivos y anti-objetivos

**Objetivos**
- Que la impresión visual y la interacción de los primeros 10 segundos produzcan ese "wow" y esa sensación de dopamina (palabras de Lorena).
- Que cada proyecto se abra **funcionando e interactivo**, no como una ficha con texto.
- Que un recruiter con prisa llegue a lo esencial (proyectos, CV y contacto) en **2 clics o menos**, gracias al Recruiter Mode.
- Que Lorena pueda **explicar en una entrevista cómo está hecha** (ver §11).
- Que esté publicada a **mediados de noviembre de 2026** (objetivo: 15/11/2026).

**No-objetivos (v1)**
- No hay ciudad 3D libre por la que caminar ni personaje animado en escena: se descartó a favor del fotorrealismo.
- No hay interiores 3D de los edificios: al entrar se abre una capa interactiva (§6). Los interiores son candidatos a la v2.
- No hay backend, base de datos ni cuentas de usuario.

**Anti-objetivos (aunque "funcione técnicamente", sería un fracaso si…)**
- …aparecen **proyectos que no existen** o un local con "próximamente". Nada inventado sobre Lorena.
- …la **RaceTrack de demo toca algo real**: producción, pagos o usuarios.
- …un recruiter **no encuentra el CV o el contacto**, o se cansa esperando a que cargue.
- …parece una plantilla, se ve barata o los colores son feos. Lorena rechazó explícitamente un estilo "cutre" y otro "demasiado técnico".
- …va mal o se rompe en el móvil.

## 4. Restricciones

- **Plazo:** unas 3 semanas desde el 26/10/2026.
- **Presupuesto:** Lorena paga el **dominio**. Por ahora no hay presupuesto para otros recursos: si algo de pago marcara una diferencia clara, se le propone con su precio y decide ella.
- **Imágenes:** las genera **Lorena con ChatGPT** a partir de **prompts que prepara quien construye**. Quien construye no tiene generador de imágenes.
- **Datos:** solo los resultados reales de sus análisis, sin cifras inventadas.

## 5. Proyectos y paradas (decidido por Lorena)

| Parada / negocio | Proyecto | Qué se hace dentro |
|---|---|---|
| **Edificio principal**, el de la puerta iluminada y proyecto destacado | **RaceTrack** | **Réplica con datos inventados** que se ve y se usa como la app real: buscar carreras en el mapa, inscribirse, ver el dorsal con QR y los resultados. Al lado, la arquitectura y las cifras reales (unas 66.000 líneas de código, 2.165 tests, 57 migraciones). |
| Colegio / parque infantil | Pobreza infantil (ECV 2024) | El visitante **construye un hogar** (tipo de hogar, alquiler o propiedad, número de hijos) y ve cómo cambia la tasa AROPE ponderada. Dato de cabecera: 34,7 % frente al 24,3 %. |
| Inmobiliaria con carteles "Se alquila" | Mercado del alquiler y desigualdad | Comparación de inquilinos y caseros: distribución de la renta, clases baja y alta y P90/P10. |
| Parada de taxis | Ride-sharing data quality (150.000 viajes) | **"Limpia tú los datos"**: se activa cada paso (nulos, duplicados, outliers) y se ve cómo cambian las filas. Nube 3D con los outliers LOF. |
| Gestoría | Fiscalis (modelo de datos) | Se **emite una factura de prueba** que calcula el IVA y el IRPF y se ve recorrer las tablas del modelo. |
| Facultad | Sobre Lorena | Quién es, qué estudia, qué busca y su CV descargable. |
| Taller / estudio | **Cómo se hizo esta web** | Cómo dirigió a la IA, las decisiones que tomó, lo que aprendió y las herramientas que usó. |
| Buzón de correos | Contacto | Email, LinkedIn, GitHub y CV. |

En cada proyecto de datos: botón **"Ver código"** (repo en GitHub) y enlace al **informe completo** (GitHub Pages).

Repos y enlaces existentes:
- RaceTrack: `github.com/Lorenadata/racetrack` (escaparate público; el código fuente es privado y está en `C:\Users\Usuario\racetrack-app`)
- `github.com/Lorenadata/pobreza_infantil_espana` → `lorenadata.github.io/pobreza_infantil_espana/`
- `github.com/Lorenadata/ECV-rental-market` → `lorenadata.github.io/ECV-rental-market/`
- `github.com/Lorenadata/ncr-ride-sharing-eda` → `lorenadata.github.io/ncr-ride-sharing-eda/`
- `github.com/Lorenadata/fiscalis-db`

## 6. La experiencia

1. **Carga.** Pantalla de carga atractiva (en sí misma forma parte del "wow") mientras llegan las imágenes de la primera parada.
2. **Llegada.** Primera vista de la calle, como en la referencia: interfaz superpuesta, neones encendiéndose y un toque de lluvia y vida (reflejos que se mueven, el taxi que pasa).
3. **Paseo.** "Walk to explore": con scroll, teclado (flechas/WASD), clic o deslizando el dedo, la cámara **avanza por la acera hasta la siguiente parada** con un movimiento de cámara cinematográfico. En cada parada se puede **mirar alrededor un poco** (paralaje con el ratón o el giroscopio).
4. **Escaparate.** Al pararse frente a un negocio, su neón se intensifica y aparece la **tarjeta de cristal** del proyecto: nombre, una frase, etiquetas de tecnologías, un mini diagrama, **Enter Project** y **View on GitHub**.
5. **Entrar.** Enter Project abre el proyecto en una **capa interactiva a pantalla casi completa**, con la calle desenfocada detrás. Al cerrarla se vuelve a la calle en el mismo punto.
6. **Minimapa.** Abajo a la izquierda: un plano con las paradas como puntos de color y la leyenda de proyectos. Al hacer clic en uno, la cámara viaja hasta él.

### Interfaz (de la referencia)
- Arriba a la izquierda: **LORENA MARCOS** · *Immersive Data Science Portfolio* y debajo un lema en mayúsculas espaciadas. El texto exacto lo propone quien construye y lo aprueba Lorena; el de la referencia ("Same data. A brighter tomorrow.") sirve de punto de partida.
- Arriba a la derecha: **Projects · CV · GitHub · LinkedIn**, el botón **Recruiter Mode** y el menú hamburguesa.
- Abajo a la derecha: una cita de Lorena con su firma.
- Selector de idioma ES/EN.

### Recruiter Mode
Siempre visible. Muestra una **página normal, rápida y accesible** con todo lo esencial: quién es, qué busca, los proyectos con sus resultados clave y enlaces (Enter, código, informe), CV y contacto. Debe funcionar aunque falle el 3D o el dispositivo sea lento, y es el destino automático si el navegador no soporta WebGL o el usuario tiene `prefers-reduced-motion`.

## 7. Estilo visual

- La referencia `version1.png` marca la estética: noche, lluvia, Manhattan cálido (ventanas doradas) y acentos de neón.
- **Color de acento de la interfaz: turquesa** (como en la referencia). Cada proyecto tiene su color de neón (en la referencia: violeta, azul, naranja y turquesa). *Decisión de Claude:* el traje granate de Lorena no se usa como color de interfaz para no romper la paleta de la referencia; se puede proponer como acento secundario.
- Tipografía: serif elegante en mayúsculas espaciadas para la marca y sans limpia para la interfaz, como en la referencia.
- **Rótulos de neón dibujados por código, no pintados en la imagen** (decisión de Claude, comunicada a Lorena): textos exactos, traducibles y animados (encenderse, parpadear, intensificarse al acercarse). Por eso las imágenes se generan con los letreros **en blanco o apagados**.

## 8. Las imágenes

- Las genera Lorena en ChatGPT. Quien construye entrega **un prompt por imagen** con un estilo base común: hora, lluvia, lente, gama de color y estilo arquitectónico, para que todas parezcan de la misma calle.
- Conjunto mínimo (estimación de Claude): **4–6 tramos de calle** que cubran las 8 paradas (un tramo puede mostrar 2 fachadas), cada uno con encuadre y punto de fuga pensados para la transición al siguiente, más **1–2 fondos de interior** para las capas de proyecto.
- Cada prompt indica dónde va cada negocio, que sus letreros estén en blanco y que no haya texto legible en la imagen.
- Las imágenes se procesan para obtener **mapas de profundidad** que dan el movimiento 3D. Quien construye elige la herramienta.
- Resolución y formato pensados para web (versiones de escritorio y móvil, formatos modernos comprimidos).
- Hay que prever **iteración**: es normal que alguna imagen haya que regenerarla. El plan reserva tiempo y da a Lorena instrucciones claras de qué pedir.

## 9. Cómo se construye (decisiones de Claude, comunicadas a Lorena)

- **React + Three.js** (vía React Three Fiber) para las escenas con profundidad, los neones, la lluvia y las transiciones. Es el estándar para 3D en la web y fácil de explicar.
- **Sin backend:** los resultados de los análisis en R se **exportan una vez a JSON** (scripts reproducibles en el repo) y la web los lee. Las interacciones de datos (§5) trabajan sobre esos agregados ponderados, no sobre los microdatos.
- **Réplica de RaceTrack:** reconstrucción ligera de los flujos clave con datos inventados, dentro de la web. Quien construye decide si reutiliza componentes del repo privado o recrea las pantallas. Ninguna llamada a la API real.
- **Idiomas:** inglés y español, con inglés por defecto salvo navegador en español. Todo el texto en ficheros de traducción desde el principio.
- **Rendimiento:** primera parada visible rápido y el resto cargando en segundo plano; calidad gráfica adaptada al dispositivo; versión móvil de verdad (gestos táctiles, encuadres verticales).
- **Accesibilidad:** navegable con teclado, textos alternativos, respeto a `prefers-reduced-motion` y contraste suficiente en la interfaz.
- **Publicación:** alojamiento gratuito (Vercel o Cloudflare Pages) con el **dominio propio** de Lorena. Código en `github.com/Lorenadata` con un README que cuente cómo está hecha la web.
- Analítica sencilla y respetuosa con la privacidad para saber si los recruiters entran (opcional; queda a criterio de quien construye).

### Respuestas a la revisión (decisiones de Claude)

- **Datos nuevos a partir de sus datos reales.** Los agregados nuevos (por ejemplo, AROPE por cada combinación de hogar o filas tras cada paso de limpieza) **cuentan como resultados reales** si se calculan con un script reproducible en R a partir de sus mismos datos y con la misma metodología: ponderación `RB050` y mismas definiciones. Las combinaciones con muy pocas observaciones en la muestra se agrupan o se marcan como "muestra insuficiente", nunca se muestran como cifra fiable. En el equipo hay R 4.6.1, `ECVpersona.RData` (en los repos de la ECV) y el CSV de viajes en `C:\Users\Usuario\Downloads\Estudio y depuración de datos\Depuración de datos\archive\ncr_ride_bookings.csv`. Quien construye ejecuta los scripts de exportación.
- **El código de RaceTrack no se copia.** Lorena eligió mantenerlo privado, así que la réplica **recrea** las pantallas clave con un aspecto equivalente, sin copiar componentes del repo privado al público.
- **Móvil.** Se usan **recortes de las mismas imágenes**, no imágenes aparte. Los prompts piden imágenes anchas y de alta resolución con zonas seguras para el encuadre vertical. Si un recorte no funciona, se genera solo esa imagen.
- **Imágenes como dependencia.** Se construye desde el primer día con imágenes provisionales del mismo encuadre, preparadas para sustituirlas en cuanto lleguen las de Lorena. Los prompts se entregan en el **día 1** para que no sean un cuello de botella.

### Respuestas de Lorena

- **Si no da tiempo, se sacrifican paradas** antes que mover la fecha o rebajar la calidad. Una parada sin terminar **no se publica** (no puede haber locales vacíos) y se añade después de la v1.
  *Orden de prioridad (decisión de Claude):*
  1. RaceTrack
  2. Recruiter Mode, Sobre mí y Contacto (imprescindibles y baratos)
  3. Pobreza infantil
  4. Ride-sharing
  5. Cómo se hizo
  6. Alquiler
  7. Fiscalis

  Las paradas 6 y 7 son las primeras candidatas a recortarse. Las calles se diseñan para que un local quede como fachada sin cartel de proyecto si su parada no entra.
- **CV:** `C:\Users\Usuario\OneDrive\Documentos\CIENCIA DE DATOS\portfolio web\CV Lorena Marcos EN.pdf` (en inglés). *Decisión de Claude:* en la v1 se ofrece este mismo CV en los dos idiomas. Una versión en español sería un extra opcional.

### Coherencia entre la web, el CV y el GitHub (anti-objetivo)

Un recruiter cruzará la web con el CV y el GitHub. La web **solo afirma lo que se puede comprobar en el GitHub**, y el CV se revisa para que cuente lo mismo. La foto profesional de Lorena aparece en "Sobre mí".

### Decisiones finales de Lorena (26/10/2026)

- **Se reconstruye el modelo XGBoost** de predicción de cancelaciones (`cancelled_rides_by_customer`) sobre el dataset de 150.000 viajes, en R, y se publica en el repo `ncr-ride-sharing-eda`. Tiene que ser un modelo evaluado de verdad: separación train/test sin fuga de información (excluir variables que solo existen después de la cancelación), métricas adecuadas para clases desbalanceadas, comparación con un modelo base e importancia de variables. Lorena tiene que entenderlo y poder defenderlo, así que va con explicaciones claras. Cuando esté publicado, la parada de ride-sharing gana una interacción extra: **"¿cancelará este viaje?"**, que predice a partir de variables que elige el visitante, con probabilidades precalculadas o con el modelo exportado. Las métricas que se muestren serán las reales, aunque sean modestas.
- **Dominio: `lorenamarcos.dev`.** Lo compra Lorena (sujeto a disponibilidad).
- **Foto:** la foto profesional del CV aparece en "Sobre mí".

## 10. Qué queda en manos de quien construye

La estructura del código, las librerías concretas, la técnica de profundidad y paralaje, el sistema de transiciones, el diseño exacto de cada capa interactiva dentro de lo descrito en §5, los textos del lema y la cita (que aprueba Lorena) y el orden de las paradas en la calle (con RaceTrack como protagonista).

## 11. Explicabilidad

Lorena tiene que poder explicarla en una entrevista. Por eso:
- Hay un documento corto `docs/como-funciona.md` en lenguaje claro: las piezas, por qué se eligió cada una y cómo fluye un clic.
- Cada decisión técnica importante queda anotada con su porqué.
- La parada "Cómo se hizo" cuenta la misma historia al visitante.

## 12. Criterios de éxito (v1, 15/11/2026)

- Publicada en el dominio propio, en ES y EN.
- Las 8 paradas funcionan y cada proyecto se abre con su interacción real.
- Recruiter Mode completo, con CV y contacto a 2 clics como máximo.
- Va fluida en un portátil normal y en un móvil de gama media, y nunca deja una pantalla vacía.
- Lorena la ha recorrido, aprueba cómo se ve en comparación con `version1.png` y sabe explicar cómo funciona.

## 13. Versión 2 (después de la v1, no se planifica ahora)

Interiores 3D de los edificios, más proyectos (por ejemplo, uno de Python o ML con un modelo evaluado de verdad) y efectos ambientales extra.
