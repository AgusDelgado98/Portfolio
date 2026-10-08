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
  getProjectEntry,
  getVisibleProjects,
  hasProject,
  getProjectMeta,
  getHomeFeaturedIds,
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
  caelum: { categories: ['analytics-bi'], tier: 'featured', stages: ['data'], visual: 'pipeline', hidden: false },
  aletheia: { categories: ['evidence-research'], tier: 'featured', stages: ['evidence'], visual: 'evidence-network', hidden: false },
  paradigm: { categories: ['ds-ml', 'analytics-bi'], tier: 'featured', stages: ['prediction'], visual: 'risk-threshold', hidden: false },
  soma: { categories: ['products'], tier: 'featured', stages: [], visual: 'procedural', hidden: false },
  tekmerion: { categories: ['analytics-bi', 'applied-ai'], tier: 'standard', stages: ['evidence'], visual: 'rules-vs-ml', hidden: false },
  lumenvox: { categories: ['ds-ml'], tier: 'standard', stages: ['prediction'], visual: 'procedural', hidden: false },
  clarusflow: { categories: ['analytics-bi'], tier: 'standard', stages: ['data'], visual: 'procedural', hidden: false },
  hogares: { categories: ['products'], tier: 'compact', stages: [], visual: 'procedural', hidden: true },
  kairos: { categories: ['products'], tier: 'compact', stages: [], visual: 'procedural', hidden: true },
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

test('visibility: Hogares and Kairós stay in the registry and stay out of every public listing', () => {
  const hiddenIds = PROJECT_REGISTRY.filter((project) => project.hidden).map((project) => project.id)
  assert.deepEqual(hiddenIds.sort(), ['hogares', 'kairos'])
  const visibleIds = getVisibleProjects().map((project) => project.id)
  for (const id of hiddenIds) assert.ok(!visibleIds.includes(id))
  assert.deepEqual([...visibleIds].sort(), [...ALL_PROJECT_IDS].sort())
  assert.equal(visibleIds.length, 8)
  assert.equal(getProjectMeta('hogares'), null)
  assert.ok(getProjectEntry('hogares'))
  assert.ok(getProjectEntry('kairos'))
})

test('filters today: Analytics & BI and DS / ML are visible; Products falls below the minimum', () => {
  assert.deepEqual(getVisibleCategoryFilters(), ['analytics-bi', 'ds-ml'])
  assert.ok(!getVisibleCategoryFilters().includes('products'))
})

test('filters today: real counts per category come from the visible projects (secondary categories count)', () => {
  const counts = countProjectsByCategory(getVisibleProjects())
  assert.deepEqual(counts, {
    'analytics-bi': 4, // caelum, clarusflow + paradigm and tekmerion as secondary
    'ds-ml': 3, // providentia, lumenvox + paradigm
    'applied-ai': 1, // tekmerion (secondary)
    products: 1, // soma; hogares and kairos are hidden
    'evidence-research': 1, // aletheia (visible since F3) — still below MIN_PROJECTS_FOR_FILTER
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

test('home featured: all three resolve now that ALETHEIA is visible; a hidden id would be filtered out', () => {
  assert.deepEqual(getHomeFeaturedIds(), ['providentia', 'caelum', 'aletheia'])
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
  assert.equal(getPipelineAnchor('data'), 'caelum')
  assert.equal(getPipelineAnchor('prediction'), 'providentia')
  assert.equal(getPipelineAnchor('decision'), 'providentia')
  assert.equal(getPipelineAnchor('not-a-stage'), null)
})

test('pipeline: getProjectsForStage lists only visible projects that declare the stage', () => {
  assert.deepEqual(getProjectsForStage('prediction').map((p) => p.id), ['providentia', 'paradigm', 'lumenvox'])
  assert.deepEqual(getProjectsForStage('data').map((p) => p.id), ['caelum', 'clarusflow'])
  assert.deepEqual(getProjectsForStage('evidence').map((p) => p.id), ['aletheia', 'tekmerion'])
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
      caelum: 'sky',
      aletheia: 'emerald',
      paradigm: 'emerald',
      soma: 'violet',
      tekmerion: 'sky',
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
