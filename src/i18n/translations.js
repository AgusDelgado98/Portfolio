import { uiEs, uiEn } from './messages/ui.js'
import { elogEs, elogEn } from './messages/elog.js'
import { caseworkEs, caseworkEn } from './messages/casework.js'
import { operationalRiskEs, operationalRiskEn } from './messages/operationalRisk.js'
import { demandForecastingEs, demandForecastingEn } from './messages/demandForecasting.js'
import { capacityDecisionEs, capacityDecisionEn } from './messages/capacityDecision.js'
import { policyDecisionEs, policyDecisionEn } from './messages/policyDecision.js'
import { aletheiaEs, aletheiaEn } from './messages/aletheia.js'

export const translations = {
  es: {
    ...uiEs,
    elog: elogEs,
    casework: caseworkEs,
    operationalRisk: operationalRiskEs,
    demandForecasting: demandForecastingEs,
    capacityDecision: capacityDecisionEs,
    policyDecision: policyDecisionEs,
    aletheia: aletheiaEs,
  },
  en: {
    ...uiEn,
    elog: elogEn,
    casework: caseworkEn,
    operationalRisk: operationalRiskEn,
    demandForecasting: demandForecastingEn,
    capacityDecision: capacityDecisionEn,
    policyDecision: policyDecisionEn,
    aletheia: aletheiaEn,
  },
}
