# Published Wilson 2016 simulation, not a refit of the patient data.
# Run from archive directory: Rscript reproduce_wilson.R
set.seed(20261011)
b <- 0.7
source('vendor/mtBottleneck/R/prepareSimData.R')
summarize <- function(x, label) {
  parent <- matrix(x$parent, nrow=x$NFam, ncol=ncol(x$off))
  norm_square <- (x$off-parent)^2/(parent*(1-parent))
  data.frame(metric='normalized_squared_shift_moment_b', value=1-mean(norm_square),
             status='сценарий', scope=label, n_families=x$NFam,
             n_transmissions=length(x$off), true_b=b, seed=20261011,
             source='Wilson 2016; published prepareSimData.R',
             limitation='moment diagnostic only; no JAGS posterior fit')
}
ans <- rbind(summarize(simMotherData,'ascertained_mothers'),
             summarize(simProbandData,'ascertained_proband'),
             summarize(simSiblingData,'proband_siblings'))
write.csv(ans,'wilson_simulation_results.csv',row.names=FALSE,na='')
runtime <- data.frame(R=R.version.string,
                      rjags=requireNamespace('rjags',quietly=TRUE),
                      coda=requireNamespace('coda',quietly=TRUE),
                      JAGS=unname(Sys.which('jags')))
write.csv(runtime,'r_runtime.csv',row.names=FALSE)
print(ans)
