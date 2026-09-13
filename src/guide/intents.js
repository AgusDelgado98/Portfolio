import { hasProject } from '../projects/registry.js'
import { CV_HREF } from '../i18n/config.js'

/**
 * Guided Portfolio Experience — estados + versión (Fase 1A) y la
 * adaptación real de Home por intent (Fase 1B).
 *
 * Contrato congelado (v0.2, aprobado): tres estados, ninguno "AI", ninguno
 * modal, "Hiring Pack solo reordena/prioriza contenido existente; no crea
 * copy autoritativo paralelo".
 *
 * `GUIDE_VERSION` es el mecanismo de invalidación pedido por el contrato
 * ("Sin TTL: persistir elección hasta cambio manual o `guide_version`"): un
 * valor guardado en localStorage cuya versión no coincide con esta constante
 * se trata como si no existiera (ver guideStorage.js). Subir este número es
 * la única forma de forzar que todos los visitantes vuelvan a elegir.
 */

export const GUIDE_INTENTS = Object.freeze({
  RECRUITER: 'recruiter',
  TECHNICAL: 'technical',
  DEFAULT: 'default',
})

export const VALID_INTENTS = Object.freeze(Object.values(GUIDE_INTENTS))

export const GUIDE_VERSION = 1

export function isValidIntent(value) {
  return VALID_INTENTS.includes(value)
}

/**
 * Home layout recipe per intent — Fase 1B.
 *
 * The single place any Home behavior branches on `intent`: every value
 * below is a REFERENCE into an existing single source (a project id from
 * projects/registry.js, an i18n key path already used elsewhere, a section
 * key) — never literal copy, never a duplicated fact. `Home.jsx` reads
 * `getHomeLayout(intent)` and renders generically from it instead of
 * scattering `if (intent === ...)` through its JSX.
 *
 * `sections` only ever reorders/selects Home's five existing blocks
 * (hero, selectedWork, casework, toolkit, availability) — none is ever
 * removed, per "Hiring Pack solo reordena/prioriza contenido existente".
 * DEFAULT's array is byte-for-byte the pre-Fase-1B block order, so Default
 * keeps the current Home unchanged, as required.
 */
const HOME_SECTION_ORDER = Object.freeze({
  [GUIDE_INTENTS.DEFAULT]: ['hero', 'selectedWork', 'casework', 'toolkit', 'availability'],
  // Recruiter (Hiring Pack): disponibilidad y CV/Contact suben, justo
  // después del Hero; Casework (la parte más "journey técnico") baja al
  // final — sigue presente, nunca oculta, solo la última en el scan.
  [GUIDE_INTENTS.RECRUITER]: ['hero', 'availability', 'selectedWork', 'toolkit', 'casework'],
  // Technical: Casework/Engineering Log/Evidence sube justo después del
  // Hero — el destino real que un perfil técnico busca primero.
  [GUIDE_INTENTS.TECHNICAL]: ['hero', 'casework', 'selectedWork', 'toolkit', 'availability'],
})

/** The three sections that render a numbered `section-label` — their number reflects each intent's own order, not a hardcoded position. */
export const HOME_NUMBERED_SECTIONS = Object.freeze(['selectedWork', 'casework', 'toolkit'])

/**
 * 2-3 trabajos representativos por intent — ids únicamente; título, stack,
 * territorio y status siguen viniendo de projects/registry.js e
 * i18n/messages/projects.js sin cambios. Recruiter: el escaneo más corto
 * (2, contrato: "2–3 trabajos representativos"); Technical: el set
 * completo (3), con más profundidad para revisar.
 */
const HOME_SELECTED_WORK_IDS = Object.freeze({
  [GUIDE_INTENTS.DEFAULT]: ['providentia', 'caelum', 'paradigm'],
  [GUIDE_INTENTS.RECRUITER]: ['providentia', 'paradigm'],
  [GUIDE_INTENTS.TECHNICAL]: ['providentia', 'paradigm', 'caelum'],
})

/** "Experiencia breve" (contrato, Recruiter) — reutiliza `hero.experience`, copy ya existente (Hero.jsx) pero no renderizada en el Home actual. Ninguna copy nueva. */
const HOME_SHOW_EXPERIENCE_LINE = Object.freeze({
  [GUIDE_INTENTS.DEFAULT]: false,
  [GUIDE_INTENTS.RECRUITER]: true,
  [GUIDE_INTENTS.TECHNICAL]: false,
})

/** "Repositorios/artifacts disponibles" (contrato, Technical) — expone el `githubUrl` que cada proyecto ya trae en projects/registry.js (el mismo que usa ProjectDetail.jsx), como badge dentro de la card existente. Ningún dato ni URL nuevos. */
const HOME_SHOW_REPO_BADGE = Object.freeze({
  [GUIDE_INTENTS.DEFAULT]: false,
  [GUIDE_INTENTS.RECRUITER]: false,
  [GUIDE_INTENTS.TECHNICAL]: true,
})

/**
 * CTAs primarios del Hero — "CV y Contact ≤1 click" (contrato, Recruiter):
 * para Recruiter, los dos botones grandes del Hero pasan a ser CV/Contact
 * en vez de Data & BI/Proyectos, reusando los labels e hrefs que ya existen
 * (`hero.cv` + CV_HREF, `nav.contact` + #contact) — nunca copy nueva. El
 * resto de intents conserva los CTAs actuales sin cambios.
 */
const HOME_HERO_CTAS = Object.freeze({
  [GUIDE_INTENTS.DEFAULT]: {
    primary: { labelKey: 'home.hero.ctaPrimary', href: '#data-bi' },
    secondary: { labelKey: 'home.hero.ctaSecondary', href: '#projects' },
  },
  [GUIDE_INTENTS.RECRUITER]: {
    primary: { labelKey: 'hero.cv', href: CV_HREF, download: true },
    secondary: { labelKey: 'nav.contact', href: '#contact' },
  },
  [GUIDE_INTENTS.TECHNICAL]: {
    primary: { labelKey: 'home.hero.ctaPrimary', href: '#data-bi' },
    secondary: { labelKey: 'home.hero.ctaSecondary', href: '#projects' },
  },
})

function normalizeIntent(intent) {
  return isValidIntent(intent) ? intent : GUIDE_INTENTS.DEFAULT
}

/**
 * Home's Fase 1B adaptation recipe for `intent` (`null`/invalid normalize
 * to `default`, so an unset visitor always sees the unmodified Home).
 * `selectedWorkIds` is filtered through `hasProject` so a ever-renamed or
 * retired project id can never produce a dead card — mirrors
 * `getCaseworkSlugsForProject`'s own safety rule in projects/registry.js.
 */
export function getHomeLayout(intent) {
  const key = normalizeIntent(intent)
  return {
    intent: key,
    sections: HOME_SECTION_ORDER[key],
    selectedWorkIds: HOME_SELECTED_WORK_IDS[key].filter(hasProject),
    showExperienceLine: HOME_SHOW_EXPERIENCE_LINE[key],
    showRepoBadge: HOME_SHOW_REPO_BADGE[key],
    heroCtas: HOME_HERO_CTAS[key],
  }
}
