/**
 * Caelum — the real structure behind Home's architecture visual.
 *
 * These are COUNTS of a real data model, not measurements or empirical results.
 * Source: the project copy approved in i18n/messages/projects.js
 * (impactHighlight: "8 staging → 5 dimensiones → 3 hechos → 2 marts → Power BI";
 * highlights: "103 tests dbt"). `visual/data.test.js` checks both strings.
 */
export const CAELUM_LAYERS = Object.freeze([
  Object.freeze({ id: 'staging', count: 8 }),
  Object.freeze({ id: 'dimensions', count: 5 }),
  Object.freeze({ id: 'facts', count: 3 }),
  Object.freeze({ id: 'marts', count: 2 }),
])

export const CAELUM_DBT_TESTS = 103
