/**
 * Static transcription of the Case 05 Evidence Pack — PROVIDENTIA's PDI
 * (Policy & Decision Intelligence) extension.
 *
 * Source of truth (read directly, not re-derived, before writing this
 * file — Phase 5 claim-source audit):
 *   - reports/pdi4/PDI-4-empirical-evaluation.md (the only numeric source
 *     authorized for public claims — PDI-5/6/7 add status, not new numbers)
 *   - reports/pdi7/PDI-7-final-product-gate.md (overall gate: 220 tests,
 *     Power BI pending, PDI-0..7 complete)
 *   - public_export/case05_pdi_policy_evaluation/claims_contract.md +
 *     README.md (the project's own public-facing claim boundary)
 *
 * Numbers are copied verbatim from those artifacts — do not hand-edit
 * without updating the source of truth first (this portfolio does not
 * regenerate or rescore PROVIDENTIA's science).
 *
 * Every number here appears in claims_contract.md's "Allowed claims" or
 * directly supports one of them (e.g. the raw micro-WAPE / loss values
 * behind an allowed ranking claim). Nothing from "Forbidden claims" is
 * represented: no global winner, no optimal buffer, no money, no validated
 * `.pbix`, no prospective holdout.
 */
export const POLICY_DECISION_EVIDENCE = {
  meta: {
    caseTitle: 'Capacity Decision Intelligence — PDI', // display title lives in i18n; this is a data-file label only
    sourceProject: 'PROVIDENTIA',
    sourceProjectStatus: 'PDI-7 APTO — PROVIDENTIA Policy & Decision Intelligence = COMPLETE',
    contractSha256: 'c8eff4eaa033bd96ecf86f6fdcb1475347bcc70d37b0f41f0db72eca63822bad',
  },
  caseBoundary: {
    startsWhere: 'case03_forecasting (P7 lockbox) and case04_capacity_decision (PI90 incumbent policy) end',
    takesAsGiven: 'the frozen P7 lockbox (B198_FINAL_LOCKBOX_V1, SCORED) and the ETS × PI90 incumbent capacity policy',
    doesNotRepeat: [
      'forecasting model selection (Case 03)',
      'the PI90 incumbent policy narrative (Case 04)',
      'a new prospective lockbox or model retraining',
    ],
  },
  question:
    'How do forecast model, capacity policy, and relative under/over error-cost scenarios interact when capacity rules are scored as decisions — not only as forecast accuracy?',
  evaluationDesign: {
    mode: 'SENSITIVITY_GRID_ONLY',
    evaluationType: 'Retrospective (OPTION B) on the already-scored P7 lockbox window',
    window: '2025-01 → 2026-06',
    series: 198,
    scoredCells: 210,
    setBreakdown: { SET_A: 25, SET_B: 150, SET_C: 30, SET_D: 5 },
    primaryScenario: 'C10 (1:1 under:over)',
    primaryStatistic: 'Median normalized decision loss (linear quantiles)',
    bootstrap: { reps: 2000, seed: 1729, preRegisteredContrasts: 24 },
  },
  costScenarios: [
    { id: 'C05', ratio: '0.5:1', role: 'sensitivity' },
    { id: 'C10', ratio: '1:1', role: 'primary' },
    { id: 'C20', ratio: '2:1', role: 'sensitivity' },
    { id: 'C50', ratio: '5:1', role: 'sensitivity' },
    { id: 'C100', ratio: '10:1', role: 'sensitivity' },
  ],
  /** Frozen P7 micro-WAPE — predictive ranking (not re-tournament). */
  predictiveRanking: [
    { rank: 1, model: 'sarima_aicc', microWape: 0.0884 },
    { rank: 2, model: 'lightgbm_global_full_v1', microWape: 0.0911 },
    { rank: 3, model: 'ets_aicc', microWape: 0.0915 },
    { rank: 4, model: 'naive', microWape: 0.1069 },
    { rank: 5, model: 'seasonal_naive', microWape: 0.1398 },
  ],
  /** SET_A / POLICY_01 (point-forecast capacity) / C10 — decision ranking. */
  decisionRankingSetA: [
    { rank: 1, model: 'ets_aicc', medianNormLoss: 0.1054, iqr: 0.0628 },
    { rank: 2, model: 'sarima_aicc', medianNormLoss: 0.1056, iqr: 0.0673 },
    { rank: 3, model: 'lightgbm_global_full_v1', medianNormLoss: 0.1086, iqr: 0.0733 },
    { rank: 4, model: 'naive', medianNormLoss: 0.1180, iqr: 0.0800 },
    { rank: 5, model: 'seasonal_naive', medianNormLoss: 0.1477, iqr: 0.1503 },
  ],
  /** SET_D continuity — ETS × PI90 (incumbent) vs ETS × POLICY_01 (point), C10 only. */
  policyContinuitySetD: {
    etsPi90MedianNormLoss: 0.2245,
    etsPointMedianNormLoss: 0.1054,
    scenario: 'C10',
  },
  /** Pre-registered paired bootstrap (2000×, seed 1729) — claim-eligible subset only. */
  bootstrapContrasts: [
    { contrast: 'ETS vs naïve · P01 · C10', deltaMedian: -0.0126, ci: [-0.0223, -0.0093], verdict: 'ETS lower loss' },
    { contrast: 'LGBM vs ETS · P01 · C10', deltaMedian: 0.0032, ci: [-0.0007, 0.0105], verdict: 'not clearly distinguishable' },
    { contrast: 'SARIMA vs ETS · P01 · C10', deltaMedian: 0.0002, ci: [-0.0055, 0.0071], verdict: 'not clearly distinguishable' },
    { contrast: 'ETS PI90 vs ETS P01 · C10', deltaMedian: 0.1191, ci: [0.1054, 0.1334], verdict: 'P01 lower loss than PI90 under C10' },
  ],
  claimBoundary: {
    allowed: [
      'SARIMA leads predictive micro-WAPE on the frozen P7 lockbox ledger.',
      'Under SET_A / POLICY_01 / C10, ETS has the lowest point estimate of median normalized decision loss.',
      'Under SET_A / POLICY_01 / C10, ETS vs SARIMA and ETS vs LightGBM are not clearly distinguishable by paired bootstrap (CI crosses 0).',
      'Under C10, ETS POLICY_01 has lower median normalized loss than ETS PI90 (SET_D contrast).',
      'That C10 finding is scenario-conditioned and must not be generalized as "PI90 is worse".',
      'Asymmetric-cost findings (C20/C50/C100) must name the scenario explicitly.',
    ],
    forbidden: [
      'a single global best model/policy across SET_A–D',
      'an optimal buffer or PI level selected from the sensitivity grid',
      'monetary savings, staffing, or observed hospital capacity',
      'a validated Power BI .pbix product',
      'a prospective holdout or a new lockbox',
    ],
  },
  powerBi: {
    status: 'POWER BI IMPLEMENTATION PACKAGE COMPLETE — DESKTOP ASSEMBLY/VALIDATION PENDING',
    pbixValidated: false,
    pbixFabricated: false,
    packagePages: ['Executive Decision Overview', 'Prediction vs Decision', 'Policy Trade-Off', 'Operational Drill-Through', 'Uncertainty'],
  },
  reproducibility: {
    globalTestSuite: '220 passed, 0 failures (pytest -q, includes P7 + PDI-0…PDI-7)',
    reconciliationChecks: '82/82 automated integrity checks (P7 pins → SQLite → Decision Engine → PDI-4 → PDI-5 → PDI-6)',
    contractSha256: 'c8eff4eaa033bd96ecf86f6fdcb1475347bcc70d37b0f41f0db72eca63822bad',
  },
  limitations: [
    'Retrospective evaluation on an already-scored lockbox window (OPTION B) — not a new prospective test.',
    'Sensitivity-grid-only: no learned optimal buffer or policy is selected from the grid.',
    'Cost weights are relative scenario weights, not money.',
    'Capacity is simulated referral-handling capacity; no observed hospital beds or staff.',
    'Shortfall/excess are simulated accounting identities, not observed unmet demand or idle capacity.',
    'No global winner is declared across the incomparable SET_A–D comparison sets.',
    'Power BI Desktop assembly and visual validation are pending; no `.pbix` was fabricated or validated.',
  ],
}
