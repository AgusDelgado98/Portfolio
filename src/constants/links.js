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
