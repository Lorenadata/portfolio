# Exporta los pasos de limpieza y la nube LOF para la parada "Ride-sharing".
# Uso: Rscript analysis/export_ridesharing.R <ncr_ride_bookings.csv> <public/data>
# Replica el análisis de ncr-ride-sharing-eda: nulos como texto, IDs duplicados, Tukey (1,5·IQR) y LOF con k = log(n).
suppressPackageStartupMessages(library(dbscan))
args <- commandArgs(TRUE)
stopifnot(length(args) == 2)
raw <- read.csv(args[1], check.names = FALSE, stringsAsFactors = FALSE, na.strings = character(0))
names(raw) <- gsub("[^a-z0-9]+", "_", tolower(names(raw)))
N <- nrow(raw)
stopifnot(N == 150000)

# 1. Nulos guardados como texto "null" → NA
d <- raw
d[d == "null"] <- NA
medidas <- c("avg_vtat", "avg_ctat", "booking_value", "ride_distance", "driver_ratings", "customer_rating")
for (v in medidas) d[[v]] <- as.numeric(d[[v]])
# Filas sin medidas: el viaje no llegó a hacerse (faltante estructural, MNAR).
sin_medidas <- !complete.cases(d[medidas])

# 2. Booking IDs repetidos (registros distintos con el mismo ID)
dup <- d$booking_id %in% d$booking_id[duplicated(d$booking_id)]
stopifnot(sum(dup) == 2457, length(unique(d$booking_id[dup])) == 1224)
stopifnot(sum(!complete.cases(d[medidas])) == 57000) # 150.000 - 93.000 viajes completados

# 3. Outliers univariantes: regla de Tukey, coef = 1,5, en cualquiera de las medidas
iqr_out <- Reduce(`|`, lapply(medidas, function(v) {
  x <- d[[v]]
  s <- boxplot.stats(x, coef = 1.5)$stats
  !is.na(x) & (x < s[1] | x > s[5])
}))

# 4. LOF sobre las medidas escaladas de los registros completos
comp <- complete.cases(d[medidas])
X <- scale(as.matrix(d[comp, medidas]))
k <- round(log(nrow(X)))
score <- lof(X, minPts = k)
UMBRAL <- 1.5
lof_out <- score > UMBRAL
stopifnot(sum(lof_out) == 1, max(score) < 2) # el informe: un único registro > 1,5 y ninguno > 2

pasos <- list(
  list(id = "original", filas = N, marcadas = 0),
  list(id = "nulos", filas = N, marcadas = sum(sin_medidas)),
  list(id = "duplicados", filas = N, marcadas = sum(dup)),
  list(id = "outliers_iqr", filas = N, marcadas = sum(iqr_out)),
  list(id = "outliers_lof", filas = N, marcadas = sum(lof_out))
)

# Nube 3D: 3.000 registros completos proyectados en las 3 primeras componentes principales; siempre incluye los outliers LOF.
set.seed(2026)
pc <- prcomp(X, center = TRUE)$x[, 1:3]
idx <- unique(c(which(lof_out), sample(seq_len(nrow(X)), 3000)))[1:3000]
lof_pts <- lapply(idx, function(i) list(x = round(pc[i, 1], 3), y = round(pc[i, 2], 3), z = round(pc[i, 3], 3), outlier = lof_out[i]))

out <- list(pasos = pasos, lof = list(k = k, umbral = UMBRAL, completos = nrow(X), max_score = round(max(score), 3)))
jsonlite::write_json(out, file.path(args[2], "limpieza.json"), auto_unbox = TRUE, digits = NA, pretty = TRUE)
jsonlite::write_json(lof_pts, file.path(args[2], "lof.json"), auto_unbox = TRUE, digits = NA)
cat("OK limpieza.json + lof.json | LOF k =", k, "| >1.5:", sum(lof_out), "| max:", round(max(score), 3), "\n")
