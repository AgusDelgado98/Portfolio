# Case 05 — Policy & Decision Intelligence (PDI)

**Evidence Pack — PROVIDENTIA**

This pack documents the **PDI extension**: how forecast models, capacity
policies, and relative under/over error-cost scenarios interact when decisions
are scored retrospectively on the already-closed P7 lockbox.

It does **not** re-open forecasting model selection (Case 03) and does **not**
replace the P7 incumbent PI90 decision narrative (Case 04). It adds a
pre-registered **sensitivity grid** of decision-loss evaluations.

All numbers are copied or cited from frozen PDI-4 artifacts. No forecast was
refit, no policy was tuned, and no new scientific scoring was performed to
build this pack.

---

## Narrative (required)

1. Forecasting was already validated (P0–P5 → P7 lockbox `SCORED`).  
2. P7 already carried an incumbent policy: **ETS × PI90**.  
3. PDI asked how **model × policy × relative cost weights** interact.  
4. A retrospective **pre-registered grid** was evaluated (`SENSITIVITY-GRID-ONLY`).  
5. Consequences (decision loss / under / over) were measured — not accuracy alone.

---

## Claim-eligible findings (PDI-4)

| Claim | Statement |
|---|---|
| Predictive | **SARIMA** leads frozen micro-WAPE (≈ 0.0884). |
| Decision point estimate | Under **SET_A / POLICY_01 / C10**, **ETS** has the lowest median normalized decision loss estimate (≈ 0.1054). |
| Bootstrap | ETS vs SARIMA and ETS vs LightGBM under P01/C10 are **not clearly distinguishable** (95% CI crosses 0). |
| PI90 under C10 | For ETS, **POLICY_01** has lower median loss than **PI90** under symmetric **C10**. |
| Guardrail | This does **not** mean PI90 is universally worse. Asymmetric scenarios must be named (C20/C50/C100). |

Primary statistic: median normalized decision loss (linear quantiles).  
Primary cost scenario: **C10**.

Full tables (source repository, not part of this public pack):
`reports/pdi4/PDI-4-empirical-evaluation.md` ·
`decision-summary.csv` ·
`paired-bootstrap-contrasts.json`.

See also [`claims_contract.md`](claims_contract.md).

---

## Architecture pointers

Source-repository locations, cited for traceability — not included in this
public pack:

| Layer | Location |
|---|---|
| Architecture overview | `docs/architecture/pdi-overview.md` |
| Contract | `config/pdi_decision.yaml` |
| SQL analytical layer | `sql/pdi/` · `data/analytical/README.md` |
| Decision engine | `src/providentia/pdi/` |
| Evaluation | `reports/pdi4/` |
| Power BI package | `reports/pdi5/` |
| Narrative | `reports/pdi6/PDI-6-public-evidence-narrative.md` |

---

## Power BI

**POWER BI IMPLEMENTATION PACKAGE COMPLETE — DESKTOP ASSEMBLY/VALIDATION PENDING**

No validated `.pbix` is included in this pack.

---

## Limitations

* Retrospective / sensitivity-only.  
* Relative cost weights ≠ money.  
* Simulated referral-handling capacity ≠ beds/staff.  
* No global winner across incomparable sets.  
* Desktop Power BI assembly not validated here.

---

## Attribution

StatsWales Outpatient Referrals under Open Government Licence v3.0 — see
Case 03's [`data_attribution.md`](../../demand-forecasting/evidence-pack/data_attribution.md).
