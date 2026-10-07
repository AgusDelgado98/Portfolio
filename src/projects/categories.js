/**
 * Project categories — PLAN-FROZEN v1.1, sections 9–10 (F1).
 *
 * Plain data + pure functions (no JSX, no imports): importable by the router,
 * the registry and Node's test runner alike. Takes project lists as arguments
 * instead of importing projects/registry.js, so there is no import cycle.
 *
 * A category EXISTING does not oblige the UI to SHOW it as a filter. The one
 * visibility rule is MIN_PROJECTS_FOR_FILTER: a filter is visible only when at
 * least that many *visible* (non-hidden) projects declare the category — in
 * ANY position of `categories`, not just as the primary one. That single rule
 * keeps `applied-ai` and `evidence-research` out of the UI today (one project
 * each) and activates them automatically if a second project ever joins, with
 * no per-category special cases.
 *
 * `categories[0]` of a project is its primary category.
 *
 * Human-readable labels are copy, not data: see `categoryLabels` in
 * i18n/messages/projects.js (ES/EN).
 */

export const MIN_PROJECTS_FOR_FILTER = 2

/** Pseudo-filter that always shows every visible project. It is not a category. */
export const ALL_FILTER_ID = 'all'

/** Display order of the filters (when visible). */
export const CATEGORIES = Object.freeze([
  Object.freeze({ id: 'analytics-bi', order: 1 }),
  Object.freeze({ id: 'ds-ml', order: 2 }),
  Object.freeze({ id: 'applied-ai', order: 3 }),
  Object.freeze({ id: 'products', order: 4 }),
  // Internal and honest: ALETHEIA is evidence / research / data analysis, not
  // Analytics & BI and not Applied AI. Valid category, hidden filter until a
  // second research-type project exists.
  Object.freeze({ id: 'evidence-research', order: 5 }),
])

export const CATEGORY_IDS = Object.freeze(CATEGORIES.map((category) => category.id))

export function isValidCategory(id) {
  return CATEGORY_IDS.includes(id)
}

/** The project's primary category (`categories[0]`), or null when it has none. */
export function getPrimaryCategory(project) {
  return project?.categories?.[0] ?? null
}

/**
 * How many of the given projects declare each category (any position).
 * The caller decides which projects count — pass only visible ones.
 * Always returns an entry for every known category.
 */
export function countProjectsByCategory(projects) {
  const counts = Object.fromEntries(CATEGORY_IDS.map((id) => [id, 0]))
  for (const project of projects ?? []) {
    for (const id of new Set(project?.categories ?? [])) {
      if (Object.hasOwn(counts, id)) counts[id] += 1
    }
  }
  return counts
}

/** True when `categoryId` has enough projects among `projects` to deserve a visible filter. */
export function isFilterVisible(categoryId, projects) {
  return countProjectsByCategory(projects)[categoryId] >= MIN_PROJECTS_FOR_FILTER
}

/** Category ids that get a visible filter, in display order. `all` is not included — it is always shown. */
export function getVisibleFilterCategories(projects) {
  const counts = countProjectsByCategory(projects)
  return CATEGORIES.filter((category) => counts[category.id] >= MIN_PROJECTS_FOR_FILTER).map(
    (category) => category.id,
  )
}

/** Projects matching a filter id (`all` or a category id), preserving input order. */
export function filterProjectsByCategory(projects, filterId) {
  const list = projects ?? []
  if (filterId === ALL_FILTER_ID) return [...list]
  return list.filter((project) => project?.categories?.includes(filterId))
}
