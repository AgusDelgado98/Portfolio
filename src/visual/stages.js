/**
 * The fixed vocabulary of Home: DATA → EVIDENCE → PREDICTION → DECISION. These
 * are names, not copy — the same in Spanish and English — so they live here
 * instead of in i18n. (The registry's `PROJECT_STAGES` holds the ids.)
 */
export const STAGE_LABELS = Object.freeze({
  data: 'DATA',
  evidence: 'EVIDENCE',
  prediction: 'PREDICTION',
  decision: 'DECISION',
})
