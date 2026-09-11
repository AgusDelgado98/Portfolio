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
 * Casework registry: slug -> { component, hash, meta }.
 *
 * `meta` only carries the non-translatable bits needed to render the
 * #casework index card (case number, i18n key, product/system name).
 * The actual copy (title, tags) lives under `casework.cases.<i18nKey>`
 * in i18n/messages/casework.js, resolved via useLanguage()'s t().
 *
 * To add a case later: add an entry here + its i18n copy — CaseworkIndex
 * renders every registered case generically, no changes needed there.
 *
 * Case 05 (Phase 5) added the same way: no changes to CaseworkIndex,
 * router, or any other case's internals — the existing generic
 * `#casework/<slug>` contract already covers it.
 */
export const caseworkRegistry = {
  [NO_SHOW_CASE_SLUG]: {
    slug: NO_SHOW_CASE_SLUG,
    hash: CASEWORK_NO_SHOW_HASH,
    component: EngineeringLog,
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
    meta: {
      // Not Casework 01–05 — Evidence Case under Data & BI.
      classification: 'evidenceCase',
      i18nKey: 'aletheia',
      system: 'ALETHEIA',
    },
  },
}

export function getCaseworkComponent(slug) {
  return caseworkRegistry[slug]?.component || null
}

export function getCaseworkEntry(slug) {
  return caseworkRegistry[slug] || null
}

export function listCaseworkEntries() {
  return Object.values(caseworkRegistry)
}

/**
 * Groups entries by `meta.system`, preserving registry order — no
 * hardcoded case-to-system mapping. Shared by CaseworkIndex.jsx (the
 * #casework destination) and Home.jsx (the compact Casework panel, Home
 * Visual Polish) so both derive the same real "Paradigm 01–02 / PROVIDENTIA
 * 03–05" grouping from one place — Home must not import logic from a UI
 * component.
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
