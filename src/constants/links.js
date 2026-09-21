/** Paradigm public app / ecosystem hub — only Paradigm sheets should link here. */
export const PARADIGM_APP_URL = 'https://paradigm-web-swart.vercel.app/'
/** Public UI repo — not the private ML pipeline. */
export const PARADIGM_WEB_REPO_URL = 'https://github.com/AgusDelgado98/Paradigm-Web'
/** Paradigm source is private — do not render as a public outbound link. */
export const PARADIGM_REPO_PUBLIC = false
export const PARADIGM_REPO_URL = null

/** Soma source is private — no public GitHub CTA. */
export const SOMA_REPO_PUBLIC = false
export const SOMA_DEMO_VIDEO_SRC = '/media/soma-linkedin-demo.webm'
export const SOMA_DEMO_POSTER_SRC = '/media/soma-linkedin-demo-poster.png'

export const PROVIDENTIA_REPO_URL = 'https://github.com/AgusDelgado98/PROVIDENTIA'
export const PROVIDENTIA_FORECAST_SRC = '/media/providentia/representative-forecasts.png'
export const PROVIDENTIA_EXCEEDANCE_SRC = '/media/providentia/decision-exceedance-by-policy.png'

/** Hogares source (medical multi-site app) is private — no public GitHub CTA. */
export const HOGARES_REPO_PUBLIC = false

/** Kairós source (personal local-first library) is private — no public GitHub CTA. */
export const KAIROS_REPO_PUBLIC = false
export const KAIROS_OVERVIEW_SRC = '/media/kairos/01-kairos-overview.png'
export const KAIROS_LIBRARY_SRC = '/media/kairos/02-kairos-library-or-reader.png'

export const TEKMERION_REPO_URL = 'https://github.com/AgusDelgado98/Tekmerion'
export const TEKMERION_SHOWROOM_SRC = '/media/tekmerion/01-home-showroom.png'
export const TEKMERION_RULES_VS_ML_SRC = '/media/tekmerion/05-rules-vs-ml.png'

export const CAELUM_REPO_URL = 'https://github.com/AgusDelgado98/caelum-health-analytics'

export const CLARUSFLOW_REPO_URL = 'https://github.com/AgusDelgado98/ClarusFlow'
export const CLARUSFLOW_REVENUE_SRC = '/media/clarusflow/revenue_by_plan.png'
export const CLARUSFLOW_RISK_SRC = '/media/clarusflow/customer_risk_summary.png'

export const LUMENVOX_REPO_URL = 'https://github.com/AgusDelgado98/Lumenvox'
export const LUMENVOX_CONFUSION_SRC = '/media/lumenvox/confusion_matrix_linear_svc.png'
export const LUMENVOX_UNRESOLVED_SRC = '/media/lumenvox/unresolved_critical_by_area.png'

export const ENGINEERING_LOG_HASH = '#engineering-log'
export const CLINIC_CASE_EVIDENCE_BASE = '/engineering-log/clinic-no-show'
export const PARADIGM_LEAD_CHART_SRC = `${CLINIC_CASE_EVIDENCE_BASE}/charts/noshow_by_lead_bucket.png`
export const PARADIGM_IMPORTANCE_CHART_SRC = `${CLINIC_CASE_EVIDENCE_BASE}/charts/permutation_importance.png`

export function isEngineeringLogHash(hash = typeof window !== 'undefined' ? window.location.hash : '') {
  return hash === ENGINEERING_LOG_HASH || hash.startsWith(`${ENGINEERING_LOG_HASH}/`)
}

/**
 * Casework routing (scaffold for #casework and #casework/<slug>).
 * #engineering-log stays a legacy alias for the "no-show" case slug — it is
 * not being renamed or redirected, just recognized as an equivalent route.
 */
export const CASEWORK_HASH = '#casework'
export const CASEWORK_ARCHIVE_SLUG = 'archive'
export const CASEWORK_ARCHIVE_HASH = `${CASEWORK_HASH}/${CASEWORK_ARCHIVE_SLUG}`
export const NO_SHOW_CASE_SLUG = 'no-show'
export const CASEWORK_NO_SHOW_HASH = `${CASEWORK_HASH}/${NO_SHOW_CASE_SLUG}`

export const OPERATIONAL_RISK_CASE_SLUG = 'operational-risk'
export const CASEWORK_OPERATIONAL_RISK_HASH = `${CASEWORK_HASH}/${OPERATIONAL_RISK_CASE_SLUG}`
/** Evidence Pack base for Case 02 — served as static assets from public/. */
export const OPERATIONAL_RISK_EVIDENCE_BASE = '/casework/operational-risk/evidence-pack'

export const DEMAND_FORECASTING_CASE_SLUG = 'demand-forecasting'
export const CASEWORK_DEMAND_FORECASTING_HASH = `${CASEWORK_HASH}/${DEMAND_FORECASTING_CASE_SLUG}`
/** Evidence Pack base for Case 03 — served as static assets from public/. */
export const DEMAND_FORECASTING_EVIDENCE_BASE = '/casework/demand-forecasting/evidence-pack'

export const CAPACITY_DECISION_CASE_SLUG = 'capacity-decision'
export const CASEWORK_CAPACITY_DECISION_HASH = `${CASEWORK_HASH}/${CAPACITY_DECISION_CASE_SLUG}`
/** Evidence Pack base for Case 04 — served as static assets from public/. */
export const CAPACITY_DECISION_EVIDENCE_BASE = '/casework/capacity-decision/evidence-pack'

export const POLICY_DECISION_CASE_SLUG = 'policy-decision'
export const CASEWORK_POLICY_DECISION_HASH = `${CASEWORK_HASH}/${POLICY_DECISION_CASE_SLUG}`
/**
 * Evidence Pack base for Case 05 (PROVIDENTIA PDI — Policy & Decision
 * Intelligence). A direct copy of PROVIDENTIA's own
 * public_export/case05_pdi_policy_evaluation/ (README, claims contract,
 * portfolio manifest) — same treatment Cases 03/04 already got. Thinner
 * than 03/04 on purpose: no notebook/CSV/figures exist in that pack — PDI-4
 * numbers are quoted in casework/policy-decision/data.js instead of
 * re-hosting reports/pdi4/*'s raw files, which aren't part of the
 * project's own public evidence pack.
 */
export const POLICY_DECISION_EVIDENCE_BASE = '/casework/policy-decision/evidence-pack'

/**
 * ALETHEIA — Evidence Case (Data & BI). Routed under #casework/<slug> like
 * other evidence pages, but classified as Evidence Case — not Casework 01–05.
 * Final GitHub URL / freeze metadata land here after ALETHEIA closeout;
 * do not invent them in the portfolio layer.
 */
export const ALETHEIA_CASE_SLUG = 'aletheia'
export const CASEWORK_ALETHEIA_HASH = `${CASEWORK_HASH}/${ALETHEIA_CASE_SLUG}`
export const CASEWORK_ALETHEIA_RESEARCH_HASH = `${CASEWORK_ALETHEIA_HASH}/research`
export const ALETHEIA_EVIDENCE_BASE = '/casework/aletheia/evidence-pack'
/** Set only after the ALETHEIA public repo URL is frozen. */
export const ALETHEIA_REPO_URL = null

/**
 * Resolves a location hash to a casework route.
 * - `#engineering-log(/...)` → legacy alias, resolves to the no-show slug.
 * - `#casework` → in casework, no slug picked (caller decides the default).
 * - `#casework/<slug>` → in casework, with that slug (caller validates it —
 *   an unknown slug is returned as-is, not silently mapped to any case).
 * - `#casework/<slug>/<section>` → optional in-case section (e.g. ALETHEIA research).
 * - anything else → not casework.
 */
export function parseCaseworkHash(hash = typeof window !== 'undefined' ? window.location.hash : '') {
  if (isEngineeringLogHash(hash)) {
    return { inCasework: true, slug: NO_SHOW_CASE_SLUG, section: null }
  }

  if (hash === CASEWORK_HASH) {
    return { inCasework: true, slug: null, section: null }
  }

  if (hash.startsWith(`${CASEWORK_HASH}/`)) {
    const rest = hash.slice(CASEWORK_HASH.length + 1)
    const parts = rest.split(/[/?#]/).filter(Boolean)
    return {
      inCasework: true,
      slug: parts[0] || null,
      section: parts[1] || null,
    }
  }

  return { inCasework: false, slug: null, section: null }
}
