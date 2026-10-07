import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  ALL_PROJECT_IDS,
  getProjectEntry,
  getProjectMeta,
  getVisibleCategoryFilters,
  getVisibleProjects,
} from './registry.js'
import { ALL_FILTER_ID, filterProjectsByCategory } from './categories.js'
import { pickProjectCopy } from '../i18n/messages/projects.js'
import { buildDetailSections, DETAIL_SECTION_ORDER } from './detailModel.js'
import { cardShowsFeaturedPresence, cardVariant } from './catalog.js'
import { proceduralSeries } from '../visual/procedural.js'

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8')

const CATALOG = [
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
]

function idsOf(sections) {
  return sections.map((section) => section.id)
}

function inCanonicalOrder(ids) {
  const indexes = ids.map((id) => DETAIL_SECTION_ORDER.indexOf(id))
  return indexes.every((index, position) => index !== -1 && (position === 0 || index > indexes[position - 1]))
}

test('ten visible projects, in catalog order, and DECERNO is absent', () => {
  assert.deepEqual(getVisibleProjects().map((project) => project.id), CATALOG)
  assert.equal(ALL_PROJECT_IDS.length, 10)
  assert.equal(getProjectEntry('decerno'), null)
})

test('visible filters come from the registry rule: All is separate, Evidence and Applied AI stay hidden', () => {
  assert.deepEqual(getVisibleCategoryFilters(), ['analytics-bi', 'ds-ml', 'products'])
  assert.ok(!getVisibleCategoryFilters().includes('evidence-research'))
  assert.ok(!getVisibleCategoryFilters().includes('applied-ai'))
})

test('ALETHEIA is in All and in no visible category filter', () => {
  const visible = getVisibleProjects()
  const all = filterProjectsByCategory(visible, ALL_FILTER_ID).map((project) => project.id)
  assert.ok(all.includes('aletheia'))
  for (const filter of getVisibleCategoryFilters()) {
    const ids = filterProjectsByCategory(visible, filter).map((project) => project.id)
    assert.ok(!ids.includes('aletheia'), `ALETHEIA leaked into ${filter}`)
  }
})

test('a project in two categories appears in both filters', () => {
  const visible = getVisibleProjects()
  assert.ok(filterProjectsByCategory(visible, 'ds-ml').some((project) => project.id === 'paradigm'))
  assert.ok(filterProjectsByCategory(visible, 'analytics-bi').some((project) => project.id === 'paradigm'))
  assert.ok(filterProjectsByCategory(visible, 'analytics-bi').some((project) => project.id === 'tekmerion'))
  assert.ok(!getVisibleCategoryFilters().includes('applied-ai'))
})

test('hidden projects are excluded from the catalog and from filters', () => {
  const hidden = { id: 'decerno', categories: ['ds-ml'], hidden: true, tier: 'featured' }
  const list = [...getVisibleProjects(), hidden]
  assert.ok(!filterProjectsByCategory(list.filter((project) => !project.hidden), 'ds-ml').some((project) => project.id === 'decerno'))
  assert.equal(getProjectMeta('decerno'), null)
})

test('tiers: flagship, featured presence, standard card, compact Hogares and Kairós, Soma not relegated', () => {
  assert.equal(cardVariant('flagship'), 'flagship')
  assert.equal(cardVariant('featured'), 'standard')
  assert.equal(cardVariant('standard'), 'standard')
  assert.equal(cardVariant('compact'), 'compact')
  assert.equal(cardShowsFeaturedPresence('featured'), true)
  assert.equal(getProjectMeta('providentia').tier, 'flagship')
  assert.equal(getProjectMeta('soma').tier, 'featured')
  assert.equal(cardVariant(getProjectMeta('soma').tier), 'standard')
  assert.equal(cardShowsFeaturedPresence(getProjectMeta('soma').tier), true)
  assert.equal(cardVariant(getProjectMeta('hogares').tier), 'compact')
  assert.equal(cardVariant(getProjectMeta('kairos').tier), 'compact')
  assert.equal(getProjectMeta('tekmerion').tier, 'standard')
})

test('detail sections stay in order and omit empty ones', () => {
  for (const project of getVisibleProjects()) {
    for (const language of ['es', 'en']) {
      const sections = buildDetailSections(project, pickProjectCopy(project.id, language))
      const ids = idsOf(sections)
      assert.equal(new Set(ids).size, ids.length, `${project.id} repeated a section`)
      assert.ok(inCanonicalOrder(ids), `${language} ${project.id}: ${ids.join(',')}`)
      assert.ok(ids.includes('overview'), project.id)
      for (const section of sections) {
        if (section.steps) assert.ok(section.steps.length > 0)
        if (section.items) assert.ok(section.items.length > 0)
        if (section.studies) assert.ok(section.studies.length > 0)
      }
    }
  }
})

test('Decision only where stages include it; Paradigm and ALETHEIA do not get one', () => {
  for (const language of ['es', 'en']) {
    const providentia = idsOf(buildDetailSections(getProjectMeta('providentia'), pickProjectCopy('providentia', language)))
    const paradigm = idsOf(buildDetailSections(getProjectMeta('paradigm'), pickProjectCopy('paradigm', language)))
    const aletheia = idsOf(buildDetailSections(getProjectMeta('aletheia'), pickProjectCopy('aletheia', language)))
    const soma = idsOf(buildDetailSections(getProjectMeta('soma'), pickProjectCopy('soma', language)))
    assert.ok(providentia.includes('decision'))
    assert.ok(providentia.includes('data'))
    assert.ok(providentia.includes('limits'))
    assert.ok(!paradigm.includes('decision'))
    assert.ok(!aletheia.includes('decision'))
    assert.ok(!soma.includes('decision'))
    assert.ok(!soma.includes('data'))
    assert.ok(soma.includes('product'))
    assert.ok(!soma.includes('results'))
  }
})

test('Scope & limits, cases and links follow the real copy', () => {
  for (const language of ['es', 'en']) {
    const providentia = buildDetailSections(getProjectMeta('providentia'), pickProjectCopy('providentia', language))
    const limits = providentia.find((section) => section.id === 'limits')
    assert.ok(limits.items.length >= 2)
    const cases = providentia.find((section) => section.id === 'cases')
    assert.deepEqual(
      cases.studies.map((study) => study.slug).sort(),
      ['capacity-decision', 'demand-forecasting', 'policy-decision'],
    )
    assert.ok(cases.studies.every((study) => study.canonicalHash.startsWith('#projects/providentia/')))

    const paradigm = buildDetailSections(getProjectMeta('paradigm'), pickProjectCopy('paradigm', language))
    assert.deepEqual(
      paradigm.find((section) => section.id === 'cases').studies.map((study) => study.slug).sort(),
      ['no-show', 'operational-risk'],
    )

    const aletheia = buildDetailSections(getProjectMeta('aletheia'), pickProjectCopy('aletheia', language))
    assert.deepEqual(
      aletheia.find((section) => section.id === 'cases').studies.map((study) => study.canonicalHash),
      ['#projects/aletheia/evidence-case'],
    )
    assert.ok(!aletheia.some((section) => section.id === 'links'))
    assert.ok(aletheia.some((section) => section.id === 'technical'))
    assert.equal(getProjectMeta('aletheia').stack.length, 0)
    assert.equal(getProjectMeta('aletheia').githubUrl, undefined)

    const soma = buildDetailSections(getProjectMeta('soma'), pickProjectCopy('soma', language))
    assert.equal(soma.find((section) => section.id === 'product').demo, true)
    assert.ok(soma.some((section) => section.id === 'links'))
    assert.equal(getProjectMeta('soma').privateRepo, true)
  }
})

test('Products without a documented limitation do not grow an empty limits section', () => {
  for (const id of ['soma', 'hogares', 'kairos']) {
    const sections = buildDetailSections(getProjectMeta(id), pickProjectCopy(id, 'es'))
    assert.ok(!sections.some((section) => section.id === 'limits'), id)
    assert.ok(!sections.some((section) => section.id === 'data'), id)
  }
})

test('Projects UI does not import the retired Atlas or Cards views, and detail uses details', () => {
  const index = read('components/ProjectsIndex.jsx')
  const detail = read('components/ProjectDetail.jsx')
  assert.ok(!index.includes('ProjectsAtlas'))
  assert.ok(!index.includes('ProjectsCards'))
  assert.match(detail, /<details/)
  assert.match(detail, /buildDetailSections/)
  assert.ok(!detail.includes('getTerritoryForProject'))
  assert.ok(!fs.existsSync(path.join(srcDir, 'components/ProjectsAtlas.jsx')))
  assert.ok(!fs.existsSync(path.join(srcDir, 'components/ProjectsCards.jsx')))
  assert.ok(!fs.existsSync(path.join(srcDir, 'projects-view.css')))
})

test('section nav scrolls inside the canonical project hash', () => {
  const nav = read('components/projects/SectionNav.jsx')
  const detail = read('components/ProjectDetail.jsx')
  assert.match(nav, /href=\{fallback\}/)
  assert.match(nav, /projectHash\(projectId\)/)
  assert.match(nav, /preventDefault\(\)/)
  assert.match(nav, /scrollIntoView/)
  assert.match(nav, /\.focus\(/)
  assert.ok(!/location\.hash|pushState|replaceState/.test(nav))
  assert.match(detail, /<SectionNav projectId=\{project\.id\} sections=\{sections\}/)
  assert.ok(!nav.includes('decision') && !nav.includes('overview'), 'the nav lists only the sections it is given')
  const sectionTags = detail.match(/<section\b[^>]*>/g) || []
  assert.ok(sectionTags.length >= 7)
  for (const tag of sectionTags) assert.match(tag, /tabIndex=\{-1\}/)
  assert.ok(!read('router/syncRoute.js').includes('detail-'))
})

test('no functional in-page detail hash remains under src', () => {
  const needle = '#' + 'detail-'
  const files = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else files.push(full)
    }
  }
  walk(srcDir)
  const hits = files.filter((file) => fs.readFileSync(file, 'utf8').includes(needle))
  assert.deepEqual(hits, [])
})

test('procedural marks are deterministic per id and do not use Math.random', () => {
  assert.deepEqual(proceduralSeries('soma'), proceduralSeries('soma'))
  assert.notDeepEqual(proceduralSeries('soma'), proceduralSeries('hogares'))
  const source = read('visual/procedural.js') + read('visual/ProceduralVisual.jsx') + read('visual/RiskThresholdVisual.jsx')
  assert.ok(!source.includes('Math.random'))
})
