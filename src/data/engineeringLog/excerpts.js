/**
 * Short excerpts that match Paradigm case_studies/clinic_no_show source.
 * Kept as static strings so the portfolio does not ship the full analysis scripts.
 */
export const CODE_EXCERPTS = {
  leakage: {
    label: 'features.py — excluded leakage fields',
    code: `EXCLUDED_FROM_FEATURES = {
    "appointment_id",
    "patient_id",
    "professional_id",
    "waiting_time_minutes",
    "actual_duration_minutes",
    "cancellation_flag",
    "no_show_flag",
    ...
}`,
  },
  temporalSplit: {
    label: 'features.py — temporal cutoffs by appointment_date',
    code: `test_cut = _cutoff_date_for_tail(df, n_test)
pre_test = df[df["appointment_date"] < test_cut]
test = df[df["appointment_date"] >= test_cut]
val_cut = _cutoff_date_for_tail(pre_test, n_val)
train = pre_test[pre_test["appointment_date"] < val_cut]
val = pre_test[pre_test["appointment_date"] >= val_cut]`,
  },
  threshold: {
    label: 'model.py — validation-only threshold rule',
    code: `def select_threshold(y_true, proba):
    """VALIDATION fold only. Max F1 +0.02 if recall >= 0.40."""
    ...
    "selection_rule": (
        "VALIDATION ONLY: max F1 with +0.02 bonus if recall >= 0.40 "
        "(never tuned on final test)"
    )`,
  },
  seed: {
    label: 'config / generation — reproducible seed',
    code: `seed = 42
# regenerate.py → run_pipeline.py
# Same seed rebuilds data, features, and reported metrics.`,
  },
}

export const REPRODUCE_COMMANDS = [
  'python case_studies/clinic_no_show/regenerate.py',
  'python case_studies/clinic_no_show/run_pipeline.py',
]
