import { uiEs, uiEn } from './messages/ui.js'
import { caseworkEs, caseworkEn } from './messages/casework.js'
import { homeEs, homeEn } from './messages/home.js'

/**
 * Copy the shell needs on every route: chrome, Home, and the short case
 * titles Project Detail and the document title read. The long case-study
 * namespaces load with their own chunks (i18n/caseCopy.js).
 */
export const coreTranslations = {
  es: {
    ...uiEs,
    home: homeEs,
    casework: caseworkEs,
  },
  en: {
    ...uiEn,
    home: homeEn,
    casework: caseworkEn,
  },
}
