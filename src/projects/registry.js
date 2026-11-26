import {
  ALETHEIA_WEB_URL,
  CAELUM_REPO_URL,
  CLARUSFLOW_REPO_URL,
  CLARUSFLOW_REVENUE_SRC,
  CLARUSFLOW_RISK_SRC,
  CONSTANTIA_CHECKINS_SRC,
  CONSTANTIA_COVER_SRC,
  CONSTANTIA_DEMO_MP4_SRC,
  CONSTANTIA_DEMO_WEBM_SRC,
  CONSTANTIA_DASHBOARD_SRC,
  CONSTANTIA_FINANCE_SRC,
  CONSTANTIA_MEMBERS_SRC,
  CONSTANTIA_MEMBERSHIPS_SRC,
  CONSTANTIA_MOBILE_SRC,
  CONSTANTIA_STAFF_SRC,
  CONSTANTIA_STATS_SRC,
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
 *   status            'active' — a technical state. Professional use is NOT a state: it
 *                     lives in `usage`, so no project is labelled "production" here
 *   group             'work' | 'personal' — whether the project is one of the
 *                     three applications in use in a professional setting
 *                     (CONSTANTIA, SOMA, HOGARES), or a personal-lab project.
 *                     Hidden entries whose classification is not confirmed use null.
 *   usage             'professional' for work projects (declared use at work,
 *                     never a deployment or production claim), null otherwise
 *   dataProvenance    what the PUBLIC demonstration is built on: 'synthetic' |
 *                     'public' | 'fictitious' | null. It describes the public
 *                     case only, never the data of the workplace.
 *   publication       'published' | 'withheld'. THE publication gate. A withheld
 *                     project is REGISTERED (it is in PROJECT_REGISTRY and in
 *                     tests) but not PUBLISHED: it does not exist publicly and is
 *                     excluded from every listing, count, filter and route.
 *                     Withheld today: caelum (withdrawn from the public catalog; files and copy stay)
 *                     independent authorization).
 *   hidden            derived, never written: `publication !== 'published'`. Kept
 *                     because every accessor and test already speaks "hidden".
 *   journey           optional, Explore / Model / Evaluate / Decide: which steps the
 *                     project demonstrates (`demonstrated`, with a repository
 *                     source that exists) or only designs (`designed`). Separate
 *                     from `stages` on purpose: those ids keep their own meaning
 *                     (data = analytics engineering, evidence = evidence research...).
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
 * `publication: 'withheld'` projects stay in PROJECT_REGISTRY (so tests and the
 * redesign can see them) but are invisible through every public accessor below —
 * `hasProject`, `getProjectMeta`, `ALL_PROJECT_IDS`, `getVisibleProjects`,
 * `getJourney`, the Home/featured lists. Only Caelum is withheld today
 * (files, copy and repo stay in the tree). DECERNO is published in the personal lab.
 *
 * F4 removed the Atlas shims (`TERRITORIES`, `NODE_PROFILES`,
 * `FEATURED_PROJECT_IDS`, `PROJECTS_META`, `getTerritoryForProject`).
 * `getProjectMeta` returns the visible registry entry. `ALL_PROJECT_IDS` is
 * the visible ids in catalog order.
 */

export const PROJECT_TIERS = Object.freeze(['flagship', 'featured', 'standard', 'compact'])
export const PROJECT_STATUSES = Object.freeze(['active'])
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
  'product-surfaces',
  PROCEDURAL_VISUAL,
])

export const PROJECT_PUBLICATIONS = Object.freeze(['published', 'withheld'])
export const JOURNEY_STEPS = Object.freeze(['explore', 'model', 'evaluate', 'decide'])
export const JOURNEY_STATUSES = Object.freeze(['demonstrated', 'designed'])

const PROJECT_DEFINITIONS = {
  providentia: {
    id: 'providentia',
    title: 'PROVIDENTIA',
    categories: ['ds-ml'],
    tags: [],
    tier: 'flagship',
    status: 'active',
    group: 'personal',
    usage: null,
    dataProvenance: 'public',
    publication: 'published',
    stages: ['prediction', 'decision'],
    journey: {
      model: { status: 'demonstrated', source: 'public/casework/demand-forecasting/evidence-pack/README.md' },
      evaluate: { status: 'demonstrated', source: 'public/casework/demand-forecasting/evidence-pack/forecasting_metrics.csv' },
      // Policy SIMULATION in a scenario; the claims contract forbids real capacity, saturation or optimality claims.
      decide: { status: 'demonstrated', scope: 'simulation', source: 'public/casework/capacity-decision/evidence-pack/claims_contract.md' },
    },
    visual: 'forecast',
    accent: 'sky',
    resultsSectionKey: 'results',
    stack: ['Python', 'pandas', 'statsmodels', 'LightGBM', 'matplotlib', 'pytest', 'SQL', 'SQLite', 'Power BI'],
    homeStack: ['Python', 'statsmodels', 'LightGBM', 'SQL'],
    githubUrl: PROVIDENTIA_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'forecast', src: PROVIDENTIA_FORECAST_SRC, width: 2083, height: 1677 },
      { id: 'exceedance', src: PROVIDENTIA_EXCEEDANCE_SRC, width: 720, height: 480 },
    ],
  },
  decerno: {
    id: 'decerno',
    title: 'DECERNO',
    // Published in the personal lab. Public copy is the minimum verified from the project
    // README (no trained model, no published measured results). Private repo, not linked.
    // Journey steps stay `designed` (none demonstrated). Stages stay empty.
    categories: ['ds-ml'],
    tags: [],
    tier: 'featured',
    status: 'active',
    group: 'personal',
    usage: null,
    dataProvenance: null,
    publication: 'published',
    stages: [],
    journey: {
      explore: { status: 'designed' },
      model: { status: 'designed' },
      evaluate: { status: 'designed' },
      decide: { status: 'designed' },
    },
    visual: PROCEDURAL_VISUAL,
    accent: 'sky',
    resultsSectionKey: 'results',
    stack: ['Python'],
    hasLiveDemo: false,
    privateRepo: true,
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
    publication: 'withheld',
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
    publication: 'published',
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
    group: 'personal',
    usage: null,
    dataProvenance: 'synthetic',
    publication: 'published',
    // `decision` is reserved for projects with explicit evidence of policy
    // evaluation, intervention or decision under constraints/costs
    // (PROVIDENTIA today). Paradigm demonstrates prediction only.
    stages: ['prediction'],
    journey: {
      explore: { status: 'demonstrated', source: 'public/casework/operational-risk/evidence-pack/README.md' },
      model: { status: 'demonstrated', source: 'public/casework/operational-risk/evidence-pack/README.md' },
      evaluate: { status: 'demonstrated', source: 'public/casework/operational-risk/evidence-pack/README.md' },
    },
    visual: 'risk-threshold',
    accent: 'emerald',
    resultsSectionKey: 'results',
    stack: ['Python', 'SQL', 'SQLite', 'pandas', 'scikit-learn', 'Power BI', 'Streamlit'],
    homeStack: ['Python', 'SQL', 'SQLite', 'scikit-learn'],
    projectUrl: PARADIGM_APP_URL,
    githubUrl: PARADIGM_WEB_REPO_URL,
    githubCtaKey: 'projects.githubPublicInterface',
    evidenceVisuals: [
      { id: 'lead', src: PARADIGM_LEAD_CHART_SRC, width: 960, height: 504 },
      { id: 'importance', src: PARADIGM_IMPORTANCE_CHART_SRC, width: 960, height: 600 },
    ],
  },
  constantia: {
    id: 'constantia',
    title: 'CONSTANTIA',
    categories: ['products'],
    tags: [],
    tier: 'featured',
    status: 'active',
    // Declared state shown on the page: "In production" (a gym uses it). The client is never named and the app is never linked.
    statusLabelKey: 'InProduction',
    group: 'work',
    usage: 'professional',
    dataProvenance: 'fictitious',
    publication: 'published',
    stages: [],
    visual: PROCEDURAL_VISUAL,
    accent: 'sky',
    resultsSectionKey: 'product',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Drizzle ORM', 'Vitest', 'Playwright', 'Railway'],
    homeStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'],
    hasLiveDemo: false,
    privateRepo: true,
    // Public demo video (floor-plan scene removed). WebM first, MP4 fallback. Same player as Soma.
    hasDemoVideo: true,
    demoVideo: {
      sources: [
        { src: CONSTANTIA_DEMO_WEBM_SRC, type: 'video/webm' },
        { src: CONSTANTIA_DEMO_MP4_SRC, type: 'video/mp4' },
      ],
      poster: CONSTANTIA_COVER_SRC,
    },
    evidenceVisuals: [
      { id: 'dashboard', src: CONSTANTIA_DASHBOARD_SRC, width: 1920, height: 1080 },
      { id: 'members', src: CONSTANTIA_MEMBERS_SRC, width: 1920, height: 1080 },
      { id: 'memberships', src: CONSTANTIA_MEMBERSHIPS_SRC, width: 1920, height: 1080 },
      { id: 'checkins', src: CONSTANTIA_CHECKINS_SRC, width: 1920, height: 1080 },
      { id: 'finance', src: CONSTANTIA_FINANCE_SRC, width: 1920, height: 1080 },
      { id: 'staff', src: CONSTANTIA_STAFF_SRC, width: 1920, height: 1080 },
      { id: 'stats', src: CONSTANTIA_STATS_SRC, width: 1920, height: 1080 },
      { id: 'mobile', src: CONSTANTIA_MOBILE_SRC, width: 1920, height: 1080 },
    ],
  },
  soma: {
    id: 'soma',
    title: 'Soma',
    categories: ['products'],
    tags: [],
    tier: 'featured',
    status: 'active',
    group: 'work',
    usage: 'professional',
    dataProvenance: 'fictitious',
    publication: 'published',
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
    tier: 'featured',
    status: 'active',
    group: 'work',
    usage: 'professional',
    dataProvenance: null,
    publication: 'published',
    stages: [],
    visual: PROCEDURAL_VISUAL,
    accent: 'violet',
    resultsSectionKey: 'product',
    stack: ['React', 'TypeScript', 'Vite', 'PWA', 'Vercel', 'Cloudflare Worker', 'Hono', 'Cloudflare D1', 'JWT', 'scrypt'],
    hasLiveDemo: false,
    privateRepo: true,
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
    publication: 'published',
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
    publication: 'published',
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
 * Catalog order: the three applications in use first (CONSTANTIA, SOMA, HOGARES),
 * then the personal lab. Caelum stays in the list while it is withheld.
 */
export const PROJECT_ORDER = Object.freeze([
  'constantia',
  'soma',
  'hogares',
  'providentia',
  'decerno',
  'paradigm',
  'aletheia',
  'clarusflow',
  'lumenvox',
  'caelum',
])

/** Every registered project — hidden ones included — in canonical order. */
export const PROJECT_REGISTRY = Object.freeze(
  PROJECT_ORDER.map((id) =>
    Object.freeze({
      ...PROJECT_DEFINITIONS[id],
      hidden: PROJECT_DEFINITIONS[id].publication !== 'published',
      caseStudies: getCaseStudiesForProject(id),
    }),
  ),
)

const REGISTRY_BY_ID = new Map(PROJECT_REGISTRY.map((project) => [project.id, project]))

/** A project's registry entry, hidden or not (for tests and the F4 hand-over). Null when unknown. */
export function getProjectEntry(id) {
  return REGISTRY_BY_ID.get(id) ?? null
}

/** Registered projects (published or withheld), in canonical order. Internal: tests and tools only. */
export function getRegisteredProjects() {
  return PROJECT_REGISTRY
}

/** Registered but not published. Internal: tests and tools only; never feed this to the UI. */
export function getWithheldProjects() {
  return PROJECT_REGISTRY.filter((project) => project.publication === 'withheld')
}

/** Visible (published) projects, in canonical order. */
export function getVisibleProjects() {
  return PROJECT_REGISTRY.filter((project) => !project.hidden)
}

/** Visible project ids, in catalog order. */
export const ALL_PROJECT_IDS = Object.freeze(getVisibleProjects().map((project) => project.id))

export function hasProject(id) {
  const project = REGISTRY_BY_ID.get(id)
  return Boolean(project) && !project.hidden
}

/** True only for a registered project whose publication is `published`. Same rule as `hasProject`. */
export function isPublished(id) {
  return hasProject(id)
}

/**
 * Where a case page's "back" link should go: the owning project's detail page
 * when that page exists publicly, otherwise the catalog (a hidden project has
 * no detail page). DECERNO is hidden; ALETHEIA is visible.
 */
export function getProjectBackHash(projectId) {
  return hasProject(projectId) ? `#projects/${projectId}` : '#projects'
}

// ── Home / pipeline source of truth (PLAN-FROZEN sections 9 and 11) ─────────

/**
 * Applications in use in a professional setting, in presentation order
 * (CONSTANTIA · SOMA · HOGARES). Hidden or unknown ids are filtered out by
 * `getHomeWorkIds` / `getProjectsByGroup`.
 */
export const WORK_PROJECT_ORDER = Object.freeze(['constantia', 'soma', 'hogares'])

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

// ── Presentation of the redesigned portfolio (F2: data only, nothing renders it yet) ──

/** The three projects the redesigned Home spotlights, in this order. Unpublished ones drop out. (Not "featured": that word is a tier, and FEATURED_PROJECT_IDS was a removed Atlas shim.) */
export const SPOTLIGHT_PROJECT_IDS = Object.freeze(['providentia', 'paradigm'])

/** Applications in use ("Proyectos en uso"): same ids as WORK_PROJECT_ORDER, listed first on the Projects page. */
export const COMPLEMENTARY_PROJECT_IDS = Object.freeze(['constantia', 'soma', 'hogares'])

export function getSpotlightProjectIds() {
  return SPOTLIGHT_PROJECT_IDS.filter(hasProject)
}

export function getComplementaryProjectIds() {
  return COMPLEMENTARY_PROJECT_IDS.filter(hasProject)
}

/** Published projects that are neither featured nor complementary, in catalog order (a compact secondary list). */
export function getOtherProjectIds() {
  const shown = new Set([...SPOTLIGHT_PROJECT_IDS, ...COMPLEMENTARY_PROJECT_IDS])
  return getVisibleProjects()
    .map((project) => project.id)
    .filter((id) => !shown.has(id))
}

/** A published project's journey (Explore · Model · Evaluate · Decide), or null — never for a withheld project. */
export function getJourney(id) {
  return getProjectMeta(id)?.journey ?? null
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
