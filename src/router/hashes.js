/**
 * Canonical hash vocabulary — PLAN-FROZEN v1.1, section 4.
 *
 * Plain constants, no imports: shared by the resolver, the legacy-alias table,
 * the title builder and the tests without any cycle between them.
 *
 *   #home
 *   #projects
 *   #projects/<project-id>
 *   #projects/<project-id>/<case-slug>[/<section>]    (see projects/caseStudies.js)
 *   #about
 *   #about/<section>                                  (scroll target, not another view)
 *   #contact
 */

export const HOME_HASH = '#home'
export const PROJECTS_HASH = '#projects'
export const ABOUT_HASH = '#about'
export const CONTACT_HASH = '#contact'

/** Sections of About that can be deep-linked as `#about/<section>`. */
export const ABOUT_SECTIONS = Object.freeze(['skills', 'experience', 'education', 'method'])

/**
 * Every About section is a block inside the one About page. `#about/<section>`
 * opens About and scrolls to / focuses that block (components/About.jsx).
 * App skips its own scroll-to-top so that positioning survives.
 */
export const ABOUT_SCROLL_SECTIONS = ABOUT_SECTIONS

export function isAboutScrollSection(value) {
  return ABOUT_SCROLL_SECTIONS.includes(value)
}

export function isAboutSection(value) {
  return ABOUT_SECTIONS.includes(value)
}

export function aboutSectionHash(section) {
  return `${ABOUT_HASH}/${section}`
}

export function projectHash(projectId) {
  return `${PROJECTS_HASH}/${projectId}`
}

/** The skip-link target: an in-page anchor to <main>, never an app route. */
export const MAIN_CONTENT_ID = 'main-content'
export const MAIN_CONTENT_HASH = `#${MAIN_CONTENT_ID}`
