import EngineeringLog from '../components/EngineeringLog.jsx'
import OperationalRisk from './operational-risk/OperationalRisk.jsx'
import DemandForecasting from './demand-forecasting/DemandForecasting.jsx'
import CapacityDecision from './capacity-decision/CapacityDecision.jsx'
import {
  CASEWORK_NO_SHOW_HASH,
  CASEWORK_OPERATIONAL_RISK_HASH,
  CASEWORK_DEMAND_FORECASTING_HASH,
  CASEWORK_CAPACITY_DECISION_HASH,
  NO_SHOW_CASE_SLUG,
  OPERATIONAL_RISK_CASE_SLUG,
  DEMAND_FORECASTING_CASE_SLUG,
  CAPACITY_DECISION_CASE_SLUG,
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
