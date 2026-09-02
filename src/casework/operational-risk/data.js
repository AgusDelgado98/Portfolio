/**
 * Static transcription of evidence-pack/portfolio_manifest.json for Case 02.
 * Numbers are copied verbatim from the manifest — do not hand-edit values
 * here without updating them in the Evidence Pack first (source of truth:
 * public/casework/operational-risk/evidence-pack/portfolio_manifest.json).
 */
export const OPERATIONAL_RISK_EVIDENCE = {
  project_summary: {
    name: 'Operational Risk Detection & Prioritization',
    domain: 'Operational event monitoring across accounts/devices/services/vendors/integrations (synthetic)',
    objective: 'Detect operational risk events and prioritize a limited review capacity',
    pipeline_version: '1.0.0',
    seed: 42,
  },
  dataset_dimensions: {
    events_raw_rows: 15010,
    events_cleaned_rows: 15000,
    eligible_modeling_rows: 11334,
    n_entities: 1500,
    n_event_types: 8,
  },
  quality_changes: [
    { step: 'drop_duplicate_event_ids', rows_before: 15010, rows_after: 15000, rows_removed: 10 },
    { step: 'normalize_source_system', casing_fixed_rows: 225, allowed: ['web', 'api', 'batch', 'mobile'] },
    { step: 'impute_null_categories', region_nulls_labeled: 180, source_system_nulls_labeled: 150 },
    { step: 'fix_entity_type_from_entity_dimension', mismatches_corrected: 90 },
    { step: 'fix_invalid_value_amount', negative_values_corrected: 90 },
    { step: 'cast_types_and_parse_timestamp', rows: 15000 },
  ],
  target: {
    name: 'is_risk_flag',
    modeling_population: 'auto_resolved_flag == 0 (eligible, reviewed events)',
    eligible_risk_rate: 0.0718193047467796,
    n_eligible_positive: 814,
    n_eligible_negative: 10520,
    class_imbalance_ratio: 12.92,
  },
  insights: [
    {
      id: 'classImbalance',
      finding: 'Eligible risk rate is 7.2% (814 positive / 11,334 eligible, ~1:13 imbalance).',
      implication: 'A model or rule must handle a heavily imbalanced target; accuracy alone is not a meaningful metric here.',
    },
    {
      id: 'severity',
      finding: 'Risk rate rises with reported severity (4.8% at low vs 15.6% at critical).',
      implication: 'Severity alone is a useful but incomplete signal.',
    },
    {
      id: 'eventType',
      finding: 'permission_escalation (12.1%) has the highest risk rate; config_change (4.9%) the lowest.',
      implication: 'Event type is a strong prioritization signal on its own.',
      caveat: 'Synthetic association; reflects intentional generator design, not real incident patterns.',
    },
    {
      id: 'offHours',
      finding: 'Off-hours events show a 9.9% risk rate vs 6.9% during business hours.',
      implication: 'Off-hours review coverage is disproportionately valuable per event reviewed.',
    },
    {
      id: 'valueAmount',
      finding: 'Risk rate is higher at the extreme value_amount buckets (~9.2%) than in the middle of the distribution (~7.4%) — a U-shaped, not monotonic, pattern.',
      implication: 'A single greater-than/less-than threshold on value_amount cannot separate risk well — this motivates non-rule-based modeling.',
      caveat: 'Pattern was intentionally injected by the generator (quadratic term on standardized log value).',
    },
  ],
  rules: {
    definitions: [
      { id: 'R1', label: 'high_severity', rule: 'severity_reported in {high, critical}' },
      { id: 'R2', label: 'off_hours', rule: 'hour_of_day >= 22 or hour_of_day < 6' },
      { id: 'R3', label: 'sensitive_event_type', rule: 'event_type in {permission_escalation, policy_override, access_violation}' },
      { id: 'R4', label: 'cold_start_with_history', rule: 'entity_age_days < 60 and prior_flagged_count > 0' },
      { id: 'R5', label: 'burst', rule: 'time_since_last_event_hours < 1.0' },
    ],
    flagRule: 'rule_flag = 1 if (R1+R2+R3+R4+R5) >= 2 else 0',
    testReference: { n: 2267, precision: 0.116, recall: 0.17901234567901234, f1: 0.1407766990291262, nFlagged: 250 },
  },
  featureColumns: [
    'entity_age_days', 'prior_events_count', 'prior_flagged_count', 'prior_flagged_rate',
    'is_first_event', 'time_since_last_event_hours_filled', 'hour_sin', 'hour_cos',
    'day_of_week', 'is_weekend', 'is_off_hours', 'month', 'value_amount', 'log_value_amount',
    'log_value_amount_sq', 'event_type', 'source_system', 'severity_reported', 'entity_type',
    'region', 'tier', 'risk_segment_baseline',
  ],
  excludedColumns: [
    'analyst_notes_length', 'auto_resolved_flag', 'confirmed_loss_amount', 'entity_id',
    'event_id', 'event_timestamp', 'is_risk_flag', 'resolution_minutes', 'split',
  ],
  models: [
    { model: 'majority_baseline', valRocAuc: 0.5, valPrAuc: 0.08529411764705883, testRocAuc: 0.5, testPrAuc: 0.07146007940008822 },
    { model: 'logistic_regression', valRocAuc: 0.6552832908304691, valPrAuc: 0.18240588921485315, testRocAuc: 0.6540189437259905, testPrAuc: 0.14327766846252177 },
    { model: 'random_forest', valRocAuc: 0.6335070406918727, valPrAuc: 0.16852656140359362, testRocAuc: 0.5919034632415471, testPrAuc: 0.12314792623598175 },
  ],
  selectedModel: 'logistic_regression',
  selectionReason: 'Selected on validation average precision (PR-AUC) only: logistic_regression = 0.1824 vs random_forest = 0.1685.',
  split: {
    train: { start: '2023-01-01', end: '2024-08-14', rows: 7367, positiveRate: 0.06882041536582055 },
    validation: { start: '2024-08-14', end: '2024-12-26', rows: 1700, positiveRate: 0.08529411764705883 },
    test: { start: '2024-12-26', end: '2025-06-30', rows: 2267, positiveRate: 0.07146007940008822 },
  },
  policy: {
    label: 'Top 12% by score',
    capacityShare: 0.12,
  },
  policyMetrics: {
    validation: { nReviewed: 204, precision: 0.20098039215686275, recall: 0.2827586206896552, f1: 0.2349570200573066, lift: 2.3563218390804597 },
    test: { nReviewed: 272, precision: 0.1801470588235294, recall: 0.30246913580246915, f1: 0.22580645161290322, lift: 2.520946804647785 },
  },
  comparison: {
    headline: { nReviewed: 272, mlTruePositives: 49, rulesTruePositives: 31, additionalCaptured: 18, ratio: 1.5806451612903227 },
    test: {
      totalPositives: 162,
      ml: { precision: 0.1801470588235294, recall: 0.30246913580246915, f1: 0.22580645161290322 },
      rules: { precision: 0.11397058823529412, recall: 0.19135802469135801, f1: 0.14285714285714285 },
    },
  },
  drivers: {
    positive: [
      { feature: 'event_type_permission_escalation', coefficient: 0.709931790927336 },
      { feature: 'severity_reported_critical', coefficient: 0.6403557266759333 },
      { feature: 'log_value_amount_sq', coefficient: 0.5450982750176259 },
      { feature: 'risk_segment_baseline_high', coefficient: 0.22449964765135297 },
      { feature: 'source_system_unknown', coefficient: 0.21377217064297221 },
    ],
    negative: [
      { feature: 'log_value_amount', coefficient: -0.5275635190736293 },
      { feature: 'event_type_config_change', coefficient: -0.5270490949799491 },
      { feature: 'severity_reported_low', coefficient: -0.5184093651275725 },
      { feature: 'source_system_mobile', coefficient: -0.41619218455643453 },
      { feature: 'entity_type_device', coefficient: -0.22133205722240484 },
    ],
  },
  limitations: [
    'Fully synthetic operational data; no real entities, telemetry, or incidents',
    'Moderate predictive signal (test ROC-AUC ~0.65, PR-AUC ~0.14 vs a 7.1% base rate)',
    'risk_score ranks review priority; it is not a calibrated probability',
    'Rules baseline is deliberately simple and not tuned — it establishes a floor, not a competitive alternative',
    'No hyperparameter tuning beyond fixed, reasonable defaults',
    'Not an automated decision system — supports reminder/review prioritization only',
    'No causal claims; associations reflect intentional generator design, not real operational risk patterns',
  ],
}
