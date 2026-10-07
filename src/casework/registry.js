import EngineeringLog from '../components/EngineeringLog.jsx'
import OperationalRisk from './operational-risk/OperationalRisk.jsx'
import DemandForecasting from './demand-forecasting/DemandForecasting.jsx'
import CapacityDecision from './capacity-decision/CapacityDecision.jsx'
import PolicyDecision from './policy-decision/PolicyDecision.jsx'
import Aletheia from './aletheia/Aletheia.jsx'
import {
  CASEWORK_NO_SHOW_HASH,
  CASEWORK_OPERATIONAL_RISK_HASH,
  CASEWORK_DEMAND_FORECASTING_HASH,
  CASEWORK_CAPACITY_DECISION_HASH,
  CASEWORK_POLICY_DECISION_HASH,
  CASEWORK_ALETHEIA_HASH,
  NO_SHOW_CASE_SLUG,
  OPERATIONAL_RISK_CASE_SLUG,
  DEMAND_FORECASTING_CASE_SLUG,
  CAPACITY_DECISION_CASE_SLUG,
  POLICY_DECISION_CASE_SLUG,
  ALETHEIA_CASE_SLUG,
} from '../constants/links.js'

/**
 * Casework registry: legacy slug -> { component, hash, projectId, caseSlug, meta }.
 *
 * This module is now ONLY the map from a case study to the React component that
 * renders it (and the data the Home teaser still reads). ROUTING is not here:
 * the router resolves `#projects/<project>/<case>` from projects/caseStudies.js
 * and App.jsx finds the component with `getCaseworkComponentForCase` below,
 * through the explicit `projectId` + `caseSlug` link on every entry.
 * `hash` is the case's canonical hash.
 *
 * `meta` carries the non-translatable bits (case number, i18n key,
 * product/system name). The actual copy (title, tags) lives under
 * `casework.cases.<i18nKey>` in i18n/messages/casework.js.
 *
 * Entries stay keyed by the case's legacy slug (the `*_CASE_SLUG` constants).
 * Transitional: F6 replaces this map with lazy-loaded components
 * (casework/components.js) and retires the source-inspection test that guards
 * it.
 *
 * To add a case later: add it to projects/caseStudies.js, add an entry here
 * and its i18n copy.
 */
export const caseworkRegistry = {
  [NO_SHOW_CASE_SLUG]: {
    slug: NO_SHOW_CASE_SLUG,
    hash: CASEWORK_NO_SHOW_HASH,
    component: EngineeringLog,
    projectId: 'paradigm',
    caseSlug: 'no-show',
    meta: {
      number: '01',
      i18nKey: 'noShow',
      system: 'Paradigm',
    },
  },
  [OPERATIONAL_RISK_CASE_SLUG]: {
    slug: OPERATIONAL_RISK_CASE_SLUG,
    hash: CASEWORK_OPERATIONAL_RISK_HASH,
    component: OperationalRisk,
    projectId: 'paradigm',
    caseSlug: 'operational-risk',
    meta: {
      number: '02',
      i18nKey: 'operationalRisk',
      system: 'Paradigm',
    },
  },
  [DEMAND_FORECASTING_CASE_SLUG]: {
    slug: DEMAND_FORECASTING_CASE_SLUG,
    hash: CASEWORK_DEMAND_FORECASTING_HASH,
    component: DemandForecasting,
    projectId: 'providentia',
    caseSlug: 'demand-forecasting',
    meta: {
      number: '03',
      i18nKey: 'demandForecasting',
      system: 'PROVIDENTIA',
    },
  },
  [CAPACITY_DECISION_CASE_SLUG]: {
    slug: CAPACITY_DECISION_CASE_SLUG,
    hash: CASEWORK_CAPACITY_DECISION_HASH,
    component: CapacityDecision,
    projectId: 'providentia',
    caseSlug: 'capacity-decision',
    meta: {
      number: '04',
      i18nKey: 'capacityDecision',
      system: 'PROVIDENTIA',
    },
  },
  [POLICY_DECISION_CASE_SLUG]: {
    slug: POLICY_DECISION_CASE_SLUG,
    hash: CASEWORK_POLICY_DECISION_HASH,
    component: PolicyDecision,
    projectId: 'providentia',
    caseSlug: 'policy-decision',
    meta: {
      number: '05',
      i18nKey: 'policyDecision',
      system: 'PROVIDENTIA',
    },
  },
  [ALETHEIA_CASE_SLUG]: {
    slug: ALETHEIA_CASE_SLUG,
    hash: CASEWORK_ALETHEIA_HASH,
    component: Aletheia,
    projectId: 'aletheia',
    caseSlug: 'evidence-case',
    meta: {
      // Not Casework 01–05 — Evidence Case under Data & BI.
      classification: 'evidenceCase',
      i18nKey: 'aletheia',
      system: 'ALETHEIA',
    },
  },
}

/** The component that renders `projectId`'s case `caseSlug` (canonical slugs), or null. */
export function getCaseworkComponentForCase(projectId, caseSlug) {
  const entry = Object.values(caseworkRegistry).find(
    (candidate) => candidate.projectId === projectId && candidate.caseSlug === caseSlug,
  )
  return entry?.component || null
}

export function listCaseworkEntries() {
  return Object.values(caseworkRegistry)
}

/**
 * Groups entries by `meta.system`, preserving registry order — no
 * hardcoded case-to-system mapping. Shared by CaseworkIndex.jsx (no longer
 * routed; removed in F6) and Home.jsx (the compact Casework panel, until F3)
 * so both derive the same real "Paradigm 01–02 / PROVIDENTIA 03–05" grouping
 * from one place — Home must not import logic from a UI component.
 */
export function groupBySystem(entries) {
  const order = []
  const bySystem = new Map()
  entries.forEach((entry) => {
    const system = entry.meta.system
    if (!bySystem.has(system)) {
      bySystem.set(system, [])
      order.push(system)
    }
    bySystem.get(system).push(entry)
  })
  return order.map((system) => ({ system, entries: bySystem.get(system) }))
}
