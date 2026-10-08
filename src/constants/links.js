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
export const SOMA_DEMO_POSTER_SRC = '/media/soma-linkedin-demo-poster.webp'

export const PROVIDENTIA_REPO_URL = 'https://github.com/AgusDelgado98/PROVIDENTIA'
export const PROVIDENTIA_FORECAST_SRC = '/media/providentia/representative-forecasts.webp'
export const PROVIDENTIA_EXCEEDANCE_SRC = '/media/providentia/decision-exceedance-by-policy.webp'

/** Hogares source (medical multi-site app) is private — no public GitHub CTA. */
export const HOGARES_REPO_PUBLIC = false

/** Kairós source (personal local-first library) is private — no public GitHub CTA. */
export const KAIROS_REPO_PUBLIC = false
export const KAIROS_OVERVIEW_SRC = '/media/kairos/01-kairos-overview.webp'
export const KAIROS_LIBRARY_SRC = '/media/kairos/02-kairos-library-or-reader.webp'

export const TEKMERION_REPO_URL = 'https://github.com/AgusDelgado98/Tekmerion'
export const TEKMERION_SHOWROOM_SRC = '/media/tekmerion/01-home-showroom.webp'
export const TEKMERION_RULES_VS_ML_SRC = '/media/tekmerion/05-rules-vs-ml.webp'

export const CAELUM_REPO_URL = 'https://github.com/AgusDelgado98/caelum-health-analytics'

export const CLARUSFLOW_REPO_URL = 'https://github.com/AgusDelgado98/ClarusFlow'
export const CLARUSFLOW_REVENUE_SRC = '/media/clarusflow/revenue_by_plan.webp'
export const CLARUSFLOW_RISK_SRC = '/media/clarusflow/customer_risk_summary.webp'

export const LUMENVOX_REPO_URL = 'https://github.com/AgusDelgado98/Lumenvox'
export const LUMENVOX_CONFUSION_SRC = '/media/lumenvox/confusion_matrix_linear_svc.webp'
export const LUMENVOX_UNRESOLVED_SRC = '/media/lumenvox/unresolved_critical_by_area.webp'

export const CLINIC_CASE_EVIDENCE_BASE = '/engineering-log/clinic-no-show'
export const PARADIGM_LEAD_CHART_SRC = `${CLINIC_CASE_EVIDENCE_BASE}/charts/noshow_by_lead_bucket.png`
export const PARADIGM_IMPORTANCE_CHART_SRC = `${CLINIC_CASE_EVIDENCE_BASE}/charts/permutation_importance.png`

/**
 * Canonical case-study routes (PLAN-FROZEN v1.1, F2).
 *
 * A case study lives under its project: `#projects/<project-id>/<case-slug>`
 * (plus an optional in-case section, e.g. ALETHEIA's `/research`). WHICH
 * project owns WHICH case is data in projects/caseStudies.js; this builder only
 * composes the string.
 */
export const PROJECT_CASE_HASH_BASE = '#projects'

export function buildProjectCaseHash(projectId, caseSlug, section = null) {
  const base = `${PROJECT_CASE_HASH_BASE}/${projectId}/${caseSlug}`
  return section ? `${base}/${section}` : base
}

/**
 * Casework case slugs and hashes.
 *
 * The old `#casework/<slug>` and `#engineering-log` URLs are permanent aliases
 * of the canonical routes above; they are resolved by the router
 * (router/legacyHashRoadmap.js, derived from projects/caseStudies.js) and no
 * longer live here. The `*_CASE_SLUG` constants below are the LEGACY slugs
 * (they are also the keys of casework/registry.js).
 *
 * The `CASEWORK_*_HASH` constants keep their NAME — the case components import
 * them for their in-page anchors — but since F2 their VALUE is the canonical
 * `#projects/<project>/<case>` hash. (Renaming them is F6/F7 clean-up.)
 */
export const NO_SHOW_CASE_SLUG = 'no-show'
export const CASEWORK_NO_SHOW_HASH = buildProjectCaseHash('paradigm', NO_SHOW_CASE_SLUG)

export const OPERATIONAL_RISK_CASE_SLUG = 'operational-risk'
export const CASEWORK_OPERATIONAL_RISK_HASH = buildProjectCaseHash('paradigm', OPERATIONAL_RISK_CASE_SLUG)
/** Evidence Pack base for Case 02 — served as static assets from public/. */
export const OPERATIONAL_RISK_EVIDENCE_BASE = '/casework/operational-risk/evidence-pack'

export const DEMAND_FORECASTING_CASE_SLUG = 'demand-forecasting'
export const CASEWORK_DEMAND_FORECASTING_HASH = buildProjectCaseHash('providentia', DEMAND_FORECASTING_CASE_SLUG)
/** Evidence Pack base for Case 03 — served as static assets from public/. */
export const DEMAND_FORECASTING_EVIDENCE_BASE = '/casework/demand-forecasting/evidence-pack'

export const CAPACITY_DECISION_CASE_SLUG = 'capacity-decision'
export const CASEWORK_CAPACITY_DECISION_HASH = buildProjectCaseHash('providentia', CAPACITY_DECISION_CASE_SLUG)
/** Evidence Pack base for Case 04 — served as static assets from public/. */
export const CAPACITY_DECISION_EVIDENCE_BASE = '/casework/capacity-decision/evidence-pack'

export const POLICY_DECISION_CASE_SLUG = 'policy-decision'
export const CASEWORK_POLICY_DECISION_HASH = buildProjectCaseHash('providentia', POLICY_DECISION_CASE_SLUG)
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
 * ALETHEIA — Evidence Case. Routed under its project
 * (`#projects/aletheia/evidence-case`), classified as Evidence Case — not
 * Casework 01–05. Its LEGACY slug (`aletheia`, below) differs from the
 * canonical case slug (`evidence-case`).
 * Final GitHub URL / freeze metadata land here after ALETHEIA closeout;
 * do not invent them in the portfolio layer.
 */
export const ALETHEIA_CASE_SLUG = 'aletheia'
export const ALETHEIA_PROJECT_ID = 'aletheia'
export const ALETHEIA_CASE_STUDY_SLUG = 'evidence-case'
export const CASEWORK_ALETHEIA_HASH = buildProjectCaseHash(ALETHEIA_PROJECT_ID, ALETHEIA_CASE_STUDY_SLUG)
export const CASEWORK_ALETHEIA_RESEARCH_HASH = buildProjectCaseHash(
  ALETHEIA_PROJECT_ID,
  ALETHEIA_CASE_STUDY_SLUG,
  'research',
)
export const ALETHEIA_EVIDENCE_BASE = '/casework/aletheia/evidence-pack'
/** Guided public research experience (live site). */
export const ALETHEIA_WEB_URL = 'https://aletheia-web-seven.vercel.app/'
/** Set only after the ALETHEIA public repo URL is frozen. */
export const ALETHEIA_REPO_URL = null

/** The owner's public profiles (Home's hero and contact strip). */
export const LINKEDIN_URL = 'https://www.linkedin.com/in/agustin-delgado-data98615190/'
export const GITHUB_PROFILE_URL = 'https://github.com/AgusDelgado98'
