# Modelo XGBoost de cancelaciones: plan de implementación

> **Para agentes:** SUB-SKILL OBLIGATORIA: usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea a tarea. Los pasos usan checkboxes (`- [ ]`).

**Objetivo:** reconstruir y publicar en `github.com/Lorenadata/ncr-ride-sharing-eda` un modelo XGBoost honesto que prediga si **el cliente cancelará** una reserva, evaluado sin fuga de información, explicado para que Lorena pueda defenderlo y exportado a JSON para la web.

**Arquitectura:** las funciones puras de preparación (target, variables y partición temporal) van en `R/` con tests de `testthat`. Un informe Quarto entrena las líneas base y XGBoost y los evalúa. Un script exporta las métricas y las probabilidades agregadas para la web.

**Stack:** R 4.6.1, tidyverse, xgboost, pROC, PRROC, testthat, jsonlite, Quarto.

**Spec:** `docs/superpowers/specs/2026-10-26-portfolio-calle-design.md`, apartado "Decisiones finales de Lorena".

## Restricciones globales

- Datos: `C:\Users\Usuario\Downloads\Estudio y depuración de datos\Depuración de datos\archive\ncr_ride_bookings.csv`. Son 150.000 filas. **No se sube el CSV al repo** (ya está en `.gitignore`).
- Target: `Booking Status == "Cancelled by Customer"`, es decir, 1 = cancelación del cliente (10.500 filas, prevalencia del 7 %).
- **Variables permitidas (disponibles al reservar):** fecha (mes, día de la semana, fin de semana), hora (hora y franja), `Vehicle Type`, `Pickup Location` y `Drop Location`.
- **Variables prohibidas (fuga de información):** todas las demás. `Booking Value`, `Ride Distance`, `Payment Method`, `Avg CTAT` y los ratings faltan justo en las reservas canceladas (patrón MNAR estructural ya documentado en el EDA de Lorena), y el resto son resultados o motivos posteriores a la reserva. `Avg VTAT` solo existe una vez asignado un conductor: se permite **únicamente** en el escenario B, "en el momento de la asignación", etiquetado como tal.
- Partición **temporal**: entrenamiento hasta el 30/09/2024 y test desde el 01/10/2024. Validación para elegir hiperparámetros y umbral: septiembre, dentro del entrenamiento.
- Métrica principal: **PR-AUC**. También ROC-AUC, y precisión, recall y F1 con el umbral elegido en validación. Siempre frente a las líneas base: clase mayoritaria (PR-AUC = prevalencia) y regresión logística.
- **Honestidad:** el dataset muestra señales de ser sintético (cuentas por estado exactamente redondas: 93.000, 27.000, 10.500, 10.500 y 9.000; el 99,2 % de los clientes aparece una sola vez). Si XGBoost no supera claramente a las líneas base, **se publica igual** con esa conclusión explicada. Nunca se ajusta el planteamiento para inflar métricas.
- Semilla: 2026.

## Puntos a vigilar en la revisión

1. **Fuga de información por una variable "inocente"** (por ejemplo, el `NA` de `Payment Method` codificado como categoría): el test de la Tarea 1 comprueba que la matriz de variables solo contiene columnas permitidas.
2. **Categorías nuevas en test** (zonas que no aparecen en el entrenamiento): van a `"otra"`, no fallan (test en la Tarea 1).
3. **Fecha u hora mal leídas** (formato `HH:MM:SS` o fechas inválidas): fallan con un mensaje claro, no se convierten en `NA` en silencio (test en la Tarea 1).
4. **Elegir el umbral sobre el test:** prohibido. Se elige en validación (lo comprueba la Tarea 2).
5. **Celdas con pocas observaciones en el JSON para la web:** las de n < 100 se agrupan o se omiten (test en la Tarea 3).

---

### Tarea 1: Preparación de datos con tests

**Archivos:** en un clon de `Lorenadata/ncr-ride-sharing-eda` en `C:\Users\Usuario\ncr-ride-sharing-eda`, crear `R/features.R` y `tests/testthat/test-features.R`.

**Interfaces producidas:**
- `leer_reservas(path: chr) -> tibble`: limpia comillas y `"null"` como en el EDA.
- `crear_target(df) -> df`, que añade `cancela_cliente` (entero 0/1).
- `crear_variables(df, escenario = c("reserva", "asignacion")) -> df`: solo con las columnas permitidas, más `mes`, `dia_semana`, `finde`, `hora` y `franja` (madrugada 0–6, mañana 6–12, tarde 12–18, noche 18–24).
- `colapsar_niveles(train, test, col, min_n = 200) -> list(train, test)`: las categorías raras o nuevas pasan a `"otra"`.
- `particion_temporal(df, corte = as.Date("2024-10-01")) -> list(train, test)`.

- [ ] **Paso 1:** instalar los paquetes que faltan: `install.packages(c("xgboost", "PRROC", "testthat", "Hmisc", "janitor", "dbscan"))`. Localizar Quarto (`quarto --version`, o el binario que incluye RStudio) y, si no existe, instalar Quarto 1.5+.
- [ ] **Paso 2: tests** con un `tibble` de ejemplo de 6 filas, uno por cada estado y un caso de fecha:
  - el target vale 1 solo en "Cancelled by Customer";
  - `setdiff(names(crear_variables(x, "reserva")), PERMITIDAS)` está vacío y `"Avg VTAT"` solo aparece en `"asignacion"`;
  - las 23:30 caen en la franja noche;
  - una zona que solo está en test acaba en `"otra"`;
  - `particion_temporal` no deja fechas posteriores al 30/09 en train;
  - la hora `"25:00:00"` provoca un error con un mensaje claro.
- [ ] **Paso 3:** comprobar que fallan con `Rscript -e 'testthat::test_dir("tests/testthat")'`. **Paso 4:** implementarlo. **Paso 5:** comprobar que pasan.
- [ ] **Paso 6:** commit `feat: preparación de datos para el modelo de cancelaciones`.

### Tarea 2: Informe del modelo

**Archivos:** crear `modelo_cancelaciones.qmd`; generar `modelo_cancelaciones.html`, servido por Pages.

- [ ] **Paso 1:** secciones del informe, en español, explicadas para Lorena y para quien lo lea:
  1. Pregunta y momento de la predicción.
  2. Por qué se excluye cada variable (tabla de fuga de información, conectada con el MNAR del EDA).
  3. Señales de que el dataset es sintético.
  4. Partición temporal.
  5. Líneas base: clase mayoritaria y regresión logística.
  6. XGBoost (`objective = "binary:logistic"`, `eval_metric = "aucpr"`, early stopping sobre validación y búsqueda pequeña de `max_depth` ∈ {3, 5}, `eta` ∈ {0.05, 0.1} y `scale_pos_weight` ∈ {1, 13}).
  7. Resultados en test: tabla de PR-AUC y ROC-AUC de los tres modelos, curva PR, calibración y matriz de confusión con el umbral de validación.
  8. Importancia de variables (gain) con interpretación.
  9. Escenario B (con VTAT) en un apartado aparte.
  10. Conclusión honesta y límites.
- [ ] **Paso 2: comprobaciones** dentro del informe (`stopifnot`): que el test no se usa en la elección de umbral ni de hiperparámetros (el umbral sale de un objeto calculado solo con validación) y que la PR-AUC de la clase mayoritaria ≈ prevalencia del test (±0,005).
- [ ] **Paso 3:** generarlo con `quarto render modelo_cancelaciones.qmd`. Esperado: termina sin errores y se genera el HTML.
- [ ] **Paso 4:** en `ncr_ride_sharing_eda.qmd`, sección 9, sustituir "presentado en el siguiente archivo" por un enlace a `modelo_cancelaciones.html`. Añadir el modelo al `README.md` (resultados reales y enlace).
- [ ] **Paso 5:** commit `feat: modelo XGBoost de cancelaciones con evaluación temporal`.
- [ ] **Paso 6: revisión con Lorena.** Recorrer el informe con ella sección por sección hasta que sepa explicar la fuga de información, la PR-AUC y por qué se usa una partición temporal. Solo entonces, push.

### Tarea 3: Exportación para la web

**Archivos:** crear `export_cancelacion.R` (argumentos: ruta del CSV y ruta de salida).

**Interfaces producidas:** `cancelacion.json` =
`{prevalencia, metricas: {base: {pr_auc}, logistica: {pr_auc, roc_auc}, xgboost: {pr_auc, roc_auc, umbral, precision, recall}}, celdas: [{vehicle_type, franja, finde: bool, prob_media: number, n: number}], importancia: [{variable, gain}]}`. `prob_media` es la media de las predicciones de XGBoost en test para esa celda.

- [ ] **Paso 1: test** (`testthat`): ninguna celda tiene `n < 100`, `prob_media ∈ [0, 1]` y las métricas coinciden con las del informe (se leen del mismo objeto `.rds` que guarda el informe).
- [ ] **Paso 2:** implementarlo y ejecutarlo con salida en `C:\Users\Usuario\portfolio\public\data\cancelacion.json`.
- [ ] **Paso 3:** commit en los dos repos y push de `ncr-ride-sharing-eda`. Comprobar que Pages ha generado `modelo_cancelaciones.html`.
- [ ] **Paso 4:** proponer a Lorena **el texto corregido del CV** para este proyecto, con las métricas reales. Es su decisión aplicarlo, junto con los otros arreglos del CV señalados en la spec.

Al terminar, se desbloquea la Tarea 18 del plan de la web.
