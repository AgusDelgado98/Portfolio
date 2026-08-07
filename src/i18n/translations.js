import { uiEs, uiEn } from './messages/ui.js'
import { elogEs, elogEn } from './messages/elog.js'

export const translations = {
  es: { ...uiEs, elog: elogEs },
  en: { ...uiEn, elog: elogEn },
}
