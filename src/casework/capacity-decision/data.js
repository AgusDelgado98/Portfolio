/**
 * Static transcription of the Case 04 Evidence Pack (portfolio_manifest.json,
 * decision_metrics.csv, policy_tradeoff.csv, README.md, claims_contract.md).
 * Numbers are copied verbatim — do not hand-edit without updating the
 * source of truth first: public/casework/capacity-decision/evidence-pack/.
 */
export const CAPACITY_DECISION_EVIDENCE = {
  meta: {
    caseTitle: 'Capacity Decision Intelligence',
    sourceProject: 'PROVIDENTIA',
    sourceProjectStatus: 'P7 CLOSED / MVP scientific core closed',
  },
  caseBoundary: {
    startsWhere: 'case03_forecasting ends',
    takesAsGiven: 'forecast point predictions and 80/90/95% prediction intervals from P3/P4/P5',
    doesNotRepeat: [
      'model selection (ETS vs SARIMA vs LightGBM)',
      'WAPE / MAE / MASE point-forecast metrics',
      'full P1 profiling',
      'gradient boosting vs statistical forecasting as a forecasting problem',
    ],
  },
  decisionUnit: 'required_monthly_referral_handling_capacity (ceil, increment 1)',
  formula: {
    requiredCapacity: 'required_capacity_integer = ceil(operational_upper_<level>)',
    buffer: 'uncertainty_buffer = required_capacity_integer − ceil(point_forecast)',
  },
  currentCapacity: {
    source: 'none',
    invented: false,
  },
  policies: {
    PI80: { level: 0.8, role: 'scenario' },
    PI90: { level: 0.9, role: 'reference' },
    PI95: { level: 0.95, role: 'scenario' },
  },
  primaryModel: 'ets_aicc',
  sensitivityModel: 'lightgbm_global_full_v1',
  frozenPolicy: {
    referencePolicy: 'PI90_POLICY',
    fixedBeforeLockboxOpening: true,
    decisionRecord: 'DDR-007',
    note: 'DDR-007 fixed ets_aicc × PI90 as the reference decision policy before B198_FINAL_LOCKBOX_V1 was opened. No tuning or policy switch happened after opening (post_lockbox_tuning=false, post_lockbox_selection=false).',
  },
  evaluationSets: {
    development: {
      label: 'DEVELOPMENT_DECISION_POLICY_SIMULATION',
      support: 'B198_UNCERTAINTY_EVALUATION_V1',
      rows: 4158,
      series: 198,
      origins: 21,
    },
    final: {
      label: 'FINAL_LOCKED_EVALUATION',
      support: 'B198_FINAL_LOCKBOX_V1',
      rows: 3564,
      series: 198,
      origins: 18,
      targets: '2025-01 → 2026-06',
    },
  },
  lockbox: {
    stateTransition: 'SEALED → OPENED_UNSCORED → SCORED',
    stateFinal: 'SCORED (irreversible)',
    postLockboxTuning: false,
    postLockboxSelection: false,
    ensemble: false,
    maxOfModels: false,
    policyImmutableAfterOpening: true,
    freezeManifestSha256: '7b6bcaf97ec72c4b20e0898c72f2dee489e350a5a9eb52f1115ba75f6d510eb8',
    leakageAuditFinal: 'PASS 8/8',
  },
  /** ets_aicc policy-simulation metrics, from decision_metrics.csv / policy_tradeoff.csv. */
  policyMetrics: {
    development: {
      PI80: { role: 'scenario', exceedanceRate: 0.0937950937950937, meanBuffer: 99.27320827320828, maximumShortfall: 1059.0 },
      PI90: { role: 'reference', exceedanceRate: 0.0442520442520442, meanBuffer: 132.94853294853294, maximumShortfall: 1013.0 },
      PI95: { role: 'scenario', exceedanceRate: 0.0221260221260221, meanBuffer: 164.84319384319383, maximumShortfall: 971.0 },
    },
    final: {
      PI80: { role: 'scenario', exceedanceRate: 0.1091470258136924, meanBuffer: 100.34399551066218, maximumShortfall: 515.0 },
      PI90: { role: 'reference', exceedanceRate: 0.0606060606060606, meanBuffer: 134.9385521885522, maximumShortfall: 416.0 },
      PI95: { role: 'scenario', exceedanceRate: 0.0356341189674523, meanBuffer: 168.37149270482604, maximumShortfall: 410.0 },
    },
  },
  lightgbmAgreementAtPI90: {
    meanDifferenceUnits: 2.64,
    medianDifferenceUnits: 2,
    exactAgreementShare: 0.034,
    note: 'LightGBM sensitivity at PI90 tracks ETS closely: final-lockbox required capacity differs by a mean of +2.64 units (median +2), agrees exactly on 3.4% of rows — a small, non-systematic disagreement, not a substitute for the primary model.',
  },
  claimBoundary: {
    allowedFinal: [
      'final lockbox performance',
      'simulated policy exceedance on the reserved final period',
      'required monthly referral-handling capacity under the frozen PI90 policy',
      'development versus final generalization gap',
    ],
    forbiddenExamples: [
      'actual hospital capacity',
      'actual saturation',
      'staff shortage',
      'unmet patient demand',
      'a guaranteed service level',
      'optimal capacity',
      'monetary savings',
      'that referrals equal delivered appointments',
    ],
  },
  limitations: [
    'current_capacity does not exist in the data and is never invented.',
    'No staffing, no real hospital capacity, no guaranteed service level, no monetary savings — every capacity number is a simulated required_monthly_referral_handling_capacity, not FTEs, beds, clinics, or a cost figure.',
    'Referrals ≠ appointments — one accepted referral is assumed to eventually require one first-outpatient appointment slot, but rejection, redirection, conversion and scheduling lag are not observed.',
    'Excess units are not real idle capacity, and shortfall units are not observed unmet patient demand — both are outputs of simulating a fixed policy against a forecast, on a period with no recorded actual capacity.',
    'Board/specialty/series cuts are descriptive only; small subgroup counts do not authorize ranking hospitals or specialties by performance.',
  ],
}
