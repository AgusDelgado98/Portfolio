import test from 'node:test'
import assert from 'node:assert/strict'

import {
  PROJECT_REGISTRY,
  PROJECT_ORDER,
  PROJECT_TIERS,
  PROJECT_STATUSES,
  PROJECT_STAGES,
  PROJECT_VISUALS,
  PROCEDURAL_VISUAL,
  HOME_FEATURED_IDS,
  PIPELINE_ANCHORS,
  ALL_PROJECT_IDS,
  FEATURED_PROJECT_IDS,
  APPLICATION_PROJECT_IDS,
  PROJECTS_META,
  NODE_PROFILES,
  TERRITORIES,
  getProjectEntry,
  getVisibleProjects,
  hasProject,
  getProjectMeta,
  getHomeFeaturedIds,
  getPipelineAnchor,
  getProjectsForStage,
  getVisibleCategoryFilters,
  getCaseworkSlugsForProject,
} from './registry.js'
import {
  CATEGORY_IDS,
  isValidCategory,
  countProjectsByCategory,
  getVisibleFilterCategories,
  MIN_PROJECTS_FOR_FILTER,
} from './categories.js'
import { listCaseStudies } from './caseStudies.js'
import { mergeProjectCopy } from './mergeProjectCopy.js'
import { projectsCopy } from '../i18n/messages/projects.js'
import { resolveAppRoute } from '../router/resolveAppRoute.js'

/**
 * F1 model tests (PLAN-FROZEN v1.1). registry.test.js is kept untouched on
 * purpose: it is the proof that the temporary shims still satisfy the
 * consumers the current UI was built against.
 */

// The frozen classification table — the single place these values are asserted.
const FROZEN = {
  providentia: { categories: ['ds-ml'], tier: 'flagship', stages: ['prediction', 'decision'], visual: 'forecast', hidden: false },
  caelum: { categories: ['analytics-bi'], tier: 'featured', stages: ['data'], visual: 'pipeline', hidden: false },
  aletheia: { categories: ['evidence-research'], tier: 'featured', stages: ['evidence'], visual: 'evidence-network', hidden: true },
  paradigm: { categories: ['ds-ml', 'analytics-bi'], tier: 'featured', stages: ['prediction'], visual: 'risk-threshold', hidden: false },
  soma: { categories: ['products'], tier: 'featured', stages: [], visual: 'procedural', hidden: false },
  tekmerion: { categories: ['analytics-bi', 'applied-ai'], tier: 'standard', stages: ['evidence'], visual: 'rules-vs-ml', hidden: false },
  lumenvox: { categories: ['ds-ml'], tier: 'standard', stages: ['prediction'], visual: 'procedural', hidden: false },
  clarusflow: { categories: ['analytics-bi'], tier: 'standard', stages: ['data'], visual: 'procedural', hidden: false },
  hogares: { categories: ['products'], tier: 'compact', stages: [], visual: 'procedural', hidden: false },
  kairos: { categories: ['products'], tier: 'compact', stages: [], visual: 'procedural', hidden: false },
}

// ── Entry shape ─────────────────────────────────────────────────────────────

test('model: PROJECT_ORDER covers every registry entry exactly once, ids are unique', () => {
  const ids = PROJECT_REGISTRY.map((project) => project.id)
  assert.deepEqual(ids, [...PROJECT_ORDER])
  assert.equal(new Set(ids).size, ids.length)
  assert.deepEqual([...ids].sort(), Object.keys(FROZEN).sort())
})

test('model: every project has the full final entry shape', () => {
  for (const project of PROJECT_REGISTRY) {
    const id = project.id
    assert.ok(project.title && project.title.length > 0, `"${id}" has no title`)
    assert.ok(Array.isArray(project.categories), `"${id}".categories must be an array`)
    assert.ok(Array.isArray(project.tags), `"${id}".tags must be an array`)
    assert.equal(typeof project.tier, 'string', `"${id}".tier`)
    assert.equal(typeof project.status, 'string', `"${id}".status`)
    assert.equal(typeof project.hidden, 'boolean', `"${id}".hidden must be an explicit boolean`)
    assert.ok(Array.isArray(project.stages), `"${id}".stages must be an array`)
    assert.equal(typeof project.visual, 'string', `"${id}".visual`)
    assert.equal(typeof project.accent, 'string', `"${id}".accent`)
    assert.ok(Array.isArray(project.stack), `"${id}".stack must be an array`)
    assert.ok(['results', 'product'].includes(project.resultsSectionKey), `"${id}".resultsSectionKey`)
    assert.ok(Array.isArray(project.caseStudies), `"${id}".caseStudies must be an array`)
  }
})

test('model: every project has at least one category, all of them valid and not repeated', () => {
  for (const project of PROJECT_REGISTRY) {
    assert.ok(project.categories.length >= 1, `"${project.id}" has no category`)
    for (const category of project.categories) {
      assert.ok(isValidCategory(category), `"${project.id}" declares unknown category "${category}"`)
      assert.ok(CATEGORY_IDS.includes(category))
    }
    assert.equal(new Set(project.categories).size, project.categories.length, `"${project.id}" repeats a category`)
  }
})

test('model: categories[0] is the primary category of every project (frozen table)', () => {
  for (const [id, expected] of Object.entries(FROZEN)) {
    const project = getProjectEntry(id)
    assert.equal(project.categories[0], expected.categories[0], `"${id}" primary category`)
    assert.deepEqual([...project.categories], expected.categories, `"${id}" categories`)
  }
})

test('model: every tier, status, stage and visual is valid', () => {
  for (const project of PROJECT_REGISTRY) {
    assert.ok(PROJECT_TIERS.includes(project.tier), `"${project.id}" has invalid tier "${project.tier}"`)
    assert.ok(PROJECT_STATUSES.includes(project.status), `"${project.id}" has invalid status "${project.status}"`)
    for (const stage of project.stages) {
      assert.ok(PROJECT_STAGES.includes(stage), `"${project.id}" has invalid stage "${stage}"`)
    }
    assert.equal(new Set(project.stages).size, project.stages.length, `"${project.id}" repeats a stage`)
    assert.ok(
      PROJECT_VISUALS.includes(project.visual) || project.visual === PROCEDURAL_VISUAL,
      `"${project.id}" has invalid visual "${project.visual}"`,
    )
  }
  assert.ok(PROJECT_VISUALS.includes(PROCEDURAL_VISUAL), 'the procedural fallback must be a valid visual key')
})

test('model: accent is a token name, never a hex color', () => {
  for (const project of PROJECT_REGISTRY) {
    assert.match(project.accent, /^[a-z][a-z-]*$/, `"${project.id}" accent "${project.accent}" is not a token name`)
  }
})

test('model: the registry matches the frozen classification table exactly', () => {
  for (const [id, expected] of Object.entries(FROZEN)) {
    const project = getProjectEntry(id)
    assert.ok(project, `missing "${id}"`)
    assert.equal(project.tier, expected.tier, `"${id}" tier`)
    assert.deepEqual([...project.stages], expected.stages, `"${id}" stages`)
    assert.equal(project.visual, expected.visual, `"${id}" visual`)
    assert.equal(project.hidden, expected.hidden, `"${id}" hidden`)
  }
})

test('model: soma, hogares and kairos are the products; only soma is in production', () => {
  assert.deepEqual(
    PROJECT_REGISTRY.filter((p) => p.categories.includes('products')).map((p) => p.id).sort(),
    ['hogares', 'kairos', 'soma'],
  )
  assert.equal(getProjectEntry('soma').status, 'production')
  for (const id of ['hogares', 'kairos']) assert.equal(getProjectEntry(id).tier, 'compact')
})

test('model: a visual that is not "procedural" is only used by one of the featured/standard projects it was designed for', () => {
  const specific = PROJECT_REGISTRY.filter((p) => p.visual !== PROCEDURAL_VISUAL).map((p) => p.id).sort()
  assert.deepEqual(specific, ['aletheia', 'caelum', 'paradigm', 'providentia', 'tekmerion'])
})

// ── ALETHEIA ────────────────────────────────────────────────────────────────

test('ALETHEIA: exists in the registry, tagged Evidence · Research · Data Analysis, in evidence-research only', () => {
  const aletheia = getProjectEntry('aletheia')
  assert.ok(aletheia)
  assert.deepEqual([...aletheia.categories], ['evidence-research'])
  assert.deepEqual([...aletheia.tags], ['Evidence', 'Research', 'Data Analysis'])
  assert.ok(!aletheia.categories.includes('analytics-bi'))
  assert.ok(!aletheia.categories.includes('applied-ai'))
})

test('ALETHEIA: is hidden during F1 and invisible through every public accessor', () => {
  assert.equal(getProjectEntry('aletheia').hidden, true)
  assert.equal(hasProject('aletheia'), false)
  assert.equal(getProjectMeta('aletheia'), null)
  assert.ok(!ALL_PROJECT_IDS.includes('aletheia'))
  assert.ok(!FEATURED_PROJECT_IDS.includes('aletheia'))
  assert.ok(!APPLICATION_PROJECT_IDS.includes('aletheia'))
  assert.ok(!Object.hasOwn(PROJECTS_META, 'aletheia'))
  assert.ok(!Object.hasOwn(NODE_PROFILES, 'aletheia'))
  assert.ok(!TERRITORIES.some((territory) => territory.projectIds.includes('aletheia')))
  assert.ok(!getVisibleProjects().some((project) => project.id === 'aletheia'))
  assert.deepEqual(getCaseworkSlugsForProject('aletheia'), [])
})

test('ALETHEIA: #projects/aletheia is not a project-detail route while hidden', () => {
  const route = resolveAppRoute('#projects/aletheia', { hasCaseworkCase: () => false })
  assert.notEqual(route.view, 'project-detail')
})

test('ALETHEIA: the casework route that exists today (#casework/aletheia) is untouched by hiding the project', () => {
  const route = resolveAppRoute('#casework/aletheia', { hasCaseworkCase: (slug) => slug === 'aletheia' })
  assert.equal(route.view, 'casework-detail')
  assert.equal(route.params.caseSlug, 'aletheia')
})

test('ALETHEIA: has bilingual copy with every field the project pages need', () => {
  const required = [
    'rank', 'label', 'nodeSummary', 'tagline', 'description', 'problem', 'role',
    'impact', 'impactHighlight', 'highlights', 'artifacts', 'annotation', 'signals',
    'flowLead', 'flowSteps', 'evidenceLead', 'evidenceItems', 'nextStep',
  ]
  const entry = projectsCopy.aletheia
  assert.ok(entry)
  for (const language of ['es', 'en']) {
    for (const field of required) {
      const value = entry[language][field]
      if (Array.isArray(value)) assert.ok(value.length > 0, `aletheia.${language}.${field} is empty`)
      else assert.ok(typeof value === 'string' && value.length > 0, `aletheia.${language}.${field} missing`)
    }
  }
  assert.equal(entry.es.flowSteps.length, entry.en.flowSteps.length)
  assert.equal(entry.es.highlights.length, entry.en.highlights.length)
  assert.equal(entry.es.artifacts.length, entry.en.artifacts.length)
  assert.equal(entry.es.evidenceItems.length, entry.en.evidenceItems.length)
  assert.equal(entry.es.signals.length, entry.en.signals.length)
})

test('ALETHEIA: copy keeps its own framing (no AI framing, never re-labelled Analytics & BI / Data & BI)', () => {
  for (const language of ['es', 'en']) {
    const blob = JSON.stringify(projectsCopy.aletheia[language])
    assert.ok(!/\bAI\b|inteligencia artificial|machine learning|\bLLM\b/i.test(blob), `${language}: unexpected AI framing`)
    assert.ok(!/analytics & bi|data & bi/i.test(blob), `${language}: ALETHEIA must not be re-labelled Analytics & BI / Data & BI`)
  }
})

// ── DECERNO stays out ───────────────────────────────────────────────────────

test('DECERNO: completely absent until it is marked ready', () => {
  assert.equal(getProjectEntry('decerno'), null)
  assert.equal(hasProject('decerno'), false)
  assert.ok(!PROJECT_REGISTRY.some((project) => /decerno/i.test(project.id) || /decerno/i.test(project.title)))
  assert.ok(!Object.keys(projectsCopy).some((key) => /decerno/i.test(key)))
  assert.ok(!HOME_FEATURED_IDS.includes('decerno'))
  assert.ok(!Object.values(PIPELINE_ANCHORS).includes('decerno'))
})

// ── Visibility and filters ─────────────────────────────────────────────────

test('visibility: hidden projects never reach any public listing', () => {
  const hiddenIds = PROJECT_REGISTRY.filter((project) => project.hidden).map((project) => project.id)
  assert.deepEqual(hiddenIds, ['aletheia'])
  const visibleIds = getVisibleProjects().map((project) => project.id)
  for (const id of hiddenIds) assert.ok(!visibleIds.includes(id))
  assert.deepEqual([...visibleIds].sort(), [...ALL_PROJECT_IDS].sort())
  assert.equal(visibleIds.length, 9, 'the pre-redesign UI shows exactly its 9 projects')
})

test('filters today: Analytics & BI, DS / ML and Products & Engineering are visible', () => {
  assert.deepEqual(getVisibleCategoryFilters(), ['analytics-bi', 'ds-ml', 'products'])
})

test('filters today: real counts per category come from the visible projects (secondary categories count)', () => {
  const counts = countProjectsByCategory(getVisibleProjects())
  assert.deepEqual(counts, {
    'analytics-bi': 4, // caelum, clarusflow + paradigm and tekmerion as secondary
    'ds-ml': 3, // providentia, lumenvox + paradigm
    'applied-ai': 1, // tekmerion (secondary)
    products: 3, // soma, hogares, kairos
    'evidence-research': 0, // aletheia is hidden
  })
})

test('filters today: Applied AI is hidden', () => {
  assert.ok(!getVisibleCategoryFilters().includes('applied-ai'))
})

test('filters today: Evidence / Research is hidden', () => {
  assert.ok(!getVisibleCategoryFilters().includes('evidence-research'))
})

test('filters: Evidence / Research would STILL be hidden with ALETHEIA visible (one project < MIN_PROJECTS_FOR_FILTER)', () => {
  const withAletheia = PROJECT_REGISTRY // hidden entries included
  assert.equal(countProjectsByCategory(withAletheia)['evidence-research'], 1)
  assert.ok(1 < MIN_PROJECTS_FOR_FILTER)
  assert.ok(!getVisibleFilterCategories(withAletheia).includes('evidence-research'))
  assert.ok(!getVisibleFilterCategories(withAletheia).includes('applied-ai'))
})

test('filters: a hypothetical second evidence-research project would activate the filter with no code change', () => {
  const second = { id: 'future-research', categories: ['evidence-research'], hidden: false }
  const projects = [...PROJECT_REGISTRY, second]
  assert.ok(getVisibleFilterCategories(projects).includes('evidence-research'))
})

// ── Home / pipeline source of truth ─────────────────────────────────────────

test('home featured: declared as PROVIDENTIA · Caelum · ALETHEIA, all real registry ids', () => {
  assert.deepEqual([...HOME_FEATURED_IDS], ['providentia', 'caelum', 'aletheia'])
  for (const id of HOME_FEATURED_IDS) assert.ok(getProjectEntry(id), `"${id}" is not registered`)
})

test('home featured: while ALETHEIA is hidden only the visible ones resolve — nothing dead is exposed', () => {
  assert.deepEqual(getHomeFeaturedIds(), ['providentia', 'caelum'])
})

test('pipeline: every anchor is a registered project that declares that stage; stages are the four valid ones', () => {
  assert.deepEqual(Object.keys(PIPELINE_ANCHORS).sort(), [...PROJECT_STAGES].sort())
  for (const [stage, id] of Object.entries(PIPELINE_ANCHORS)) {
    const project = getProjectEntry(id)
    assert.ok(project, `anchor "${id}" for "${stage}" is not registered`)
    assert.ok(project.stages.includes(stage), `anchor "${id}" does not declare stage "${stage}"`)
  }
})

test('pipeline: a hidden anchor resolves to null today (evidence), visible ones resolve', () => {
  assert.equal(getPipelineAnchor('evidence'), null)
  assert.equal(getPipelineAnchor('data'), 'caelum')
  assert.equal(getPipelineAnchor('prediction'), 'providentia')
  assert.equal(getPipelineAnchor('decision'), 'providentia')
  assert.equal(getPipelineAnchor('not-a-stage'), null)
})

test('pipeline: getProjectsForStage lists only visible projects that declare the stage', () => {
  assert.deepEqual(getProjectsForStage('prediction').map((p) => p.id), ['providentia', 'paradigm', 'lumenvox'])
  assert.deepEqual(getProjectsForStage('data').map((p) => p.id), ['caelum', 'clarusflow'])
  assert.deepEqual(getProjectsForStage('evidence').map((p) => p.id), ['tekmerion'], 'ALETHEIA is hidden')
})

test('pipeline: `decision` is reserved for explicit policy/intervention evidence — only PROVIDENTIA today, Paradigm is prediction only', () => {
  assert.deepEqual(getProjectsForStage('decision').map((p) => p.id), ['providentia'])
  assert.deepEqual([...getProjectEntry('paradigm').stages], ['prediction'])
})

// ── Case studies on entries ─────────────────────────────────────────────────

test('caseStudies on entries mirror projects/caseStudies.js', () => {
  const all = listCaseStudies()
  for (const project of PROJECT_REGISTRY) {
    assert.deepEqual(
      project.caseStudies.map((study) => study.slug),
      all.filter((study) => study.projectId === project.id).map((study) => study.slug),
    )
  }
  assert.equal(getProjectEntry('paradigm').caseStudies.length, 2)
  assert.equal(getProjectEntry('providentia').caseStudies.length, 3)
  assert.equal(getProjectEntry('aletheia').caseStudies.length, 1)
})

// ── Shims: still producing what the current UI was built against ───────────

test('shims: FEATURED / APPLICATION / ALL keep the exact pre-redesign ids and order', () => {
  assert.deepEqual(FEATURED_PROJECT_IDS, ['providentia', 'caelum', 'paradigm', 'soma'])
  assert.deepEqual(APPLICATION_PROJECT_IDS, ['hogares', 'tekmerion', 'kairos', 'clarusflow', 'lumenvox'])
  assert.deepEqual(ALL_PROJECT_IDS, [...FEATURED_PROJECT_IDS, ...APPLICATION_PROJECT_IDS])
})

test('shims: NODE_PROFILES equal the pre-redesign values', () => {
  assert.deepEqual(NODE_PROFILES, {
    paradigm: { status: 'Active', weight: 'major' },
    soma: { status: 'Production', weight: 'major' },
    providentia: { status: 'Active', weight: 'major' },
    caelum: { status: 'Active', weight: 'major' },
    hogares: { status: 'Active' },
    tekmerion: { status: 'Active' },
    kairos: { status: 'Active' },
    clarusflow: { status: 'Active' },
    lumenvox: { status: 'Active' },
  })
})

test('shims: TERRITORIES are unchanged', () => {
  assert.deepEqual(
    TERRITORIES.map((t) => [t.id, t.code, t.projectIds]),
    [
      ['intelligence', 'INT', ['paradigm', 'providentia', 'tekmerion', 'lumenvox']],
      ['data-systems', 'DAT', ['caelum', 'clarusflow']],
      ['operational-products', 'OPS', ['soma', 'hogares', 'kairos']],
    ],
  )
})

test('shims: PROJECTS_META keeps priority, caseworkSlugs, accent names and the existing links', () => {
  const priorities = Object.fromEntries(ALL_PROJECT_IDS.map((id) => [id, PROJECTS_META[id].priority]))
  assert.deepEqual(priorities, {
    providentia: 'primary',
    caelum: 'primary',
    paradigm: 'primary',
    soma: 'primary',
    hogares: 'secondary',
    tekmerion: 'secondary',
    kairos: 'secondary',
    clarusflow: 'secondary',
    lumenvox: 'secondary',
  })
  assert.deepEqual(
    Object.fromEntries(ALL_PROJECT_IDS.map((id) => [id, PROJECTS_META[id].accent])),
    {
      providentia: 'sky',
      caelum: 'sky',
      paradigm: 'emerald',
      soma: 'violet',
      hogares: 'violet',
      tekmerion: 'sky',
      kairos: 'emerald',
      clarusflow: 'sky',
      lumenvox: 'violet',
    },
  )
  assert.deepEqual(PROJECTS_META.caelum.caseworkSlugs, [])
  assert.equal(PROJECTS_META.soma.privateRepo, true)
  assert.equal(PROJECTS_META.soma.hasDemoVideo, true)
  assert.equal(PROJECTS_META.paradigm.githubCtaKey, 'projects.githubPublicInterface')
  assert.ok(PROJECTS_META.providentia.githubUrl.includes('PROVIDENTIA'))
  assert.deepEqual(PROJECTS_META.providentia.evidenceVisuals.map((v) => v.id), ['forecast', 'exceedance'])
})

test('shims: getCaseworkSlugsForProject derives from the canonical case studies', () => {
  assert.deepEqual(getCaseworkSlugsForProject('paradigm'), ['no-show', 'operational-risk'])
  assert.deepEqual(getCaseworkSlugsForProject('providentia'), ['demand-forecasting', 'capacity-decision', 'policy-decision'])
  assert.deepEqual(getCaseworkSlugsForProject('soma'), [])
  assert.deepEqual(getCaseworkSlugsForProject('not-a-project'), [])
})

test('shims: mergeProjectCopy (the UI entry point) still returns legacy-shaped status/weight for every visible project', () => {
  for (const id of ALL_PROJECT_IDS) {
    for (const language of ['es', 'en']) {
      const merged = mergeProjectCopy(id, language)
      assert.equal(merged.id, id)
      assert.ok(['Active', 'Production'].includes(merged.status), `"${id}" status "${merged.status}"`)
      assert.equal(merged.status, NODE_PROFILES[id].status)
      assert.equal(merged.weight, NODE_PROFILES[id].weight)
      assert.equal(merged.priority, PROJECTS_META[id].priority)
      assert.ok(merged.tagline || merged.description, `"${id}" lost its copy`)
    }
  }
})
