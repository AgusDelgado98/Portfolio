# Clinic No-Show — Public Evidence Pack

Minimal public export of the **Clinic No-Show** case study, prepared for reuse in the
Portfolio repository (Engineering Log / Evidence Pack).

## What this is

- **100% synthetic data.** No real patients, clinics, professionals, or clinical outcomes
  are represented. No real PHI/PII of any kind — names, insurance types, zones, and
  identifiers are all generator-produced.
- **Reproducible generation:** fixed random seed **42**.
- **Dataset size:** **12,000 appointments** (cleaned analytical table), 22 columns.
- **Purpose:** professional / demonstrative methodology showcase (data generation,
  cleaning, EDA, leakage-aware feature engineering, and modeling of appointment
  no-show risk). It is **not** a clinical tool and makes no health-outcome or causal claims.

## Files in this folder

| File | Description |
|------|-------------|
| `no_show_dataset.csv` | Cleaned appointment table, verbatim export of `processed/appointments_cleaned.csv` (12,000 rows x 22 columns) |
| `no_show_dataset.xlsx` | Same dataset, Excel format |
| `data_dictionary.xlsx` | Column-level dictionary: variable, description, type/role, modeling use, and leakage risk |
| `portfolio_manifest.json` | Sanitized evidence manifest: project summary, dataset dimensions, split, selected model, validation/test metrics, limitations (internal session/infrastructure paths removed) |
| `README.md` | This file |

## Methodology reference

Full scenario, data model, data dictionary, and modeling protocol live in the source
case study: [`case_studies/clinic_no_show/`](../) — see `SCENARIO.md`, `DATA_MODEL.md`,
`DATA_DICTIONARY.md`, and `ANALYSIS.md` there. In short:

- Target: `no_show_flag`, modeling population `cancellation_flag == 0`.
- Temporal train / validation / test split by `appointment_date` (~65/15/20).
- Model family and decision threshold selected on validation only; metrics reported once
  on an untouched final test set.
- Forbidden predictors (leakage risk): identifiers, `waiting_time_minutes`,
  `actual_duration_minutes`, `cancellation_flag`, and the target itself.

## Scope

This export intentionally excludes internal pipeline source code, the trained model
binary (`.joblib`), intermediate train/validation/test frames, and chart images. Those
remain in the Paradigm repository and are not required to review or reuse the dataset
and its documentation.
