import { uiEs, uiEn } from './messages/ui.js'
import { elogEs, elogEn } from './messages/elog.js'
import { caseworkEs, caseworkEn } from './messages/casework.js'
import { operationalRiskEs, operationalRiskEn } from './messages/operationalRisk.js'
import { demandForecastingEs, demandForecastingEn } from './messages/demandForecasting.js'
import { capacityDecisionEs, capacityDecisionEn } from './messages/capacityDecision.js'
import { policyDecisionEs, policyDecisionEn } from './messages/policyDecision.js'
import { aletheiaEs, aletheiaEn } from './messages/aletheia.js'
import { guideEs, guideEn } from './messages/guide.js'
import { profileExperienceEs, profileExperienceEn } from './messages/profileExperience.js'

function withProfileExperience(ui, profile) {
  return {
    ...ui,
    meta: {
      ...ui.meta,
      ...profile.meta,
    },
    hero: {
      ...ui.hero,
      ...profile.hero,
    },
    contact: {
      ...ui.contact,
      ...profile.contact,
      tags: {
        ...ui.contact.tags,
        ...profile.contact?.tags,
      },
      aboutFacts: {
        ...ui.contact.aboutFacts,
        ...profile.contact?.aboutFacts,
      },
    },
    home: {
      ...ui.home,
      ...profile.home,
      hero: {
        ...ui.home.hero,
        ...profile.home?.hero,
      },
    },
  }
}

const currentUiEs = withProfileExperience(uiEs, profileExperienceEs)
const currentUiEn = withProfileExperience(uiEn, profileExperienceEn)

export const translations = {
  es: {
    ...currentUiEs,
    elog: elogEs,
    casework: caseworkEs,
    operationalRisk: operationalRiskEs,
    demandForecasting: demandForecastingEs,
    capacityDecision: capacityDecisionEs,
    policyDecision: policyDecisionEs,
    aletheia: aletheiaEs,
    guide: guideEs,
  },
  en: {
    ...currentUiEn,
    elog: elogEn,
    casework: caseworkEn,
    operationalRisk: operationalRiskEn,
    demandForecasting: demandForecastingEn,
    capacityDecision: capacityDecisionEn,
    policyDecision: policyDecisionEn,
    aletheia: aletheiaEn,
    guide: guideEn,
  },
}
