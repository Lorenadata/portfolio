# Exporta las cifras de la parada "Mercado del alquiler" con la metodología del informe ECV-rental-market.
# Uso: Rscript analysis/export_alquiler.R <ECVpersona.RData> <public/data>
suppressPackageStartupMessages(library(Hmisc))
args <- commandArgs(TRUE)
stopifnot(length(args) == 2)
load(args[1])
d <- ECVpersona
d$renta <- d$HY020 / d$HX240
MEDIANA <- 19307 # mediana nacional de la renta equivalente usada en el informe (ECV 2024)
d$baja <- d$renta < 0.75 * MEDIANA
d$alta <- d$renta > 2 * MEDIANA
d$casero <- d$HY040N > 0

pct <- function(cond, x = d) round(100 * sum(x$RB050[cond]) / sum(x$RB050), 1)
q <- function(x) unname(round(wtd.quantile(x$renta, weights = x$RB050, probs = c(.1, .5, .9))))
grupo <- function(x, extra) {
  p <- q(x)
  c(list(pct_poblacion = pct(d$RB050 > 0 & d$row %in% x$row), renta_media = round(weighted.mean(x$renta, x$RB050)),
         p10 = p[1], p50 = p[2], p90 = p[3], ratio_p90_p10 = round(p[3] / p[1], 1)), extra)
}
d$row <- seq_len(nrow(d))
stopifnot(abs(wtd.quantile(d$renta, weights = d$RB050, probs = .5) - MEDIANA) <= 1)
inq <- d[d$ARRENDATARIO == 1, ]
noinq <- d[d$ARRENDATARIO == 0, ]
cas <- d[d$casero, ]
nocas <- d[!d$casero, ]

out <- list(
  mediana = MEDIANA,
  inquilinos = grupo(inq, list(pct_baja = pct(inq$baja, inq))),
  no_inquilinos = grupo(noinq, list(pct_baja = pct(noinq$baja, noinq))),
  caseros = grupo(cas, list(pct_alta = pct(cas$alta, cas))),
  no_caseros = grupo(nocas, list(pct_alta = pct(nocas$alta, nocas)))
)
# El informe dice "1 de cada 4"; el dato ponderado es el 21 %.
stopifnot(out$inquilinos$pct_poblacion > 20, out$inquilinos$pct_poblacion < 30)
stopifnot(out$inquilinos$pct_baja > out$no_inquilinos$pct_baja, out$caseros$pct_alta > out$no_caseros$pct_alta)
jsonlite::write_json(out, file.path(args[2], "alquiler.json"), auto_unbox = TRUE, digits = NA, pretty = TRUE)
cat("OK alquiler.json\n")
