# Data & Attribution — Case 03 Evidence Pack

This Evidence Pack reuses statistics published by **StatsWales / Welsh
Government** (Digital Health and Care Wales), dataset *Outpatient referrals,
April 2012 onwards*, dataset ID `9e8f6f1d-d4aa-457a-a675-cc0e2caef3a5`,
under the **Open Government Licence v3.0**:
<https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/>

- Source page: <https://stats.gov.wales/en-GB/9e8f6f1d-d4aa-457a-a675-cc0e2caef3a5>
- API used by the source project: `https://api.stats.gov.wales/v2`
- Source copyright statement: <https://www.gov.wales/copyright-statement>
- Raw snapshot SHA-256 (recorded at acquisition, PROVIDENTIA `DDR-001`):
  `37cd9d9c4c5465182e25b18c87742bb48bfecfb58fffdd4e8e7577f014f83d47`

## What is (and is not) included here

- **No raw or processed row-level data is included in this pack.**
  `data/raw/` and `data/processed/` in the source repository are explicitly
  **not versioned** (see `data/raw/README.md`, `data/processed/README.md`)
  and are not copied here either, consistent with that policy.
- This pack contains only **already-aggregated, derived metrics** (per model,
  per metric, per evaluation set) taken from frozen PROVIDENTIA report
  artifacts under `reports/p0/` … `reports/p5/` and `reports/p7/`, plus a
  small selection of pre-existing figure files (PNG) copied unmodified from
  `reports/p1/figures/`, `reports/p3/figures/` and `reports/p7/figures/`.
- To reproduce the underlying dataset, acquire the C004 snapshot directly
  from the StatsWales source above and follow the reproducibility steps in
  the source repository's root `README.md`.

## Licence boundary

- The **Open Government Licence v3.0** applies to the StatsWales data itself
  (and to any values in this pack that are direct aggregations of it).
- The **MIT licence** of the source repository (`PROVIDENTIA`, © 2026
  Agustin Delgado) applies only to the original code and documentation. It
  does **not** replace, subsume or relicense the third-party StatsWales data.
- This Evidence Pack must **carry this attribution forward** wherever it is
  reused (e.g. inside a Portfolio site) — do not strip this file or its
  attribution text when republishing figures or metrics derived from it.
