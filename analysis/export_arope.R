# Exporta las tasas AROPE ponderadas para la parada "Pobreza infantil".
# Uso: Rscript analysis/export_arope.R <ECVpersona.RData> <public/data>
# Misma metodología que el informe: menores = RB081 < 16, ponderación RB050, AROPE = vrEU2030_nuevo == 1.
args <- commandArgs(TRUE)
stopifnot(length(args) == 2)
load(args[1])
d <- ECVpersona
d$menor <- d$RB081 < 16
d$arope <- d$vrEU2030_nuevo == "1" | d$vrEU2030_nuevo == 1

tasa <- function(x) round(100 * sum(x$RB050[x$arope]) / sum(x$RB050), 2)

general <- list(menores = tasa(d[d$menor, ]), resto = tasa(d[!d$menor, ]))
# Valores publicados en el informe: si cambian, la metodología se ha desviado.
stopifnot(general$menores == 34.72, general$resto == 24.31)

# Hogares con menores: códigos TIPHOGAR verificados por composición (adultos y menores por hogar).
tipos <- c("3" = "monoparental", "4" = "dos_adultos_1", "5" = "dos_adultos_2", "6" = "dos_adultos_3mas", "7" = "otros_con_ninos")
MIN_N <- 50
celdas <- list()
for (cod in names(tipos)) for (ten in c(1, 0)) {
  x <- d[d$menor & d$TIPHOGAR == cod & d$ARRENDATARIO == ten, ]
  ok <- nrow(x) >= MIN_N
  celdas[[length(celdas) + 1]] <- list(
    tiphogar = unname(tipos[cod]),
    tenencia = if (ten == 1) "alquiler" else "no_alquiler",
    tasa = if (ok) tasa(x) else NULL,
    n = nrow(x),
    suficiente = ok
  )
}

out <- list(general = general, celdas = celdas)
jsonlite::write_json(out, file.path(args[2], "arope.json"), auto_unbox = TRUE, null = "null", digits = NA, pretty = TRUE)
cat("OK arope.json:", length(celdas), "celdas\n")
