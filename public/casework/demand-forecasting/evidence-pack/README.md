# Case 03 — Demand Forecasting Under Uncertainty

**Evidence Pack — PROVIDENTIA (Demand Forecasting & Capacity Decision
Intelligence for Ambulatory Healthcare)**

This pack demonstrates the **forecasting** side of PROVIDENTIA: dataset and
time series, profiling, the temporal validation protocol and leakage
prevention, baselines, statistical models (ETS, SARIMA), gradient boosting
(LightGBM), backtesting, model comparison, prediction intervals, and the
final locked-box evaluation.

It does **not** cover capacity decisions, PI80/PI90/PI95 policy, exceedance,
buffer or shortfall — that is Case 04 (Capacity Decision Intelligence), kept
as a separate, independent Evidence Pack.

Everything here is copied or derived, without recomputation, from
already-frozen artifacts in the source repository (`reports/p0` → `p5`,
`reports/p7`). No model was refit, no metric was recomputed from raw data,
and no science artifact in the source repository was modified to build this
export. See [`portfolio_manifest.json`](portfolio_manifest.json) for the
exact source-file list and hashes where available.

---

## What this pack answers

> How much monthly outpatient-referral demand did PROVIDENTIA forecast, one
> month ahead, and how well-calibrated was its uncertainty — on development
> data, and on a single, irreversible final locked-box evaluation?

## Dataset

- **Source:** StatsWales Outpatient Referrals (Welsh Government / Digital
  Health and Care Wales), Open Government Licence v3.0. Full attribution in
  [`data_attribution.md`](data_attribution.md) — **preserve it wherever this
  pack is reused.**
- **Unit:** month × provider health board × specialty.
- **Target:** total monthly first-outpatient referrals (observed referral
  demand — not attendances, not appointments delivered, not latent need).
- **Cohort:** 214 series after data-gate filtering; the evaluation support
  used below is the 198-series common-support subset (`B198`).
- **Primary horizon:** 1 month ahead.
- Raw and processed data files are **not included** in this pack (see
  `data_attribution.md`); only aggregated, derived metrics and a small set
  of pre-existing figures are exported.

## Profiling (P1)

- 30,747 rows, 214 series, 7 provider health boards, 50 specialties.
- Global date range: 2012-04 to 2026-06 (171 months); 129 series with
  complete balanced history, 85 partial/gapped.
- Right-skewed distribution (mean 506.8, median 251.0, skewness 1.92).
- Two boards (Betsi Cadwaladr, Aneurin Bevan) contribute ~23.8% / ~23.5% of
  selected referrals; Trauma & Orthopaedics leads specialties at ~13.3%.
- Trend mix: 103 approximately-stable series, 96 increasing, 15 decreasing.
- COVID-19 (Mar 2020–Jun 2021) is a documented structural break; the
  post/pre-COVID level ratio has a median of ~1.18 across comparable series.
- Full narrative: source `reports/p1/etsa-report.md`; reused figure:
  [`figures/p1-06-representative-series.png`](figures/p1-06-representative-series.png).

## Temporal protocol & anti-leakage

- **Rolling-origin expanding-window validation, h = 1 month. Random
  train/test split is prohibited.**
- For every evaluated row: `target_month == forecast_origin + 1 month`,
  `training_end == forecast_origin`, and for intervals
  `calibration_end < target_month` — verified structurally, not just
  asserted (final closure audit: **PASS 8/8**, see
  `reports/p7/final-leakage-audit.json`).
- Development headline support `B198_DEVELOPMENT_COMMON_SUPPORT_V1`: 6,534
  rows, 198 series, 33 origins (2022-03 to 2024-11 origins).
- Final lockbox support `B198_FINAL_LOCKBOX_V1`: 3,564 rows, 198 series, 18
  origins, targets 2025-01 to 2026-06.
- Decision record: `docs/decisions/DDR-003-temporal-evaluation-protocol.md`.

## Models compared

| Model | Role | Family |
|---|---|---|
| `naive` | baseline (mandatory) | last observed value |
| `seasonal_naive` | baseline (mandatory) | value 12 months prior |
| `ets_aicc` | **primary** (frozen before lockbox opening) | statistical (ETS, AICc selection) |
| `sarima_aicc` | secondary | statistical (SARIMA, AICc selection) |
| `lightgbm_global_full_v1` | sensitivity | gradient boosting (global model, fail-closed leakage contract) |

Baselines are never hidden, and gradient boosting has no obligation to beat
the statistical models or the baselines — see **Model comparison** below.

## Model comparison — DEVELOPMENT vs FINAL_LOCKED_EVALUATION

Micro-aggregated WAPE (all target-months pooled), from
[`forecasting_metrics.csv`](forecasting_metrics.csv):

| Model | DEVELOPMENT WAPE (n=6,534) | FINAL_LOCKED_EVALUATION WAPE (n=3,564) |
|---|---:|---:|
| naive | 11.79% | 10.69% |
| seasonal_naive | 14.18% | 13.98% |
| **ets_aicc (primary)** | **10.55%** | **9.15%** |
| sarima_aicc (secondary) | 10.95% | 8.84% |
| lightgbm_global_full_v1 (sensitivity) | 10.67% | 9.11% |

**On the final lockbox, `sarima_aicc` scored a small margin better than
`ets_aicc` on WAPE/MAE/RMSE** (8.84% vs 9.15% WAPE). This is a **descriptive
ranking only, on one reserved period**. Per `DDR-007`, the frozen primary
model (`ets_aicc`) was fixed *before* the lockbox was opened, and
`post_lockbox_selection` / `post_lockbox_tuning` are `false` — **this
result did not, and could not, change the frozen model or policy.** It is
reported for completeness, exactly as the source project reports it.

## Development vs Final — generalization gap

See [`development_vs_final.csv`](development_vs_final.csv) for the full
per-model, per-metric gap table (point and interval). WAPE/MAE/RMSE improved
(gap is negative) on the final lockbox relative to development for all three
candidate models; MASE moved by ≤0.02 in either direction. The generalization
gap is **small and mixed-sign**, consistent with ordinary period-to-period
variation rather than a regression.

Reused figure:
[`figures/p7-point-wape-development-vs-final.png`](figures/p7-point-wape-development-vs-final.png).

## Prediction intervals (P5) — calibration

Nominal 80/90/95% intervals, raw coverage, final lockbox (`ets_aicc`):

| Level | Empirical coverage | Calibration gap |
|---|---:|---:|
| 80% | 80.86% | +0.0086 |
| 90% | 89.56% | −0.0044 |
| 95% | 94.50% | −0.0050 |

All levels stay within ~1 percentage point of nominal. `lightgbm_global_full_v1`
tracks similarly closely (see `forecasting_metrics.csv`). Full detail in
[`development_vs_final.csv`](development_vs_final.csv) (`metric_family =
interval`). Reused figure:
[`figures/p7-interval-calibration-final.png`](figures/p7-interval-calibration-final.png).

## Final lockbox — governance

- The lockbox (`B198_FINAL_LOCKBOX_V1`) was opened **exactly once**, under a
  recorded human authorization, for the first and only formal final
  evaluation. State transition: `SEALED → OPENED_UNSCORED → SCORED`. It
  **cannot return to `SEALED`.**
- `post_lockbox_tuning: false`, `post_lockbox_selection: false`,
  `ensemble: false`, `max_of_models: false` — **no retuning and no model
  switching happened after opening**, even though `sarima_aicc` edged out
  `ets_aicc` descriptively on this period (see above).
- Freeze manifest SHA-256: `7b6bcaf97ec72c4b20e0898c72f2dee489e350a5a9eb52f1115ba75f6d510eb8`.
- Structural leakage audit on the frozen, scored ledgers: **PASS (8/8)**.
- Source: `docs/decisions/DDR-008-final-locked-evaluation-mvp-closure.md`,
  `reports/p7/final-scientific-evaluation.md`, `reports/p7/closure-manifest.json`.

## Notebook

[`forecasting_case_notebook.ipynb`](forecasting_case_notebook.ipynb) reads
**only** the files inside this folder (`forecasting_metrics.csv`,
`development_vs_final.csv`, `figures/`) and reconstructs: a profiling
summary, the model comparison chart, the development-vs-final gap chart,
and the interval calibration chart, closing with conclusions and
limitations. It does not import `src/providentia`, and does not touch
`data/raw/` or `data/processed/`.

## Limitations & claim boundaries (preserve exactly)

PROVIDENTIA, and therefore this Evidence Pack, **can** claim: final-lockbox
point/interval performance, the development-vs-final generalization gap, and
model comparison as reported above.

It **cannot** claim (contract in `config/p7_claims.yaml`, reproduced in
`portfolio_manifest.json`): actual hospital capacity, actual saturation,
staff shortage, unmet patient demand, a guaranteed future service level,
optimal capacity, monetary savings, or that referrals equal delivered
appointments (no evidenced conversion rule).

Additional, dataset-level limitations (`DDR-001`) that must not be dropped
when this pack is reused:

- Monthly granularity cannot support daily staffing or within-month peaks.
- Referrals do not reveal appointment capacity, attendance or waiting-time
  conversion.
- Demand censoring (referrals are upstream of appointments but still not a
  direct measure of potential demand) is a documented, unresolved
  limitation.
- Welsh health-board boundaries changed in April 2019; COVID-19 is a major
  structural break.
- Results describe Welsh NHS referral activity and **do not automatically
  generalize** to other health systems.

## Files in this pack

```
README.md                          this file
portfolio_manifest.json            machine-readable manifest: sources, hashes, claim contract
data_attribution.md                StatsWales / OGL v3.0 attribution (preserve verbatim)
forecasting_metrics.csv             point + interval metrics, DEVELOPMENT and FINAL_LOCKED_EVALUATION
development_vs_final.csv           per-model, per-metric generalization-gap table
forecasting_case_notebook.ipynb    self-contained notebook (reads only files in this folder)
figures/                           4 pre-existing frozen figures, copied unmodified
```
