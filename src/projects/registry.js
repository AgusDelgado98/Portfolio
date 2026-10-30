import {
  ALETHEIA_WEB_URL,
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
 * Visuals live in src/visual/. The catalog and Project Detail render them.
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
 *   group             'work' | 'personal' — whether the project is one of the
 *                     three developments used in the owner's professional
 *                     activity, or an independent personal project. Hidden
 *                     entries whose classification is not confirmed use null.
 *   usage             'professional' for work projects (declared use at work,
 *                     never a deployment or production claim), null otherwise
 *   dataProvenance    what the PUBLIC demonstration is built on: 'synthetic' |
 *                     'public' | 'fictitious' | null. It describes the public
 *                     case only, never the data of the workplace.
 *   hidden            true => the project does not exist publicly: it is
 *                     excluded from every listing, count, filter and route
 *   stages            which steps of DATA → EVIDENCE → PREDICTION → DECISION
 *                     the project demonstrates (may be empty — products)
 *   visual            key of the project's visual (src/visual/, built in F3),
 *                     or 'procedural' for the deterministic fallback
 *   accent            accent token name (never a hex)
 *   homeStack         optional: up to 4 stack items shown on Home's featured cards
 *                     (explicit, not "the first four of stack")
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
 * Hogares and Kairós are hidden from the public catalog. DECERNO is
 * intentionally absent until it is marked ready; when it is added with
 * `hidden: true` it behaves exactly as ALETHEIA did before.
 *
 * F4 removed the Atlas shims (`TERRITORIES`, `NODE_PROFILES`,
 * `FEATURED_PROJECT_IDS`, `PROJECTS_META`, `getTerritoryForProject`).
 * `getProjectMeta` returns the visible registry entry. `ALL_PROJECT_IDS` is
 * the visible ids in catalog order.
 */

export const PROJECT_TIERS = Object.freeze(['flagship', 'featured', 'standard', 'compact'])
export const PROJECT_STATUSES = Object.freeze(['active', 'production'])
export const PROJECT_GROUPS = Object.freeze(['work', 'personal'])
export const PROJECT_USAGES = Object.freeze(['professional'])
export const DATA_PROVENANCES = Object.freeze(['synthetic', 'public', 'fictitious'])
export const PROJECT_STAGES = Object.freeze(['data', 'evidence', 'prediction', 'decision'])
export const PROCEDURAL_VISUAL = 'procedural'
export const PROJECT_VISUALS = Object.freeze([
  'forecast',
  'pipeline',
  'evidence-network',
  'risk-threshold',
  'rules-vs-ml',
  'product-surfaces',
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
    group: 'work',
    usage: 'professional',
    dataProvenance: 'public',
    hidden: false,
    stages: ['prediction', 'decision'],
    visual: 'forecast',
    accent: 'sky',
    resultsSectionKey: 'results',
    stack: ['Python', 'pandas', 'statsmodels', 'LightGBM', 'matplotlib', 'pytest', 'SQL', 'SQLite', 'Power BI'],
    homeStack: ['Python', 'pandas', 'statsmodels', 'LightGBM'],
    githubUrl: PROVIDENTIA_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'forecast', src: PROVIDENTIA_FORECAST_SRC, width: 2083, height: 1677 },
      { id: 'exceedance', src: PROVIDENTIA_EXCEEDANCE_SRC, width: 720, height: 480 },
    ],
  },
  caelum: {
    id: 'caelum',
    title: 'Caelum Health Analytics',
    categories: ['analytics-bi'],
    tags: [],
    tier: 'featured',
    status: 'active',
    group: 'personal',
    usage: null,
    dataProvenance: null,
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
    homeStack: ['dbt Core', 'DuckDB', 'Airflow', 'Power BI'],
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
    group: 'personal',
    usage: null,
    dataProvenance: null,
    // Visible since F3 (F3A-preflight, decision 3): it is Home's third featured
    // project and the EVIDENCE anchor. Its copy is still the F1 text reused from
    // aletheia.js / casework/aletheia/data.js.
    hidden: false,
    stages: ['evidence'],
    visual: 'evidence-network',
    accent: 'emerald',
    resultsSectionKey: 'results',
    // No stack is documented anywhere in this repo (neither the evidence pack
    // nor data.js name one), so none is claimed here. To be supplied.
    stack: [],
    // ALETHEIA_REPO_URL is still null (set only after the public repo URL is
    // frozen — see constants/links.js), so there is no githubUrl yet. The
    // public research site is the project link.
    projectUrl: ALETHEIA_WEB_URL,
    hasLiveDemo: false,
  },
  paradigm: {
    id: 'paradigm',
    title: 'Paradigm',
    categories: ['ds-ml', 'analytics-bi'],
    tags: [],
    tier: 'featured',
    status: 'active',
    group: 'work',
    usage: 'professional',
    dataProvenance: 'synthetic',
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
      { id: 'lead', src: PARADIGM_LEAD_CHART_SRC, width: 960, height: 504 },
      { id: 'importance', src: PARADIGM_IMPORTANCE_CHART_SRC, width: 960, height: 600 },
    ],
  },
  soma: {
    id: 'soma',
    title: 'Soma',
    categories: ['products'],
    tags: [],
    tier: 'featured',
    status: 'production',
    group: 'work',
    usage: 'professional',
    dataProvenance: 'fictitious',
    hidden: false,
    stages: [],
    visual: 'product-surfaces',
    accent: 'violet',
    resultsSectionKey: 'product',
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    homeStack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL'],
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
    group: null,
    usage: null,
    dataProvenance: null,
    hidden: true,
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
    group: 'personal',
    usage: null,
    dataProvenance: null,
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
      { id: 'showroom', src: TEKMERION_SHOWROOM_SRC, width: 1440, height: 900 },
      { id: 'rulesVsMl', src: TEKMERION_RULES_VS_ML_SRC, width: 1664, height: 810 },
    ],
  },
  kairos: {
    id: 'kairos',
    title: 'Kairós',
    categories: ['products'],
    tags: [],
    tier: 'compact',
    status: 'active',
    group: null,
    usage: null,
    dataProvenance: null,
    hidden: true,
    stages: [],
    visual: PROCEDURAL_VISUAL,
    accent: 'emerald',
    resultsSectionKey: 'product',
    stack: ['React 19', 'TypeScript', 'Vite', 'PWA', 'localStorage', 'IndexedDB', 'Web Speech API', 'Cloudflare Worker', 'D1', 'Better Auth'],
    hasLiveDemo: false,
    privateRepo: true,
    evidenceVisuals: [
      { id: 'overview', src: KAIROS_OVERVIEW_SRC, width: 1440, height: 900 },
      { id: 'library', src: KAIROS_LIBRARY_SRC, width: 1440, height: 900 },
    ],
  },
  clarusflow: {
    id: 'clarusflow',
    title: 'ClarusFlow',
    categories: ['analytics-bi'],
    tags: [],
    tier: 'standard',
    status: 'active',
    group: 'personal',
    usage: null,
    dataProvenance: null,
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
      { id: 'revenue', src: CLARUSFLOW_REVENUE_SRC, width: 949, height: 587 },
      { id: 'risk', src: CLARUSFLOW_RISK_SRC, width: 828, height: 587 },
    ],
  },
  lumenvox: {
    id: 'lumenvox',
    title: 'LumenVox',
    categories: ['ds-ml'],
    tags: [],
    tier: 'standard',
    status: 'active',
    group: 'personal',
    usage: null,
    dataProvenance: null,
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
      { id: 'confusion', src: LUMENVOX_CONFUSION_SRC, width: 931, height: 777 },
      { id: 'unresolved', src: LUMENVOX_UNRESOLVED_SRC, width: 1484, height: 733 },
    ],
  },
}

/**
 * Catalog order (F4). Flagship, then featured, then standard, then compact.
 * Hidden entries stay in this list. Hogares and Kairós are hidden.
 */
export const PROJECT_ORDER = Object.freeze([
  'providentia',
  'caelum',
  'aletheia',
  'paradigm',
  'soma',
  'tekmerion',
  'lumenvox',
  'clarusflow',
  'hogares',
  'kairos',
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

/** Visible project ids, in catalog order. */
export const ALL_PROJECT_IDS = Object.freeze(getVisibleProjects().map((project) => project.id))

export function hasProject(id) {
  const project = REGISTRY_BY_ID.get(id)
  return Boolean(project) && !project.hidden
}

/**
 * Where a case page's "back" link should go: the owning project's detail page
 * when that page exists publicly, otherwise the catalog (a hidden project has
 * no detail page). Hogares and Kairós are hidden; ALETHEIA is visible.
 */
export function getProjectBackHash(projectId) {
  return hasProject(projectId) ? `#projects/${projectId}` : '#projects'
}

// ── Home / pipeline source of truth (PLAN-FROZEN sections 9 and 11) ─────────

/**
 * Projects linked to the owner's professional activity, in presentation order
 * (PARADIGM · PROVIDENTIA · SOMA). Hidden or unknown ids are filtered out by
 * `getHomeWorkIds` / `getProjectsByGroup`.
 */
export const WORK_PROJECT_ORDER = Object.freeze(['paradigm', 'providentia', 'soma'])

/**
 * Personal projects shown on Home, in order. The full personal list lives in
 * the catalog (`getProjectsByGroup('personal')`); candidates such as FUSTE or
 * DECERNO join only when they are registered and visible.
 */
export const HOME_PERSONAL_IDS = Object.freeze(['caelum', 'aletheia'])

export function getHomeWorkIds() {
  return WORK_PROJECT_ORDER.filter(hasProject)
}

export function getHomePersonalIds() {
  return HOME_PERSONAL_IDS.filter(hasProject)
}

/**
 * Visible projects of a group. 'work' follows `WORK_PROJECT_ORDER`; 'personal'
 * follows the canonical catalog order.
 */
export function getProjectsByGroup(group) {
  if (group === 'work') return getHomeWorkIds().map((id) => REGISTRY_BY_ID.get(id))
  return getVisibleProjects().filter((project) => project.group === group)
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

/** A visible project's registry entry, or null when the id is unknown or hidden. */
export function getProjectMeta(id) {
  const project = REGISTRY_BY_ID.get(id)
  if (!project || project.hidden) return null
  return project
}
