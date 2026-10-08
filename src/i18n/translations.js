import { coreTranslations } from './translationsCore.js'
import { elogEs, elogEn } from './messages/elog.js'
import { operationalRiskEs, operationalRiskEn } from './messages/operationalRisk.js'
import { demandForecastingEs, demandForecastingEn } from './messages/demandForecasting.js'
import { capacityDecisionEs, capacityDecisionEn } from './messages/capacityDecision.js'
import { policyDecisionEs, policyDecisionEn } from './messages/policyDecision.js'
import { aletheiaEs, aletheiaEn } from './messages/aletheia.js'

/**
 * Full dictionary for tests and any non-bundled reader. The running app uses
 * translationsCore plus the namespaces each case registers on load, so these
 * case files are not part of the initial chunk.
 */
export const translations = {
  es: {
    ...coreTranslations.es,
    elog: elogEs,
    operationalRisk: operationalRiskEs,
    demandForecasting: demandForecastingEs,
    capacityDecision: capacityDecisionEs,
    policyDecision: policyDecisionEs,
    aletheia: aletheiaEs,
  },
  en: {
    ...coreTranslations.en,
    elog: elogEn,
    operationalRisk: operationalRiskEn,
    demandForecasting: demandForecastingEn,
    capacityDecision: capacityDecisionEn,
    policyDecision: policyDecisionEn,
    aletheia: aletheiaEn,
  },
}
