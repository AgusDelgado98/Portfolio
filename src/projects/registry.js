import {
  CAELUM_REPO_URL,
  CLARUSFLOW_REPO_URL,
  CLARUSFLOW_REVENUE_SRC,
  CLARUSFLOW_RISK_SRC,
  KAIROS_LIBRARY_SRC,
  KAIROS_OVERVIEW_SRC,
  LUMENVOX_CONFUSION_SRC,
  LUMENVOX_REPO_URL,
  LUMENVOX_UNRESOLVED_SRC,
  PARADIGM_APP_URL,
  PARADIGM_IMPORTANCE_CHART_SRC,
  PARADIGM_LEAD_CHART_SRC,
  PARADIGM_WEB_REPO_URL,
  PROVIDENTIA_EXCEEDANCE_SRC,
  PROVIDENTIA_FORECAST_SRC,
  PROVIDENTIA_REPO_URL,
  TEKMERION_REPO_URL,
  TEKMERION_RULES_VS_ML_SRC,
  TEKMERION_SHOWROOM_SRC,
} from '../constants/links.js'

/**
 * Projects registry — Phase 1 (Destination Foundation), item 4. Extended in
 * Phase 4 (Projects Experience) to back real Cards / Project Detail pages
 * instead of just routing.
 *
 * Single source of truth for project ids/metadata. Deliberately plain data
 * — no JSX, no CSS imports — same reasoning as casework/registry.js's split
 * from resolveAppRoute.js (Phase 0): keeping this file free of JSX means
 * resolveAppRoute.js can import it directly (unlike the Casework registry,
 * which is injected) and it stays unit-testable with Node's plain test
 * runner.
 *
 * Icons stay local to whatever renders them (JSX, not routing/detail data)
 * — see components/ProjectsAtlas.jsx / ProjectCard.jsx's own small
 * `iconsById` maps.
 *
 * New in Phase 4:
 *   - `priority`: 'primary' | 'secondary' — editorial hierarchy for Cards
 *     (item 5): PROVIDENTIA, Caelum, Paradigm, Soma get more visual presence;
 *     the rest stay fully accessible, never hidden, never Featured-only.
 *   - `resultsSectionKey`: which heading Project Detail's Results/Product
 *     section uses — 'results' (default, analytical outcomes) or 'product'
 *     (Soma — an operational product, not an analytical result).
 *   - `caseworkSlugs`: explicit, centralized project -> Casework
 *     associations (item 10), replacing the old one-off
 *     `hasEngineeringLog`/`ENGINEERING_LOG_HASH` special case on Paradigm.
 *     Only real, already-built cases are linked — Case 05 does not exist
 *     yet, so no project points at it (see `getCaseworkSlugsForProject`).
 */

export const FEATURED_PROJECT_IDS = ['providentia', 'caelum', 'paradigm', 'soma']
export const APPLICATION_PROJECT_IDS = ['hogares', 'tekmerion', 'kairos', 'clarusflow', 'lumenvox']
export const ALL_PROJECT_IDS = [...FEATURED_PROJECT_IDS, ...APPLICATION_PROJECT_IDS]

export const PROJECTS_META = {
  paradigm: {
    id: 'paradigm',
    title: 'Paradigm',
    accent: 'emerald',
    accentColor: '#00d4b0',
    priority: 'primary',
    resultsSectionKey: 'results',
    stack: ['Python', 'SQL', 'pandas', 'scikit-learn', 'Power BI', 'Streamlit'],
    projectUrl: PARADIGM_APP_URL,
    githubUrl: PARADIGM_WEB_REPO_URL,
    githubCtaKey: 'projects.githubPublicInterface',
    caseworkSlugs: ['no-show', 'operational-risk'],
    evidenceVisuals: [
      { id: 'lead', src: PARADIGM_LEAD_CHART_SRC },
      { id: 'importance', src: PARADIGM_IMPORTANCE_CHART_SRC },
    ],
  },
  soma: {
    id: 'soma',
    title: 'Soma',
    accent: 'violet',
    accentColor: '#8b6fff',
    priority: 'primary',
    resultsSectionKey: 'product',
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    hasLiveDemo: false,
    privateRepo: true,
    hasDemoVideo: true,
    caseworkSlugs: [],
  },
  providentia: {
    id: 'providentia',
    title: 'PROVIDENTIA',
    accent: 'sky',
    accentColor: '#37677a',
    priority: 'primary',
    resultsSectionKey: 'results',
    stack: ['Python', 'pandas', 'statsmodels', 'LightGBM', 'matplotlib', 'pytest', 'SQL', 'SQLite', 'Power BI'],
    githubUrl: PROVIDENTIA_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    // Case 05 (Policy & Decision Intelligence) added in Phase 5 — see
    // casework/policy-decision/data.js for its PDI-4-sourced content.
    caseworkSlugs: ['demand-forecasting', 'capacity-decision', 'policy-decision'],
    evidenceVisuals: [
      { id: 'forecast', src: PROVIDENTIA_FORECAST_SRC },
      { id: 'exceedance', src: PROVIDENTIA_EXCEEDANCE_SRC },
    ],
  },
  caelum: {
    id: 'caelum',
    title: 'Caelum Health Analytics',
    accent: 'sky',
    accentColor: '#37677a',
    priority: 'primary',
    resultsSectionKey: 'results',
    stack: [
      'Python',
      'SQL',
      'dbt Core',
      'DuckDB',
      'Power BI',
      'Apache Airflow',
      'Terraform',
      'AWS',
      'GitHub Actions',
    ],
    githubUrl: CAELUM_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    caseworkSlugs: [],
  },
  hogares: {
    id: 'hogares',
    title: 'Hogares',
    accent: 'violet',
    priority: 'secondary',
    resultsSectionKey: 'product',
    stack: ['React', 'TypeScript', 'Vite', 'PWA', 'Vercel', 'Cloudflare Worker', 'Hono', 'Cloudflare D1', 'JWT', 'scrypt'],
    hasLiveDemo: false,
    privateRepo: true,
    caseworkSlugs: [],
  },
  tekmerion: {
    id: 'tekmerion',
    title: 'Tekmérion',
    accent: 'sky',
    priority: 'secondary',
    resultsSectionKey: 'results',
    stack: ['Python', 'Evidence pipeline', 'Grounding', 'scikit-learn', 'Rules engine'],
    githubUrl: TEKMERION_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    caseworkSlugs: [],
    evidenceVisuals: [
      { id: 'showroom', src: TEKMERION_SHOWROOM_SRC },
      { id: 'rulesVsMl', src: TEKMERION_RULES_VS_ML_SRC },
    ],
  },
  kairos: {
    id: 'kairos',
    title: 'Kairós',
    accent: 'emerald',
    priority: 'secondary',
    resultsSectionKey: 'product',
    stack: ['React 19', 'TypeScript', 'Vite', 'PWA', 'localStorage', 'IndexedDB', 'Web Speech API', 'Cloudflare Worker', 'D1', 'Better Auth'],
    hasLiveDemo: false,
    privateRepo: true,
    caseworkSlugs: [],
    evidenceVisuals: [
      { id: 'overview', src: KAIROS_OVERVIEW_SRC },
      { id: 'library', src: KAIROS_LIBRARY_SRC },
    ],
  },
  clarusflow: {
    id: 'clarusflow',
    title: 'ClarusFlow',
    accent: 'sky',
    priority: 'secondary',
    resultsSectionKey: 'results',
    stack: ['Python', 'pandas', 'NumPy', 'Matplotlib', 'python-dateutil'],
    githubUrl: CLARUSFLOW_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    caseworkSlugs: [],
    evidenceVisuals: [
      { id: 'revenue', src: CLARUSFLOW_REVENUE_SRC },
      { id: 'risk', src: CLARUSFLOW_RISK_SRC },
    ],
  },
  lumenvox: {
    id: 'lumenvox',
    title: 'LumenVox',
    accent: 'violet',
    priority: 'secondary',
    resultsSectionKey: 'results',
    stack: ['Python', 'pandas', 'NLP', 'scikit-learn', 'Matplotlib'],
    githubUrl: LUMENVOX_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    caseworkSlugs: [],
    evidenceVisuals: [
      { id: 'confusion', src: LUMENVOX_CONFUSION_SRC },
      { id: 'unresolved', src: LUMENVOX_UNRESOLVED_SRC },
    ],
  },
}

export const NODE_PROFILES = {
  paradigm: { status: 'Active', weight: 'major' },
  soma: { status: 'Production', weight: 'major' },
  providentia: { status: 'Active', weight: 'major' },
  caelum: { status: 'Active', weight: 'major' },
  hogares: { status: 'Active' },
  tekmerion: { status: 'Active' },
  kairos: { status: 'Active' },
  clarusflow: { status: 'Active' },
  lumenvox: { status: 'Active' },
}

export const TERRITORIES = [
  {
    id: 'intelligence',
    number: '01',
    code: 'INT',
    coordinates: 'N 34° / E 12°',
    projectIds: ['paradigm', 'providentia', 'tekmerion', 'lumenvox'],
  },
  {
    id: 'data-systems',
    number: '02',
    code: 'DAT',
    coordinates: 'N 18° / E 68°',
    projectIds: ['caelum', 'clarusflow'],
  },
  {
    id: 'operational-products',
    number: '03',
    code: 'OPS',
    coordinates: 'S 28° / E 24°',
    projectIds: ['soma', 'hogares', 'kairos'],
  },
]

export function hasProject(id) {
  return Object.hasOwn(PROJECTS_META, id)
}

export function getProjectMeta(id) {
  return PROJECTS_META[id] || null
}

/** The territory a project belongs to, or null if none claims it. */
export function getTerritoryForProject(id) {
  return TERRITORIES.find((territory) => territory.projectIds.includes(id)) || null
}

/**
 * Related Casework (Phase 4, item 10) — the project's associated case
 * slugs, or `[]` if none. Never invents an association: only
 * `caseworkSlugs` explicitly set in PROJECTS_META above, so an unmapped or
 * unknown id safely returns no cases rather than guessing.
 */
export function getCaseworkSlugsForProject(id) {
  return PROJECTS_META[id]?.caseworkSlugs || []
}
