import { uiEs, uiEn } from './messages/ui.js'
import { elogEs, elogEn } from './messages/elog.js'
import { caseworkEs, caseworkEn } from './messages/casework.js'
import { operationalRiskEs, operationalRiskEn } from './messages/operationalRisk.js'
import { demandForecastingEs, demandForecastingEn } from './messages/demandForecasting.js'
import { capacityDecisionEs, capacityDecisionEn } from './messages/capacityDecision.js'

export const translations = {
  es: {
    ...uiEs,
    elog: elogEs,
    casework: caseworkEs,
    operationalRisk: operationalRiskEs,
    demandForecasting: demandForecastingEs,
    capacityDecision: capacityDecisionEs,
  },
  en: {
    ...uiEn,
    elog: elogEn,
    casework: caseworkEn,
    operationalRisk: operationalRiskEn,
    demandForecasting: demandForecastingEn,
    capacityDecision: capacityDecisionEn,
  },
}
