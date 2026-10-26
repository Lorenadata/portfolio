# Datos de la web

Los proyectos de datos de la web leen JSON precalculados por estos scripts de R a partir de los mismos datos y con la misma metodología que los informes publicados. Los microdatos **no** se copian a este repositorio: se pasan como argumento.

| Script | Entrada | Salida | Comprueba contra el informe |
|---|---|---|---|
| `export_arope.R` | `ECVpersona.RData` (repo `pobreza_infantil_espana`) | `public/data/arope.json` | AROPE menores 34,72 % y resto 24,31 % |
| `export_alquiler.R` | `ECVpersona.RData` (repo `ECV-rental-market`) | `public/data/alquiler.json` | mediana ponderada 19.307 € |
| `export_ridesharing.R` | `ncr_ride_bookings.csv` (Kaggle) | `public/data/limpieza.json`, `lof.json` | 150.000 filas, 2.457 registros con ID duplicado, 1 outlier LOF > 1,5 |

```bash
Rscript analysis/export_arope.R ruta/ECVpersona.RData public/data
Rscript analysis/export_alquiler.R ruta/ECVpersona.RData public/data
Rscript analysis/export_ridesharing.R ruta/ncr_ride_bookings.csv public/data
```

Paquetes: `jsonlite`, `Hmisc`, `dbscan`. Las combinaciones de hogar con menos de 50 observaciones sin ponderar se publican como "muestra insuficiente", sin tasa.
