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
  WORK_PROJECT_ORDER,
  HOME_PERSONAL_IDS,
  PROJECT_GROUPS,
  PROJECT_USAGES,
  DATA_PROVENANCES,
  PIPELINE_ANCHORS,
  ALL_PROJECT_IDS,
  getProjectEntry,
  getVisibleProjects,
  hasProject,
  getProjectMeta,
  getHomeWorkIds,
  getHomePersonalIds,
  getProjectsByGroup,
  getPipelineAnchor,
  getProjectsForStage,
  getVisibleCategoryFilters,
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
import * as registryExports from './registry.js'

/**
 * F1 model tests (PLAN-FROZEN v1.1). registry.test.js is kept untouched on
 * purpose: it is the proof that the temporary shims still satisfy the
 * consumers the current UI was built against.
 */

// The frozen classification table — the single place these values are asserted.
const FROZEN = {
  providentia: { categories: ['ds-ml'], tier: 'flagship', stages: ['prediction', 'decision'], visual: 'forecast', hidden: false },
  decerno: { categories: ['ds-ml'], tier: 'featured', stages: [], visual: 'procedural', hidden: false },
  caelum: { categories: ['analytics-bi'], tier: 'featured', stages: ['data'], visual: 'pipeline', hidden: true },
  aletheia: { categories: ['evidence-research'], tier: 'featured', stages: ['evidence'], visual: 'evidence-network', hidden: false },
  paradigm: { categories: ['ds-ml', 'analytics-bi'], tier: 'featured', stages: ['prediction'], visual: 'risk-threshold', hidden: false },
  constantia: { categories: ['products'], tier: 'featured', stages: [], visual: 'procedural', hidden: false },
  soma: { categories: ['products'], tier: 'featured', stages: [], visual: 'product-surfaces', hidden: false },
  lumenvox: { categories: ['ds-ml'], tier: 'standard', stages: ['prediction'], visual: 'procedural', hidden: false },
  clarusflow: { categories: ['analytics-bi'], tier: 'standard', stages: ['data'], visual: 'procedural', hidden: false },
  hogares: { categories: ['products'], tier: 'featured', stages: [], visual: 'procedural', hidden: false },
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

test('model: constantia, soma and hogares are the products, all in professional use; only CONSTANTIA carries the "In production" label', () => {
  assert.deepEqual(
    PROJECT_REGISTRY.filter((p) => p.categories.includes('products')).map((p) => p.id).sort(),
    ['constantia', 'hogares', 'soma'],
  )
  for (const id of ['constantia', 'soma', 'hogares']) {
    assert.equal(getProjectEntry(id).status, 'active', id)
    assert.equal(getProjectEntry(id).usage, 'professional', id)
    assert.equal(getProjectEntry(id).tier, 'featured', id)
  }
  assert.equal(getProjectEntry('constantia').statusLabelKey, 'InProduction')
  assert.equal(getProjectEntry('soma').statusLabelKey, undefined)
  assert.equal(getProjectEntry('hogares').statusLabelKey, undefined)
  assert.ok(!PROJECT_STATUSES.includes('production'))
})

test('model: a visual that is not "procedural" is only used by one of the featured/standard projects it was designed for', () => {
  const specific = PROJECT_REGISTRY.filter((p) => p.visual !== PROCEDURAL_VISUAL).map((p) => p.id).sort()
  assert.deepEqual(specific, ['aletheia', 'caelum', 'paradigm', 'providentia', 'soma'])
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

test('ALETHEIA: is visible since F3 and shows up through every public accessor', () => {
  assert.equal(getProjectEntry('aletheia').hidden, false)
  assert.equal(hasProject('aletheia'), true)
  assert.equal(getProjectMeta('aletheia')?.id, 'aletheia')
  assert.ok(ALL_PROJECT_IDS.includes('aletheia'))
  assert.equal(getProjectMeta('aletheia').tier, 'featured')
  assert.ok(getVisibleProjects().some((project) => project.id === 'aletheia'))
  assert.deepEqual(
    getProjectEntry('aletheia').caseStudies.map((study) => study.slug),
    ['evidence-case'],
  )
})

test('ALETHEIA: #projects/aletheia is a Project Detail route now that the project is visible', () => {
  const route = resolveAppRoute('#projects/aletheia')
  assert.equal(route.view, 'project-detail')
  assert.deepEqual(route.params, { projectId: 'aletheia' })
})

test('ALETHEIA: its Evidence Case page is reachable by its canonical route and by its legacy alias', () => {
  const study = listCaseStudies().find((candidate) => candidate.projectId === 'aletheia')
  const canonical = resolveAppRoute(study.canonicalHash)
  assert.equal(canonical.view, 'project-case')
  assert.deepEqual(canonical.params, { projectId: 'aletheia', caseSlug: study.slug, caseSection: null })
  const legacy = resolveAppRoute(study.legacyHash)
  assert.equal(legacy.view, 'project-case')
  assert.equal(legacy.canonicalHash, study.canonicalHash)
  assert.equal(legacy.legacyHash, study.legacyHash)
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

// ── DECERNO: registered, not published ─────────────────────────────────────
// The full publication contract (every public surface) lives in publication.test.js.

test('DECERNO: published in the personal lab; not on Home lists or as a pipeline anchor', () => {
  assert.equal(getProjectEntry('decerno').publication, 'published')
  assert.equal(hasProject('decerno'), true)
  assert.ok(getProjectMeta('decerno'))
  assert.ok(projectsCopy.decerno.es && projectsCopy.decerno.en)
  assert.ok(!WORK_PROJECT_ORDER.includes('decerno') && !HOME_PERSONAL_IDS.includes('decerno'))
  assert.ok(!Object.values(PIPELINE_ANCHORS).includes('decerno'), 'its decision stage is designed, not demonstrated')
})

// ── Visibility and filters ─────────────────────────────────────────────────

test('visibility: Caelum stays in the registry and out of every public listing; Kairós and Tekmérion are gone', () => {
  const hiddenIds = PROJECT_REGISTRY.filter((project) => project.hidden).map((project) => project.id)
  assert.deepEqual(hiddenIds.sort(), ['caelum'])
  const visibleIds = getVisibleProjects().map((project) => project.id)
  for (const id of hiddenIds) assert.ok(!visibleIds.includes(id))
  assert.deepEqual([...visibleIds].sort(), [...ALL_PROJECT_IDS].sort())
  assert.equal(visibleIds.length, 9)
  assert.equal(getProjectMeta('caelum'), null)
  assert.ok(getProjectMeta('decerno'))
  assert.ok(getProjectMeta('hogares'))
  assert.ok(getProjectEntry('caelum'))
  assert.equal(getProjectEntry('kairos'), null)
  assert.equal(getProjectEntry('tekmerion'), null)
})

test('filters today: Analytics & BI, DS / ML and Products reach the minimum; Applied AI and Evidence stay below it', () => {
  assert.deepEqual(getVisibleCategoryFilters(), ['analytics-bi', 'ds-ml', 'products'])
})

test('filters today: real counts per category come from the visible projects (secondary categories count)', () => {
  const counts = countProjectsByCategory(getVisibleProjects())
  assert.deepEqual(counts, {
    'analytics-bi': 2, // clarusflow + paradigm as secondary
    'ds-ml': 4, // providentia, decerno, lumenvox + paradigm
    'applied-ai': 0,
    products: 3, // constantia, soma, hogares
    'evidence-research': 1, // aletheia — still below MIN_PROJECTS_FOR_FILTER
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

test('groups: CONSTANTIA · SOMA · HOGARES are the projects in use, in that order; every other visible project is the personal lab', () => {
  assert.deepEqual([...WORK_PROJECT_ORDER], ['constantia', 'soma', 'hogares'])
  for (const id of WORK_PROJECT_ORDER) {
    const project = getProjectEntry(id)
    assert.equal(project.group, 'work', `"${id}".group`)
    assert.equal(project.usage, 'professional', `"${id}".usage`)
    assert.ok(project.dataProvenance === null || DATA_PROVENANCES.includes(project.dataProvenance), `"${id}".dataProvenance`)
  }
  assert.deepEqual(
    PROJECT_REGISTRY.filter((project) => project.group === 'work').map((project) => project.id).sort(),
    [...WORK_PROJECT_ORDER].sort(),
  )
  assert.deepEqual(getProjectsByGroup('work').map((project) => project.id), ['constantia', 'soma', 'hogares'])
  assert.deepEqual(
    getProjectsByGroup('personal').map((project) => project.id),
    ['providentia', 'decerno', 'paradigm', 'aletheia', 'clarusflow', 'lumenvox'],
  )
})

test('groups: every visible project has a valid group; usage and provenance exist only where they are declared', () => {
  for (const project of getVisibleProjects()) {
    assert.ok(PROJECT_GROUPS.includes(project.group), `"${project.id}" has no valid group`)
    if (project.group === 'personal') {
      assert.equal(project.usage, null, `"${project.id}" is personal and must not claim professional use`)
    }
  }
  for (const project of PROJECT_REGISTRY) {
    assert.ok(project.usage === null || PROJECT_USAGES.includes(project.usage), `"${project.id}".usage`)
    assert.ok(project.dataProvenance === null || DATA_PROVENANCES.includes(project.dataProvenance), `"${project.id}".dataProvenance`)
  }
})

test('groups: the provenance of each public demonstration (PARADIGM synthetic · PROVIDENTIA public · SOMA and CONSTANTIA fictitious)', () => {
  assert.equal(getProjectEntry('constantia').dataProvenance, 'fictitious')
  assert.equal(getProjectEntry('paradigm').dataProvenance, 'synthetic')
  assert.equal(getProjectEntry('providentia').dataProvenance, 'public')
  assert.equal(getProjectEntry('soma').dataProvenance, 'fictitious')
})

test('home groups: work = CONSTANTIA · SOMA · HOGARES, personal = Caelum · ALETHEIA; all resolve through the registry', () => {
  assert.deepEqual(getHomeWorkIds(), ['constantia', 'soma', 'hogares'])
  assert.deepEqual([...HOME_PERSONAL_IDS], ['caelum', 'aletheia'])
  assert.deepEqual(getHomePersonalIds(), ['aletheia'])
  for (const id of [...WORK_PROJECT_ORDER, ...HOME_PERSONAL_IDS]) assert.ok(getProjectEntry(id), `"${id}" is not registered`)
})

test('pipeline: every anchor is a registered project that declares that stage; stages are the four valid ones', () => {
  assert.deepEqual(Object.keys(PIPELINE_ANCHORS).sort(), [...PROJECT_STAGES].sort())
  for (const [stage, id] of Object.entries(PIPELINE_ANCHORS)) {
    const project = getProjectEntry(id)
    assert.ok(project, `anchor "${id}" for "${stage}" is not registered`)
    assert.ok(project.stages.includes(stage), `anchor "${id}" does not declare stage "${stage}"`)
  }
})

test('pipeline: every anchor resolves now that ALETHEIA is visible', () => {
  assert.equal(getPipelineAnchor('evidence'), 'aletheia')
  assert.equal(PIPELINE_ANCHORS.data, 'caelum')
  assert.equal(getPipelineAnchor('data'), null, 'Caelum is withheld, so the public data anchor is empty')
  assert.equal(getPipelineAnchor('prediction'), 'providentia')
  assert.equal(getPipelineAnchor('decision'), 'providentia')
  assert.equal(getPipelineAnchor('not-a-stage'), null)
})

test('pipeline: getProjectsForStage lists only visible projects that declare the stage', () => {
  assert.deepEqual(getProjectsForStage('prediction').map((p) => p.id), ['providentia', 'paradigm', 'lumenvox'])
  assert.deepEqual(getProjectsForStage('data').map((p) => p.id), ['clarusflow'])
  assert.deepEqual(getProjectsForStage('evidence').map((p) => p.id), ['aletheia'])
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

test('F4: Atlas shims are gone', () => {
  assert.equal('TERRITORIES' in registryExports, false)
  assert.equal('NODE_PROFILES' in registryExports, false)
  assert.equal('FEATURED_PROJECT_IDS' in registryExports, false)
  assert.equal('getTerritoryForProject' in registryExports, false)
})

test('registry links survive on getProjectMeta', () => {
  assert.equal(getProjectMeta('soma').privateRepo, true)
  assert.equal(getProjectMeta('soma').hasDemoVideo, true)
  assert.equal(getProjectMeta('paradigm').githubCtaKey, 'projects.githubPublicInterface')
  assert.ok(getProjectMeta('providentia').githubUrl.includes('PROVIDENTIA'))
  assert.deepEqual(getProjectMeta('providentia').evidenceVisuals.map((item) => item.id), ['forecast', 'exceedance'])
  assert.deepEqual(
    Object.fromEntries(ALL_PROJECT_IDS.map((id) => [id, getProjectMeta(id).accent])),
    {
      providentia: 'sky',
      decerno: 'sky',
      aletheia: 'emerald',
      paradigm: 'emerald',
      constantia: 'sky',
      soma: 'violet',
      hogares: 'violet',
      lumenvox: 'violet',
      clarusflow: 'sky',
    },
  )
})

test('mergeProjectCopy keeps registry status and tier, and still attaches copy', () => {
  for (const id of ALL_PROJECT_IDS) {
    for (const language of ['es', 'en']) {
      const merged = mergeProjectCopy(id, language)
      const meta = getProjectMeta(id)
      assert.equal(merged.id, id)
      assert.equal(merged.status, meta.status)
      assert.equal(merged.tier, meta.tier)
      assert.equal(merged.title, meta.title)
      assert.ok(merged.tagline || merged.description, `"${id}" lost its copy`)
    }
  }
})
