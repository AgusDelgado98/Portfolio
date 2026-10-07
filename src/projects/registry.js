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
import { getVisibleFilterCategories } from './categories.js'
import { getCaseStudiesForProject } from './caseStudies.js'

/**
 * Projects registry — single source of truth for project ids/metadata.
 *
 * Phase 1 (Destination Foundation) created it, Phase 4 (Projects Experience)
 * extended it, and PLAN-FROZEN v1.1 / F1 evolved it into the final model the
 * redesign builds on. Deliberately plain data — no JSX, no CSS imports — so
 * the router can import it directly and Node's test runner can load it.
 * Icons stay local to whatever renders them (components/projectIcons.jsx).
 *
 * ── Entry shape (PLAN-FROZEN section 9) ───────────────────────────────────
 *   id, title
 *   categories        ['ds-ml', 'analytics-bi'] — [0] is the primary one; a
 *                     project is counted by every category it lists
 *                     (projects/categories.js)
 *   tags              visible labels that do not filter (ALETHEIA: Evidence ·
 *                     Research · Data Analysis)
 *   tier              'flagship' | 'featured' | 'standard' | 'compact'
 *   status            'active' | 'production'
 *   hidden            true => the project does not exist publicly: it is
 *                     excluded from every listing, count, filter and route
 *   stages            which steps of DATA → EVIDENCE → PREDICTION → DECISION
 *                     the project demonstrates (may be empty — products)
 *   visual            key of the project's visual (src/visual/, built in F3),
 *                     or 'procedural' for the deterministic fallback
 *   accent            accent token name (never a hex)
 *   stack, githubUrl, githubCtaKey, projectUrl, privateRepo, hasLiveDemo,
 *   hasDemoVideo      unchanged from before
 *   resultsSectionKey 'results' (analytical outcomes) | 'product' (shipped product)
 *   evidenceVisuals   unchanged from before
 *   caseStudies       derived from projects/caseStudies.js (the canonical
 *                     project -> case relationship); never hand-written here
 *
 * ── Visibility ────────────────────────────────────────────────────────────
 * `hidden: true` projects stay in PROJECT_REGISTRY (so tests and F4 can see
 * them) but are invisible through every public accessor below — `hasProject`,
 * `getProjectMeta`, `ALL_PROJECT_IDS`, the shims, `getVisibleProjects`.
 * ALETHEIA is hidden during F1 so the current UI does not change; F4 flips it.
 * DECERNO is intentionally absent until it is marked ready.
 *
 * ── Temporary shims (removed in F4) ───────────────────────────────────────
 * `TERRITORIES`, `NODE_PROFILES`, `FEATURED_PROJECT_IDS`,
 * `APPLICATION_PROJECT_IDS`, `ALL_PROJECT_IDS`, `PROJECTS_META` (with its old
 * `priority` and `caseworkSlugs` fields) and `getCaseworkSlugsForProject` keep
 * the current Atlas / Cards / Detail UI working untouched. They are derived
 * from the new fields wherever possible so they cannot drift from them.
 */

export const PROJECT_TIERS = Object.freeze(['flagship', 'featured', 'standard', 'compact'])
export const PROJECT_STATUSES = Object.freeze(['active', 'production'])
export const PROJECT_STAGES = Object.freeze(['data', 'evidence', 'prediction', 'decision'])
export const PROCEDURAL_VISUAL = 'procedural'
export const PROJECT_VISUALS = Object.freeze([
  'forecast',
  'pipeline',
  'evidence-network',
  'risk-threshold',
  'rules-vs-ml',
  PROCEDURAL_VISUAL,
])

const PROJECT_DEFINITIONS = {
  providentia: {
    id: 'providentia',
    title: 'PROVIDENTIA',
    categories: ['ds-ml'],
    tags: [],
    tier: 'flagship',
    status: 'active',
    hidden: false,
    stages: ['prediction', 'decision'],
    visual: 'forecast',
    accent: 'sky',
    resultsSectionKey: 'results',
    stack: ['Python', 'pandas', 'statsmodels', 'LightGBM', 'matplotlib', 'pytest', 'SQL', 'SQLite', 'Power BI'],
    githubUrl: PROVIDENTIA_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'forecast', src: PROVIDENTIA_FORECAST_SRC },
      { id: 'exceedance', src: PROVIDENTIA_EXCEEDANCE_SRC },
    ],
  },
  caelum: {
    id: 'caelum',
    title: 'Caelum Health Analytics',
    categories: ['analytics-bi'],
    tags: [],
    tier: 'featured',
    status: 'active',
    hidden: false,
    stages: ['data'],
    visual: 'pipeline',
    accent: 'sky',
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
  },
  aletheia: {
    id: 'aletheia',
    title: 'ALETHEIA',
    // Evidence / research / data analysis — deliberately NOT analytics-bi and
    // NOT applied-ai. The category exists but gets no visible filter while
    // ALETHEIA is its only project (see projects/categories.js).
    categories: ['evidence-research'],
    tags: ['Evidence', 'Research', 'Data Analysis'],
    tier: 'featured',
    status: 'active',
    // F1 only: stays invisible so the current UI is unchanged. F4 flips it.
    hidden: true,
    stages: ['evidence'],
    visual: 'evidence-network',
    accent: 'emerald',
    resultsSectionKey: 'results',
    // No stack is documented anywhere in this repo (neither the evidence pack
    // nor data.js name one), so none is claimed here. To be supplied.
    stack: [],
    // ALETHEIA_REPO_URL is still null (set only after the public repo URL is
    // frozen — see constants/links.js), so there is no githubUrl yet.
    hasLiveDemo: false,
  },
  paradigm: {
    id: 'paradigm',
    title: 'Paradigm',
    categories: ['ds-ml', 'analytics-bi'],
    tags: [],
    tier: 'featured',
    status: 'active',
    hidden: false,
    // `decision` is reserved for projects with explicit evidence of policy
    // evaluation, intervention or decision under constraints/costs
    // (PROVIDENTIA today). Paradigm demonstrates prediction only.
    stages: ['prediction'],
    visual: 'risk-threshold',
    accent: 'emerald',
    resultsSectionKey: 'results',
    stack: ['Python', 'SQL', 'pandas', 'scikit-learn', 'Power BI', 'Streamlit'],
    projectUrl: PARADIGM_APP_URL,
    githubUrl: PARADIGM_WEB_REPO_URL,
    githubCtaKey: 'projects.githubPublicInterface',
    evidenceVisuals: [
      { id: 'lead', src: PARADIGM_LEAD_CHART_SRC },
      { id: 'importance', src: PARADIGM_IMPORTANCE_CHART_SRC },
    ],
  },
  soma: {
    id: 'soma',
    title: 'Soma',
    categories: ['products'],
    tags: [],
    tier: 'featured',
    status: 'production',
    hidden: false,
    stages: [],
    visual: PROCEDURAL_VISUAL,
    accent: 'violet',
    resultsSectionKey: 'product',
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    hasLiveDemo: false,
    privateRepo: true,
    hasDemoVideo: true,
  },
  hogares: {
    id: 'hogares',
    title: 'Hogares',
    categories: ['products'],
    tags: [],
    tier: 'compact',
    status: 'active',
    hidden: false,
    stages: [],
    visual: PROCEDURAL_VISUAL,
    accent: 'violet',
    resultsSectionKey: 'product',
    stack: ['React', 'TypeScript', 'Vite', 'PWA', 'Vercel', 'Cloudflare Worker', 'Hono', 'Cloudflare D1', 'JWT', 'scrypt'],
    hasLiveDemo: false,
    privateRepo: true,
  },
  tekmerion: {
    id: 'tekmerion',
    title: 'Tekmérion',
    // Primary analytics-bi (labor-market signal analysis with an auditable
    // evidence report); applied-ai is secondary and, with a single project,
    // gets no visible filter.
    categories: ['analytics-bi', 'applied-ai'],
    tags: [],
    tier: 'standard',
    status: 'active',
    hidden: false,
    stages: ['evidence'],
    visual: 'rules-vs-ml',
    accent: 'sky',
    resultsSectionKey: 'results',
    stack: ['Python', 'Evidence pipeline', 'Grounding', 'scikit-learn', 'Rules engine'],
    githubUrl: TEKMERION_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'showroom', src: TEKMERION_SHOWROOM_SRC },
      { id: 'rulesVsMl', src: TEKMERION_RULES_VS_ML_SRC },
    ],
  },
  kairos: {
    id: 'kairos',
    title: 'Kairós',
    categories: ['products'],
    tags: [],
    tier: 'compact',
    status: 'active',
    hidden: false,
    stages: [],
    visual: PROCEDURAL_VISUAL,
    accent: 'emerald',
    resultsSectionKey: 'product',
    stack: ['React 19', 'TypeScript', 'Vite', 'PWA', 'localStorage', 'IndexedDB', 'Web Speech API', 'Cloudflare Worker', 'D1', 'Better Auth'],
    hasLiveDemo: false,
    privateRepo: true,
    evidenceVisuals: [
      { id: 'overview', src: KAIROS_OVERVIEW_SRC },
      { id: 'library', src: KAIROS_LIBRARY_SRC },
    ],
  },
  clarusflow: {
    id: 'clarusflow',
    title: 'ClarusFlow',
    categories: ['analytics-bi'],
    tags: [],
    tier: 'standard',
    status: 'active',
    hidden: false,
    stages: ['data'],
    visual: PROCEDURAL_VISUAL,
    accent: 'sky',
    resultsSectionKey: 'results',
    stack: ['Python', 'pandas', 'NumPy', 'Matplotlib', 'python-dateutil'],
    githubUrl: CLARUSFLOW_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'revenue', src: CLARUSFLOW_REVENUE_SRC },
      { id: 'risk', src: CLARUSFLOW_RISK_SRC },
    ],
  },
  lumenvox: {
    id: 'lumenvox',
    title: 'LumenVox',
    categories: ['ds-ml'],
    tags: [],
    tier: 'standard',
    status: 'active',
    hidden: false,
    stages: ['prediction'],
    visual: PROCEDURAL_VISUAL,
    accent: 'violet',
    resultsSectionKey: 'results',
    stack: ['Python', 'pandas', 'NLP', 'scikit-learn', 'Matplotlib'],
    githubUrl: LUMENVOX_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'confusion', src: LUMENVOX_CONFUSION_SRC },
      { id: 'unresolved', src: LUMENVOX_UNRESOLVED_SRC },
    ],
  },
}

/**
 * Canonical display order, hidden entries included. The first four reproduce
 * the pre-redesign order (featured: providentia, caelum, paradigm, soma;
 * then the application projects) so the current UI renders identically.
 */
export const PROJECT_ORDER = Object.freeze([
  'providentia',
  'caelum',
  'paradigm',
  'soma',
  'aletheia',
  'hogares',
  'tekmerion',
  'kairos',
  'clarusflow',
  'lumenvox',
])

/** Every registered project — hidden ones included — in canonical order. */
export const PROJECT_REGISTRY = Object.freeze(
  PROJECT_ORDER.map((id) =>
    Object.freeze({
      ...PROJECT_DEFINITIONS[id],
      caseStudies: getCaseStudiesForProject(id),
    }),
  ),
)

const REGISTRY_BY_ID = new Map(PROJECT_REGISTRY.map((project) => [project.id, project]))

/** A project's registry entry, hidden or not (for tests and the F4 hand-over). Null when unknown. */
export function getProjectEntry(id) {
  return REGISTRY_BY_ID.get(id) ?? null
}

/** Visible (non-hidden) projects, in canonical order. */
export function getVisibleProjects() {
  return PROJECT_REGISTRY.filter((project) => !project.hidden)
}

export function hasProject(id) {
  const project = REGISTRY_BY_ID.get(id)
  return Boolean(project) && !project.hidden
}

/**
 * Where a case page's "back" link should go: the owning project's detail page
 * when that page exists publicly, otherwise the catalog (a hidden project has
 * no detail page yet — ALETHEIA until F4).
 */
export function getProjectBackHash(projectId) {
  return hasProject(projectId) ? `#projects/${projectId}` : '#projects'
}

const PRIMARY_TIERS = ['flagship', 'featured']

function isPrimaryTier(project) {
  return PRIMARY_TIERS.includes(project.tier)
}

// ── Home / pipeline source of truth (PLAN-FROZEN sections 9 and 11) ─────────

/**
 * Home featured projects, in order. Declared as the final intent
 * (PROVIDENTIA · Caelum · ALETHEIA); hidden or unknown ids are filtered out by
 * `getHomeFeaturedIds`, so while ALETHEIA is hidden this yields two. The
 * current Home does not read this yet (it still follows guide/intents.js until
 * F3). With DECERNO ready it becomes PROVIDENTIA · DECERNO · Caelum.
 */
export const HOME_FEATURED_IDS = Object.freeze(['providentia', 'caelum', 'aletheia'])

export function getHomeFeaturedIds() {
  return HOME_FEATURED_IDS.filter(hasProject)
}

/** Explicit anchor project per pipeline stage (DATA → EVIDENCE → PREDICTION → DECISION). */
export const PIPELINE_ANCHORS = Object.freeze({
  data: 'caelum',
  evidence: 'aletheia',
  prediction: 'providentia',
  decision: 'providentia',
})

/** The stage's anchor project id, or null when that project is hidden/absent. */
export function getPipelineAnchor(stage) {
  const id = PIPELINE_ANCHORS[stage]
  return id && hasProject(id) ? id : null
}

/** Visible projects that demonstrate `stage`, in canonical order (anchor included). */
export function getProjectsForStage(stage) {
  return getVisibleProjects().filter((project) => project.stages.includes(stage))
}

// ── Catalog filters ─────────────────────────────────────────────────────────

/** Category ids that get a visible filter today (see categories.js: MIN_PROJECTS_FOR_FILTER). */
export function getVisibleCategoryFilters() {
  return getVisibleFilterCategories(getVisibleProjects())
}

// ── Temporary shims for the current UI (removed in F4) ──────────────────────

const VISIBLE_PROJECTS = getVisibleProjects()

export const FEATURED_PROJECT_IDS = VISIBLE_PROJECTS.filter(isPrimaryTier).map((project) => project.id)
export const APPLICATION_PROJECT_IDS = VISIBLE_PROJECTS.filter((project) => !isPrimaryTier(project)).map(
  (project) => project.id,
)
export const ALL_PROJECT_IDS = [...FEATURED_PROJECT_IDS, ...APPLICATION_PROJECT_IDS]

/** Old `priority` ('primary' | 'secondary') derived from `tier`. */
function legacyPriority(project) {
  return isPrimaryTier(project) ? 'primary' : 'secondary'
}

function toLegacyStatus(status) {
  return status === 'production' ? 'Production' : 'Active'
}

export const PROJECTS_META = Object.fromEntries(
  VISIBLE_PROJECTS.map((project) => [
    project.id,
    {
      ...project,
      priority: legacyPriority(project),
      caseworkSlugs: project.caseStudies.map((study) => study.legacySlug),
    },
  ]),
)

export const NODE_PROFILES = Object.fromEntries(
  VISIBLE_PROJECTS.map((project) => [
    project.id,
    {
      status: toLegacyStatus(project.status),
      ...(isPrimaryTier(project) ? { weight: 'major' } : {}),
    },
  ]),
)

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

export function getProjectMeta(id) {
  return PROJECTS_META[id] || null
}

/** The territory a project belongs to, or null if none claims it. */
export function getTerritoryForProject(id) {
  return TERRITORIES.find((territory) => territory.projectIds.includes(id)) || null
}

/**
 * Related Casework — the project's associated case slugs (today's
 * legacy case slugs), or `[]` if none. Derived from the canonical
 * case studies (projects/caseStudies.js); a hidden or unknown id yields `[]`.
 */
export function getCaseworkSlugsForProject(id) {
  return PROJECTS_META[id]?.caseworkSlugs || []
}
