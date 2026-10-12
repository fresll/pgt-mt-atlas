"""Independent checks of the mathematical handoff, not Atlas source code.

Run after analyze.py. Requires NumPy/SciPy; writes independent_checks.json.
Kimura is evaluated with Jacobi polynomials and adaptive Gauss quadrature,
independently of the handoff's Legendre recurrence and Simpson rule.
"""
from pathlib import Path
import csv
import json
import math
import sys

import numpy as np
import scipy
from scipy.integrate import quad
from scipy.special import betainc, eval_jacobi
from scipy.stats import beta, fisher_exact

ROOT = Path(__file__).resolve().parent

p, variance = 0.1264, 0.014
b = 1 - variance / (p * (1 - p))
i = np.arange(1, 61)
f_p = eval_jacobi(i - 1, 1, 1, 1 - 2 * p) / i
coef = (2 * i + 1) * p * (1 - p) * f_p * b ** (i * (i + 1) / 2)
mass0 = float(1 - p - coef.sum())
mass1 = float(p + np.sum((-1.0) ** i * coef))


def density(x):
    return float(np.sum((i + 1) * coef * eval_jacobi(i - 1, 1, 1, 1 - 2 * x)))


def integral(fn, top=1):
    return quad(fn, 0, top, epsabs=1e-12, epsrel=1e-12)[0]


norm = mass0 + mass1 + integral(density)
mean = mass1 + integral(lambda x: x * density(x))
second = mass1 + integral(lambda x: x * x * density(x))
cdf15 = mass0 + integral(density, 0.15)
assert abs(norm - 1) < 1e-10
assert abs(mean - p) < 1e-10
assert abs(second - mean**2 - variance) < 1e-10
assert min(density(float(x)) for x in np.linspace(0, 1, 1001)) > -1e-11

beta_concentration = p * (1 - p) / variance - 1
comparison = []
for threshold in (0.02, 0.15, 0.18, 0.30):
    comparison.append(dict(
        threshold=threshold,
        kimura=mass0 + integral(density, threshold),
        moment_matched_beta=float(beta.cdf(threshold, p * beta_concentration, (1 - p) * beta_concentration)),
        status="scenario_using_published_rounded_moments_not_patient_fit",
    ))

# Independent integration of the scaled Beta posterior, avoiding finite expansion.
pred = 1 - quad(lambda x: (1 - 0.5*x)**6 * beta.pdf(x, 41.5, 46.5), 0, 1,
                epsabs=1e-12, epsrel=1e-12)[0]
reported_results = list(csv.DictReader((ROOT / "results.csv").open()))
reported_pred = float(next(r["value"] for r in reported_results
                           if r["metric"] == "Jeffreys_scaled_beta_predictive"))
assert abs(pred - reported_pred) < 1e-11

cycles = list(csv.DictReader((ROOT / "cycles.csv").open()))
observations = list(csv.DictReader((ROOT / "observations.csv").open()))
assert len(cycles) == 11
assert len({r["cycle_id"] for r in cycles}) == 11
for row in cycles:
    assert row["cycle_id"]
    group = [r for r in observations if r["cycle_id"] == row["cycle_id"]
             and r["mother_id"] == row["mother_id"] and r["publication"] == row["publication"]]
    assert int(row["n_source_embryos"]) == sum(r["object_type"] == "embryo" for r in group)
assert sum(not r["cycle_id"] and r["object_type"] == "embryo" for r in observations) == 35

# Illustrative conditional tests: no family-population inference or proof of independence.
# Cells: [[H-pass & E-pass, H-pass & E-fail], [H-fail & E-pass, H-fail & E-fail]].
contingencies = dict(ji2021_informative_t18=[[0, 1], [3, 10]],
                    ji2021_informative_t30=[[0, 2], [3, 9]],
                    spath_D_t18=[[3, 5], [0, 1]])
tests = {name: float(fisher_exact(table).pvalue) for name, table in contingencies.items()}

ji = {}
for label, success in (("reported_p_as_success", .6553),
                       ("reported_p_complement_as_success", 1-.6553)):
    fixed = math.log(.05) / (.493 * math.log1p(-success))
    thinning = math.log(.05) / math.log1p(-.493 * success)
    ji[label] = dict(fixed_expected_embryos_bound=fixed, random_transition_bound=thinning,
                    random_transition_integer_min=math.ceil(thinning))

# Author JAGS code truncates latent Beta at .0001/.9999. The familiar mean
# and variance identities are exact for the untruncated model, not this likelihood.
wp, wb = .02, .7
wa, wc = wp*wb/(1-wb), (1-wp)*wb/(1-wb)
lo, hi = .0001, .9999
z = betainc(wa, wc, hi)-betainc(wa, wc, lo)
wmean = wp*(betainc(wa+1, wc, hi)-betainc(wa+1, wc, lo))/z
wsecond = wa*(wa+1)/((wa+wc)*(wa+wc+1))*(betainc(wa+2, wc, hi)-betainc(wa+2, wc, lo))/z
truncation = dict(p=wp, b=wb, lower=lo, upper=hi, excluded_mass=float(1-z),
                  untruncated_mean=wp, truncated_mean=float(wmean),
                  untruncated_variance=wp*(1-wp)*(1-wb),
                  truncated_variance=float(wsecond-wmean**2),
                  status="hypothetical_numerical_example_not_reanalysis_of_clinical_fit")

ans = dict(
    python=sys.version, numpy=np.__version__, scipy=scipy.__version__,
    kimura=dict(p0=p, variance=variance, b=b, mass0=mass0, mass1=mass1,
                normalization=norm, mean=mean, checked_variance=second-mean**2, cdf15=cdf15),
    moment_matched_cdf_comparison=comparison,
    posterior_predictive_scaled_beta=pred,
    known_cycles=len(cycles), embryos_with_unknown_cycle=35,
    conditional_fisher_pvalues=tests,
    ji2023_oocyte_formulas=ji,
    wilson_jags_truncation_example=truncation,
)
(ROOT / "independent_checks.json").write_text(json.dumps(ans, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(ans, ensure_ascii=False, indent=2))
