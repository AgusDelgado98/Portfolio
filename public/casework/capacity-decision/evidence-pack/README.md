# Case 04 — Capacity Decision Intelligence

**Evidence Pack — PROVIDENTIA (Demand Forecasting & Capacity Decision
Intelligence for Ambulatory Healthcare)**

This pack demonstrates the **decision** side of PROVIDENTIA: turning a
forecast plus its prediction intervals into a monthly referral-handling
**capacity policy**, under an explicit, pre-registered protection level —
and evaluating that policy's exceedance, buffer and shortfall, in
development and on the final locked box.

## Case boundary — read this first

**Case 04 starts where Case 03 ends.** It takes forecast point predictions
and 80/90/95% prediction intervals as an already-given input. It
deliberately does **not** repeat:

- model selection (ETS vs SARIMA vs LightGBM);
- WAPE / MAE / MASE point-forecast metrics;
- full P1 profiling;
- gradient boosting vs statistical forecasting as a *forecasting* problem.

That evidence lives in `public_export/case03_forecasting/`. This pack only
cites it as an input, never reproduces it.

Everything here is copied or derived, without recomputation, from
already-frozen artifacts in `reports/p6` and `reports/p7`. No forecast was
recomputed, no model was refit or retrained, no decision simulation was
rerun, and no science artifact in the source repository was modified to
build this export. See [`portfolio_manifest.json`](portfolio_manifest.json)
for the exact source-file list and hashes where available.

---

## What this pack answers

> Given a forecast and its uncertainty, what monthly referral-handling
> capacity would a pre-registered protection policy have required — and
> what is the trade-off between more protection and more capacity?

## 1. Forecast + uncertainty as input

P6/P7 do not forecast. They consume the point forecasts and 80/90/95%
prediction intervals already produced and frozen by P3 (ETS, SARIMA), P4
(LightGBM) and P5 (interval calibration) — see Case 03 for that evidence.
P6 explicitly confirms: *"P6 no refit ETS ni reentrena LightGBM"*
(`reports/p6/decision-intelligence-report.md`).

## 2–3. PI80 / PI90 / PI95 and required capacity

Each prediction interval level defines a required monthly capacity:

```
required_capacity_integer = ceil(operational_upper_<level>)
uncertainty_buffer = required_capacity_integer − ceil(point_forecast)
```

Rounding is `ceil`, increment `1`. **`current_capacity` does not exist in
the data and is never invented** — confirmed in `config/p6_decision.yaml`
(`current_capacity.source: none`, `current_capacity.invent: false`) and
`reports/p6/scenario-register.json`.

| Policy | Level | Role |
|---|---:|---|
| PI80_POLICY | 80% | scenario |
| **PI90_POLICY** | **90%** | **reference** |
| PI95_POLICY | 95% | scenario |

**PI90 is the reference decision policy — explicitly not an optimum**
(`DDR-007`: *"PI90 es una elección normativa intermedia, no un óptimo"*).
PI80 and PI95 remain visible scenarios, never hidden.

## 4–7. Exceedance, buffer, shortfall, trade-off — ETS, both evaluation labels

From [`policy_tradeoff.csv`](policy_tradeoff.csv) /
[`decision_metrics.csv`](decision_metrics.csv):

| Evaluation | Policy | Exceedance | Mean buffer | Max shortfall |
|---|---|---:|---:|---:|
| DEVELOPMENT | PI80 | 9.38% | 99.3 | 1,059 |
| DEVELOPMENT | **PI90 (reference)** | **4.43%** | **132.9** | **1,013** |
| DEVELOPMENT | PI95 | 2.21% | 164.8 | 971 |
| FINAL_LOCKED_EVALUATION | PI80 | 10.91% | 100.3 | 515 |
| FINAL_LOCKED_EVALUATION | **PI90 (reference)** | **6.06%** | **134.9** | **416** |
| FINAL_LOCKED_EVALUATION | PI95 | 3.56% | 168.4 | 410 |

The trade-off is monotone in both evaluation sets: more protection (PI80 →
PI90 → PI95) **reduces exceedance at the cost of a larger buffer** —
`exceedance_rate` and `mean_buffer` move in opposite directions as the
policy level rises. This documents the trade-off; it does not change which
policy is the reference.

- **Excess units are not real idle capacity.** **Shortfall units are not
  observed unmet patient demand.** Both are outputs of simulating a fixed
  policy against a forecast, on a period with no recorded actual capacity
  (`reports/p6/decision-intelligence-report.md`).
- LightGBM sensitivity at PI90 tracks ETS closely: final-lockbox required
  capacity differs by a mean of **+2.64 units** (median +2), agrees exactly
  on 3.4% of rows (`reports/p7/final-reference-model-difference.json`) — a
  small, non-systematic disagreement, not a substitute for the primary
  model.

Reused figures:
[`figures/p6-01-policy-tradeoff-exceedance-buffer.png`](figures/p6-01-policy-tradeoff-exceedance-buffer.png),
[`figures/p6-02-exceedance-vs-buffer.png`](figures/p6-02-exceedance-vs-buffer.png),
[`figures/p6-03-shortfall-vs-excess.png`](figures/p6-03-shortfall-vs-excess.png).

## 8. Frozen reference policy: ETS × PI90

- Primary model: `ets_aicc`. Sensitivity: `lightgbm_global_full_v1`. No
  ensemble, no `max()` of models.
- Reference: `PI90_POLICY`. Fixed by `DDR-007`, **before** the lockbox was
  authorized to open (`human-opening-authorization.json`:
  `"policy_immutable_after_opening": true`).

## 9. Final lockbox evaluation

- Support `B198_FINAL_LOCKBOX_V1`: 3,564 rows, 198 series, 18 origins,
  targets 2025-01 to 2026-06. Lockbox state: `SEALED → OPENED_UNSCORED →
  SCORED` — **irreversible**, opened exactly once under recorded human
  authorization.
- `post_lockbox_tuning: false`, `post_lockbox_selection: false` — the
  development-vs-final trade-off in `decision_metrics.csv` and
  `policy_tradeoff.csv` moved (exceedance rose modestly at every level;
  **maximum shortfall fell substantially at every level**, e.g. ETS×PI90
  1,013 → 416), and **none of that movement changed the frozen policy.**
- Structural leakage audit on the frozen ledgers: **PASS (8/8)** — the
  decision and reference ledgers carry no outcome/actual columns by
  construction (`reports/p7/final-leakage-audit.json`).
- Reused figure:
  [`figures/p7-decision-exceedance-by-policy.png`](figures/p7-decision-exceedance-by-policy.png).
- Source: `docs/decisions/DDR-008-final-locked-evaluation-mvp-closure.md`,
  `reports/p7/final-scientific-evaluation.md` §4/§4b,
  `reports/p7/closure-manifest.json`.

## 10. Decision limits & claims

Full contract in [`claims_contract.md`](claims_contract.md) — reproduces
`config/p6_claims.yaml` and `config/p7_claims.yaml` verbatim. In short, this
pack **can** claim: required monthly referral-handling capacity under a
named, frozen policy; simulated exceedance/buffer/shortfall under that
policy, in development and on the final lockbox; the trade-off across
PI80/90/95; and the development-vs-final generalization gap for the
decision layer.

It **cannot** claim: actual hospital capacity, actual saturation, staff
shortage, unmet patient demand, a guaranteed service level, optimal
capacity, monetary savings, or that referrals equal delivered appointments.
It never invents `current_capacity`.

## Notebook

[`capacity_decision_case_notebook.ipynb`](capacity_decision_case_notebook.ipynb)
reads **only** the files inside this folder (`decision_metrics.csv`,
`policy_tradeoff.csv`, `figures/`). It does not import `src/providentia`,
does not touch `data/raw/`, `data/processed/`, or Case 03's files, and does
not recompute any forecast or re-run any decision simulation.

## Files in this pack

```
README.md                              this file
portfolio_manifest.json                machine-readable manifest: sources, hashes, frozen policy
decision_metrics.csv                   consolidated P6 + P7 decision metrics (12 rows)
policy_tradeoff.csv                    PI80/90/95 trade-off slice (12 rows)
claims_contract.md                     p6_claims.yaml + p7_claims.yaml, reproduced verbatim
capacity_decision_case_notebook.ipynb  self-contained notebook (reads only files in this folder)
figures/                               4 pre-existing frozen figures, copied unmodified, none shared with Case 03
```
