import { CLINIC_CASE_EVIDENCE_BASE } from '../../constants/links.js'

const BASE = CLINIC_CASE_EVIDENCE_BASE

/** Minimal offline fallback — mirrors published artifact values when fetch fails. */
export const FALLBACK_EVIDENCE = {
  source: 'fallback',
  project_summary: {
    name: 'Clinic No-Show Case Study',
    domain: 'Private outpatient clinic operations (synthetic)',
    objective: 'Prioritize appointment confirmation outreach for no-show risk',
    pipeline_version: '1.1.0',
    seed: 42,
    generated_at_utc: null,
  },
  dataset_dimensions: {
    cleaned_appointments: 12000,
    eligible_modeling_rows: 10496,
    eligible_positive_rate: 0.1444,
    professionals: 6,
    specialties: 6,
    patients: 2800,
    date_start: '2023-01-02',
    date_end: '2025-06-30',
  },
  data_quality_changes: [
    {
      step: 'drop_duplicate_appointment_ids',
      rows_before: 12008,
      rows_after: 12000,
      rows_removed: 8,
      rule: 'keep first occurrence of each appointment_id',
    },
    {
      step: 'normalize_booking_channel',
      casing_fixed_rows: 180,
      allowed: ['web', 'phone', 'reception'],
    },
    {
      step: 'impute_null_categories',
      city_zone_nulls_labeled: 144,
      insurance_type_nulls_labeled: 96,
      fill_value: 'unknown',
    },
    {
      step: 'fix_specialty_from_professional',
      mismatches_corrected: 48,
      rule: 'appointments.specialty := professionals.specialty_code',
    },
    { step: 'recompute_lead_time_and_cast_types', rows: 12000 },
  ],
  key_insights: [
    {
      id: 'eligible_base_rate',
      finding: 'Eligible no-show rate is 14.4% (cancellations 12.5% of all bookings).',
      operational_implication: 'Reminder capacity should target the eligible universe, not cancelled slots.',
    },
    {
      id: 'lead_time',
      finding: 'No-show rises with lead time (0-3d: 6.7% on n=15; 15-30d: 15.3%).',
      operational_implication: 'Longer booking horizons remain priority candidates for confirmation outreach.',
      caveat: 'Pattern was intentionally injected by the generator; extreme buckets may be sparse.',
    },
    {
      id: 'channel',
      finding: 'Phone bookings (16.4%) exceed reception (10.7%).',
      operational_implication: 'Channel-specific reminder scripts may be warranted in a live setting.',
      caveat: 'Synthetic association; not causal proof that phone booking causes no-shows.',
    },
    {
      id: 'specialty',
      finding: 'Dermatology (17.2%) and gynecology (16.3%) sit above pediatrics (10.6%).',
      operational_implication: 'Specialty-level staffing buffers differ; avoid one-size-fits-all overbooking.',
      caveat: 'One professional per specialty in this synthetic design.',
    },
    {
      id: 'history',
      finding: 'Patients with prior no-shows show elevated risk versus first-visit and clean repeats.',
      operational_implication: 'History-aware prioritization is more actionable than demographics alone.',
      caveat: 'History features are generator-aligned and known before the visit.',
    },
  ],
  split: {
    strategy: 'temporal_train_validation_test_by_appointment_date',
    validation_cutoff_date: '2024-08-16',
    test_cutoff_date: '2024-12-31',
    train_rows: 6809,
    validation_rows: 1580,
    test_rows: 2107,
    train_start: '2023-01-02',
    train_end: '2024-08-15',
    validation_start: '2024-08-16',
    validation_end: '2024-12-30',
    test_start: '2024-12-31',
    test_end: '2025-06-30',
    train_positive_rate: 0.1477,
    validation_positive_rate: 0.1456,
    test_positive_rate: 0.1329,
    feature_columns: [
      'lead_time_days',
      'appointment_hour',
      'day_of_week',
      'month',
      'previous_appointments',
      'previous_no_shows',
      'historical_no_show_rate',
      'is_first_appointment',
      'is_weekend',
      'is_week_edge',
      'high_risk_channel',
      'scheduled_duration_minutes',
      'rescheduled_flag',
      'patient_age',
      'specialty',
      'booking_channel',
      'insurance_type',
      'city_zone',
      'patient_gender',
      'lead_time_bucket',
      'hour_band',
      'age_group_feat',
    ],
    excluded_columns: [
      'actual_duration_minutes',
      'waiting_time_minutes',
      'no_show_flag',
      'cancellation_flag',
      'attended_flag',
      'appointment_id',
      'patient_id',
      'professional_id',
      'appointment_date',
      'booking_date',
    ],
    modeling_population: 'cancellation_flag == 0 (eligible attended ∪ no-show)',
    protocol: {
      fit_on: 'train',
      select_model_and_threshold_on: 'validation',
      report_final_metrics_on: 'test (untouched; no tuning)',
    },
  },
  selected_model: 'logistic_regression',
  selection_reason:
    'On validation, logistic regression is within 0.02 AP of best model (random_forest, AP=0.209); prefer interpretability for ops review. Final reported metrics use the untouched temporal test fold only.',
  threshold: 0.4114175304145893,
  threshold_source: 'validation',
  validation_metrics: {
    ranking: { roc_auc: 0.6005, average_precision: 0.1909, brier_score: 0.2463 },
    at_selected_threshold: {
      threshold: 0.4114,
      precision: 0.1764,
      recall: 0.9087,
      f1: 0.2954,
      predicted_positive_rate: 0.75,
    },
  },
  final_test_metrics: {
    ranking: { roc_auc: 0.6052, average_precision: 0.1776, brier_score: 0.2657 },
    at_selected_threshold: {
      threshold: 0.4114,
      precision: 0.153,
      recall: 0.8643,
      f1: 0.2599,
      predicted_positive_rate: 0.7508,
      confusion_matrix: { tn: 487, fp: 1340, fn: 38, tp: 242 },
    },
  },
  limitations: [
    'Fully synthetic operational data',
    'Moderate predictive signal',
    'Scores not fully calibrated; use for ranking',
    'One professional per specialty',
    'No clinical prediction or causal claims',
    'Not an automated decision system',
  ],
  model_comparison: [
    {
      model: 'majority_baseline',
      val_roc_auc: 0.5,
      val_average_precision: 0.1456,
      test_roc_auc: 0.5,
      test_average_precision: 0.1329,
    },
    {
      model: 'logistic_regression',
      val_roc_auc: 0.6005,
      val_average_precision: 0.1909,
      test_roc_auc: 0.6052,
      test_average_precision: 0.1776,
      selected_threshold: 0.4114,
      test_precision_at_selected: 0.153,
      test_recall_at_selected: 0.8643,
      test_f1_at_selected: 0.2599,
    },
    {
      model: 'random_forest',
      val_roc_auc: 0.6352,
      val_average_precision: 0.2088,
      test_roc_auc: 0.5828,
      test_average_precision: 0.1662,
    },
    {
      model: 'hist_gradient_boosting',
      val_roc_auc: 0.6125,
      val_average_precision: 0.1874,
      test_roc_auc: 0.579,
      test_average_precision: 0.1621,
    },
  ],
  drivers: {
    positive: [
      { feature: 'previous_appointments', coefficient: 1.241 },
      { feature: 'insurance_type_unknown', coefficient: 0.649 },
      { feature: 'patient_gender_unknown', coefficient: 0.547 },
      { feature: 'age_group_feat_0_17', coefficient: 0.398 },
      { feature: 'patient_age', coefficient: 0.286 },
    ],
    negative: [
      { feature: 'rescheduled_flag', coefficient: -1.665 },
      { feature: 'previous_no_shows', coefficient: -1.339 },
      { feature: 'specialty_pediatrics', coefficient: -0.473 },
      { feature: 'age_group_feat_65_plus', coefficient: -0.394 },
      { feature: 'insurance_type_social_security', coefficient: -0.306 },
    ],
  },
  charts: {
    lead_time: `${BASE}/charts/noshow_by_lead_bucket.png`,
    channel: `${BASE}/charts/noshow_by_channel.png`,
    specialty: `${BASE}/charts/noshow_by_specialty.png`,
    hour: `${BASE}/charts/noshow_by_hour.png`,
    roc: `${BASE}/charts/roc_curves.png`,
    pr: `${BASE}/charts/pr_curves.png`,
    importance: `${BASE}/charts/permutation_importance.png`,
    confusion: `${BASE}/charts/confusion_matrix_selected.png`,
  },
  missingArtifacts: [],
}

export const NARRATIVE = {
  specialties: [
    'cardiology',
    'neurology',
    'pediatrics',
    'dermatology',
    'general medicine',
    'gynecology',
  ],
  entities: [
    { id: 'patients', label: 'Patients', note: '~2,800 synthetic patients' },
    { id: 'professionals', label: 'Professionals', note: '6 clinicians · 1 per specialty' },
    { id: 'specialties', label: 'Specialties', note: '6 outpatient specialties' },
    { id: 'appointments', label: 'Appointments', note: '12,000 cleaned bookings' },
  ],
  relationships: [
    'Patient → many Appointments',
    'Professional → Specialty (1:1 in this design)',
    'Appointment → Patient + Professional + Specialty',
  ],
  featureExamples: [
    { name: 'lead_time_bucket', from: 'lead_time_days', note: 'Discrete horizon bands' },
    { name: 'historical_no_show_rate', from: 'prior outcomes', note: 'Known at booking time' },
    { name: 'hour_band', from: 'appointment_hour', note: 'Morning / afternoon / late' },
    { name: 'age_group_feat', from: 'patient_age', note: 'Operational age bands' },
    { name: 'is_first_appointment', from: 'previous_appointments', note: 'First-visit indicator' },
    { name: 'day_of_week / month', from: 'appointment_date', note: 'Calendar seasonality' },
  ],
  leakageHighlights: [
    'waiting_time_minutes',
    'actual_duration_minutes',
    'no_show_flag (target)',
    'cancellation_flag / attended_flag',
    'appointment_id / patient_id / professional_id',
  ],
  productFlow: [
    'Overview',
    'Quality',
    'Patterns',
    'Model',
    'Drivers',
    'Prioritization',
    'Limitations',
  ],
  delivered: [
    'Reproducible synthetic dataset (seed 42)',
    'Cleaning and validation pipeline',
    'Exploratory analysis with selected charts',
    'Temporal ML evaluation protocol',
    'Interpretable logistic risk model',
    'Paradigm Clinic Case Study workspace',
    'Portfolio evidence pack (manifest + charts)',
  ],
}

function chartUrl(relativePath) {
  if (!relativePath) return null
  const cleaned = relativePath
    .replace(/^artifacts\//, '')
    .replace(/^\.\//, '')
  return `${BASE}/${cleaned}`
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(',')
  return lines.slice(1).map((line) => {
    const cols = line.split(',')
    const row = {}
    headers.forEach((h, i) => {
      const raw = cols[i] ?? ''
      const num = Number(raw)
      row[h] = raw === '' || Number.isNaN(num) ? (raw === '' ? null : raw) : num
    })
    return row
  })
}

function splitDrivers(coefficients = []) {
  const sorted = [...coefficients].sort(
    (a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient),
  )
  const positive = sorted.filter((c) => c.coefficient > 0).slice(0, 5)
  const negative = sorted.filter((c) => c.coefficient < 0).slice(0, 5)
  return { positive, negative }
}

async function fetchJson(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed ${path}: ${res.status}`)
  const text = await res.text()
  return JSON.parse(text.replace(/^\uFEFF/, ''))
}

async function fetchText(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed ${path}: ${res.status}`)
  return res.text()
}

/**
 * Loads the Clinic No-Show evidence pack from public artifacts.
 * Falls back to embedded values for any missing file.
 */
export async function loadClinicNoShowEvidence() {
  const missing = []
  let manifest = null
  let finalMetrics = null
  let comparison = null
  let importance = null
  let quality = null

  try {
    manifest = await fetchJson(`${BASE}/portfolio_manifest.json`)
  } catch {
    missing.push('portfolio_manifest.json')
  }

  try {
    finalMetrics = await fetchJson(`${BASE}/final_metrics.json`)
  } catch {
    missing.push('final_metrics.json')
  }

  try {
    comparison = parseCsv(await fetchText(`${BASE}/model_comparison.csv`))
  } catch {
    missing.push('model_comparison.csv')
  }

  try {
    importance = await fetchJson(`${BASE}/feature_importance.json`)
  } catch {
    missing.push('feature_importance.json')
  }

  try {
    quality = await fetchJson(`${BASE}/data_quality_summary.json`)
  } catch {
    missing.push('data_quality_summary.json')
  }

  if (!manifest && missing.includes('portfolio_manifest.json')) {
    return { ...FALLBACK_EVIDENCE, missingArtifacts: missing, source: 'fallback' }
  }

  const base = manifest || FALLBACK_EVIDENCE
  const testMetrics =
    finalMetrics?.test_metrics ||
    finalMetrics?.final_test_metrics ||
    base.final_test_metrics
  const validationMetrics = finalMetrics?.validation_metrics || base.validation_metrics

  const charts = {
    lead_time: chartUrl('charts/noshow_by_lead_bucket.png'),
    channel: chartUrl('charts/noshow_by_channel.png'),
    specialty: chartUrl('charts/noshow_by_specialty.png'),
    hour: chartUrl('charts/noshow_by_hour.png'),
    roc: chartUrl('charts/roc_curves.png'),
    pr: chartUrl('charts/pr_curves.png'),
    importance: chartUrl('charts/permutation_importance.png'),
    confusion: chartUrl('charts/confusion_matrix_selected.png'),
  }

  const drivers = importance?.coefficients
    ? splitDrivers(importance.coefficients)
    : FALLBACK_EVIDENCE.drivers

  const qualityChanges =
    base.data_quality_changes ||
    (quality
      ? [
          {
            step: 'summary',
            rows_before: quality.rows_before ?? quality.before?.rows,
            rows_after: quality.rows_after ?? quality.after?.rows,
          },
        ]
      : FALLBACK_EVIDENCE.data_quality_changes)

  return {
    source: missing.length ? 'partial' : 'live',
    project_summary: base.project_summary,
    dataset_dimensions: {
      ...FALLBACK_EVIDENCE.dataset_dimensions,
      ...base.dataset_dimensions,
    },
    data_quality_changes: qualityChanges,
    key_insights: base.key_insights || FALLBACK_EVIDENCE.key_insights,
    split: base.split || FALLBACK_EVIDENCE.split,
    selected_model: finalMetrics?.selected_model || base.selected_model,
    selection_reason: finalMetrics?.selection_reason || FALLBACK_EVIDENCE.selection_reason,
    threshold: finalMetrics?.threshold ?? base.threshold,
    threshold_source: finalMetrics?.threshold_source || base.threshold_source,
    validation_metrics: validationMetrics,
    final_test_metrics: testMetrics,
    limitations: base.limitations || FALLBACK_EVIDENCE.limitations,
    model_comparison: comparison?.length ? comparison : FALLBACK_EVIDENCE.model_comparison,
    drivers,
    charts,
    missingArtifacts: missing,
  }
}

export function formatPct(value, digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return `${(Number(value) * 100).toFixed(digits)}%`
}

export function formatNum(value, digits = 3) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return Number(value).toFixed(digits)
}

export function formatInt(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return Number(value).toLocaleString('en-US')
}

export function humanizeModel(name) {
  if (!name) return '—'
  return String(name).replace(/_/g, ' ')
}

export function humanizeStep(step) {
  return String(step || '').replace(/_/g, ' ')
}
