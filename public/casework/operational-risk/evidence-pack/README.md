# Operational Risk Detection & Prioritization — Public Evidence Pack

Minimal public export of the **Operational Risk Detection & Prioritization** case
study, prepared for reuse in the Portfolio repository (Engineering Log / Evidence
Pack).

## What this is

- **100% synthetic data.** No real entities, telemetry, incidents, or
  organizations are represented. No PHI/PII of any kind — every identifier,
  event, and entity attribute is generator-produced.
- **Reproducible generation:** fixed random seed **42**.
- **Business problem:** detect operational risk events raised across monitored
  entities (accounts, devices, services, vendors, integrations) and prioritize
  a **limited review capacity** — most events are noise, review staffing is
  fixed, so risk has to be ranked, not just classified.
- **Dataset size:** **15,000 events** (cleaned analytical table), 22 columns.
  Eligible (reviewed) population: 11,334 events; eligible risk rate **7.18%**.
- **Purpose:** professional / demonstrative methodology showcase (synthetic
  data generation, cleaning, EDA, a deterministic rules baseline, leakage-aware
  feature engineering, and model-based prioritization under a fixed review
  budget). It is **not** a real fraud/security detection system and makes no
  causal claims.

## Methodology summary

- **Rules baseline:** a fixed, interpretable, pre-ML rule set (severity,
  off-hours, sensitive event types, cold-start-with-history, event burstiness)
  — deliberately simple, not tuned against the target.
- **ML model selected: Logistic Regression** (`class_weight="balanced"`),
  chosen on **validation PR-AUC** against a Random Forest and a majority-class
  baseline.
- **Primary review policy: Top 12% by score** — a fixed review-capacity share,
  applied independently per split (validation and test each get their own
  exact top-N by rank, deterministic tie-break on event ID). This is **not**
  an absolute score threshold and **not** 0.5; an earlier absolute-threshold
  version is kept only as a secondary diagnostic in the manifest.
- **Headline test result (same review capacity, N = 272 for both methods):**
  Logistic Regression captured **49 true positives** vs. **31** for the rules
  baseline — **+18 additional risks captured** at the identical review budget,
  with precision/recall/F1 all ≈ **1.58×** the rules baseline.

## Files in this folder

| File | Description |
|------|-------------|
| `operational_risk_dataset.csv` | Cleaned event table, verbatim export of `processed/events_cleaned.csv` (15,000 rows x 22 columns) |
| `operational_risk_dataset.xlsx` | Same dataset, Excel format |
| `data_dictionary.xlsx` | Column-level dictionary: variable, description, type/role, availability at event time, modeling use, leakage risk |
| `portfolio_manifest.json` | Sanitized evidence manifest: dataset dimensions, data quality, leakage checks, EDA insights, model comparison, primary policy, test results, drivers, limitations (no internal paths or infrastructure references) |
| `operational_risk_case_notebook.ipynb` | Self-contained notebook reproducing EDA, the rules baseline, feature engineering, leakage checks, model comparison, and the Top-12% policy from `operational_risk_dataset.csv` alone |
| `README.md` | This file |

## Methodology reference

Full scenario, data model, data dictionary, and modeling protocol live in the
source case study: `case_studies/operational_risk/` — see `SCENARIO.md`,
`DATA_MODEL.md`, and `DATA_DICTIONARY.md` there. In short:

- Target: `is_risk_flag`; modeling population `auto_resolved_flag == 0`.
- Simple temporal train / validation / test split by `event_timestamp`
  (~65/15/20, positional, deterministic).
- Forbidden predictors (leakage risk): `event_id`, `entity_id`,
  `event_timestamp`, `auto_resolved_flag`, `resolution_minutes`,
  `analyst_notes_length`, `confirmed_loss_amount`.
- Leakage checks are fail-closed: forbidden columns, split exclusivity, and a
  from-scratch recomputation of every entity's event history (proving no
  feature used future information) all must pass before any model is fit.

## Limitations

- Fully synthetic operational data; no real telemetry, incidents, or
  organizations.
- Moderate predictive signal (test ROC-AUC ≈ 0.65, PR-AUC ≈ 0.14 against a
  7.1% base rate).
- `risk_score` ranks review priority; it is **not** a calibrated probability.
- The rules baseline is deliberately simple and untuned — it establishes a
  floor for comparison, not a competitive alternative.
- No hyperparameter tuning beyond fixed, reasonable defaults.
- Not an automated decision system — supports review prioritization only,
  never an automatic accept/deny action.
- No causal claims: associations reflect intentional generator design, not
  real-world operational risk patterns.
