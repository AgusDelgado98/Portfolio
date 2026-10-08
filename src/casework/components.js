import { lazy } from 'react'

/**
 * Visual implementation of each case study. Routing metadata stays in
 * projects/caseStudies.js; this map only names the component. React.lazy
 * keeps every case, and the modules it imports, out of the initial chunk.
 */
const CASE_COMPONENTS = {
  'paradigm/no-show': lazy(() => import('../components/EngineeringLog.jsx')),
  'paradigm/operational-risk': lazy(() => import('./operational-risk/OperationalRisk.jsx')),
  'providentia/demand-forecasting': lazy(() => import('./demand-forecasting/DemandForecasting.jsx')),
  'providentia/capacity-decision': lazy(() => import('./capacity-decision/CapacityDecision.jsx')),
  'providentia/policy-decision': lazy(() => import('./policy-decision/PolicyDecision.jsx')),
  'aletheia/evidence-case': lazy(() => import('./aletheia/Aletheia.jsx')),
}

export const LAZY_CASE_KEYS = Object.freeze(Object.keys(CASE_COMPONENTS))

export function getLazyCase(projectId, caseSlug) {
  return CASE_COMPONENTS[`${projectId}/${caseSlug}`] ?? null
}
