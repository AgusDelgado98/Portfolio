import { uiEs, uiEn } from './messages/ui.js'
import { caseworkEs, caseworkEn } from './messages/casework.js'
import { homeEs, homeEn } from './messages/home.js'
import { profileExperienceEs, profileExperienceEn } from './messages/profileExperience.js'

/**
 * The current professional profile (role, dates, hero line, contact facts) is
 * kept in profileExperience.js and layered over the UI catalog, so it stays the
 * single source for the About role details and every profile sentence.
 */
function withProfileExperience(ui, profile) {
  return {
    ...ui,
    meta: { ...ui.meta, ...profile.meta },
    hero: { ...ui.hero, ...profile.hero },
    contact: {
      ...ui.contact,
      ...profile.contact,
      tags: { ...ui.contact?.tags, ...profile.contact?.tags },
      aboutFacts: { ...ui.contact?.aboutFacts, ...profile.contact?.aboutFacts },
    },
    home: { ...ui.home, ...profile.home, hero: { ...ui.home?.hero, ...profile.home?.hero } },
  }
}

const currentUiEs = withProfileExperience(uiEs, profileExperienceEs)
const currentUiEn = withProfileExperience(uiEn, profileExperienceEn)

/**
 * Copy the shell needs on every route: chrome, Home, and the short case
 * titles Project Detail and the document title read. The long case-study
 * namespaces load with their own chunks (i18n/caseCopy.js).
 */
export const coreTranslations = {
  es: {
    ...currentUiEs,
    home: { ...currentUiEs.home, ...homeEs, hero: { ...currentUiEs.home?.hero, ...homeEs.hero } },
    casework: caseworkEs,
  },
  en: {
    ...currentUiEn,
    home: { ...currentUiEn.home, ...homeEn, hero: { ...currentUiEn.home?.hero, ...homeEn.hero } },
    casework: caseworkEn,
  },
}
