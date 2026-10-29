# Cómo funciona esta web (para explicarla en una entrevista)

Este documento está pensado para que puedas responder con seguridad a "¿cómo has hecho esto?". Va de lo general a lo concreto.

## La idea en una frase

Una calle nocturna fotorrealista donde cada tienda es uno de mis proyectos. La cámara se mueve en 3D dentro de las fotos y cada proyecto se abre funcionando, no como una ficha.

## Las piezas

| Pieza | Qué hace | Dónde está |
|---|---|---|
| **Imágenes de la calle** | Fotos generadas con ChatGPT con mis prompts (`docs/prompts-imagenes.md`), con los letreros en blanco | `public/scenes/<escena>/` |
| **Mapas de profundidad** | Una imagen en grises por foto (blanco = cerca), calculada con el modelo de IA *Depth Anything V2* | `tools/depth/make_depth.mjs` |
| **La escena 3D** | Three.js (vía React Three Fiber). Cada foto es un plano dividido en miles de vértices y cada vértice se adelanta según la profundidad. Por eso, al mover la cámara, lo cercano se desplaza más que lo lejano (paralaje) y la foto "tiene volumen" | `src/world/` |
| **Neones** | Texto 3D dibujado por código encima de las fachadas, con brillo (*bloom*) y parpadeo. Así se puede traducir y animar | `src/world/NeonSign.tsx` |
| **Lluvia** | Miles de segmentos que caen. La posición la calcula la tarjeta gráfica (*shader*), no el procesador | `src/world/Rain.tsx` |
| **Interfaz** | HTML normal encima del 3D: marca, menú, tarjeta del proyecto, minimapa, control para avanzar | `src/ui/` |
| **Proyectos** | Cada parada es un componente de React que se descarga solo cuando entras (*lazy loading*) | `src/projects/<parada>/` |
| **Datos** | Scripts de R que recalculan mis resultados y los guardan en JSON. La web no tiene servidor | `analysis/`, `public/data/` |
| **Recruiter Mode** | Una página normal y ligera con todo lo esencial. Es también el destino automático si el navegador no tiene 3D o la persona ha pedido menos movimiento | `src/recruiter/` |

## El recorrido de un clic

1. Pulsas → (o la rueda del ratón, o deslizas en el móvil). `useWalkInput` lo traduce a la acción `next`.
2. `walkReducer` decide si se puede avanzar (no si ya te estás moviendo ni si estás en la última parada) y pasa a `moving`.
3. Si la siguiente parada está en otra foto, la cámara "camina": la foto actual se acerca y se desvanece y la nueva entra desde el fondo. Si está en la misma foto, la cámara gira hacia su letrero.
4. Al terminar, se avisa con `arrived`, el neón de esa tienda brilla más y aparece su tarjeta.
5. "Enter project" cambia la URL a `#/p/<proyecto>`. Así cualquier proyecto tiene enlace directo y se abre la capa con el proyecto encima de la calle desenfocada.

## Decisiones que conviene saber defender

- **¿Por qué fotos con profundidad y no una ciudad 3D?** Por realismo y plazo. Una ciudad 3D modelada en tres semanas parecería un videojuego. Con fotos generadas y profundidad se consigue aspecto fotográfico y movimiento 3D real.
- **¿Por qué el relieve se calcula en el procesador y no en la tarjeta gráfica?** Leer texturas desde el *vertex shader* no funciona en todos los dispositivos (en algunas pruebas tumbaba el navegador). Calcularlo una vez al cargar cada foto es igual de rápido después y más compatible.
- **¿Por qué no hay servidor?** No hace falta. Los análisis se calculan antes, en R, y la web solo lee JSON. Es más rápida, gratis de alojar y no tiene nada que hackear.
- **¿Cómo sé que las cifras son correctas?** Cada script de `analysis/` termina comprobando que reproduce los valores de mis informes publicados (por ejemplo, AROPE 34,72 % y 24,31 %). Si no coinciden, falla. Esas comprobaciones me hicieron encontrar y corregir errores en dos de mis informes.
- **¿Cómo sé que la web funciona?** Más de 100 tests automáticos con Vitest: navegación, rutas, idiomas, accesibilidad de la capa (el foco no se escapa), cálculos de cada proyecto y que la demo de RaceTrack no hace ninguna petición de red.
- **Rendimiento:** el código 3D va en un archivo aparte (~280 KB comprimido). El Recruiter Mode no lo descarga y la carga inicial es de ~60 KB (con los textos en los dos idiomas).

## Cómo trabajé con la IA

Yo decidí el concepto, las referencias, la estética, qué proyectos salen y las reglas de honestidad. La IA (Claude Code) me proponía opciones con sus pros y contras, escribía el código y los tests y redactaba los prompts de imagen, que generé yo en ChatGPT. Todo el proceso está documentado en `docs/`.
