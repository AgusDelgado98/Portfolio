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
import { buildDetailModel, DETAIL_SECTION_ORDER } from './detailModel.js'
import { POLICY_TRADEOFF } from '../visual/data/providentia.js'
import { formatNumber, formatPercent } from '../visual/format.js'
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
]

function idsOf(model) {
  return model.sections
}

function inCanonicalOrder(ids) {
  const indexes = ids.map((id) => DETAIL_SECTION_ORDER.indexOf(id))
  return indexes.every((index, position) => index !== -1 && (position === 0 || index > indexes[position - 1]))
}

test('eight visible projects, in catalog order, and DECERNO is absent', () => {
  assert.deepEqual(getVisibleProjects().map((project) => project.id), CATALOG)
  assert.equal(ALL_PROJECT_IDS.length, 8)
  assert.equal(getProjectEntry('decerno'), null)
  assert.equal(getProjectMeta('hogares'), null)
  assert.equal(getProjectMeta('kairos'), null)
  assert.equal(getProjectEntry('hogares').hidden, true)
  assert.equal(getProjectEntry('kairos').hidden, true)
})

test('visible filters come from the registry rule: All is separate, Evidence, Applied AI and Products stay hidden', () => {
  assert.deepEqual(getVisibleCategoryFilters(), ['analytics-bi', 'ds-ml'])
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
  assert.equal(cardVariant(getProjectEntry('hogares').tier), 'compact')
  assert.equal(cardVariant(getProjectEntry('kairos').tier), 'compact')
  assert.equal(getProjectMeta('tekmerion').tier, 'standard')
})

const model = (id, language) => buildDetailModel(getProjectEntry(id), pickProjectCopy(id, language))

test('detail sections stay in order and omit empty ones', () => {
  for (const project of getVisibleProjects()) {
    for (const language of ['es', 'en']) {
      const built = model(project.id, language)
      const ids = idsOf(built)
      assert.equal(new Set(ids).size, ids.length, `${project.id} repeated a section`)
      assert.ok(inCanonicalOrder(ids), `${language} ${project.id}: ${ids.join(',')}`)
      assert.ok(ids.includes('question') || ids.includes('work'), project.id)
      assert.ok(ids.length <= 9, `${project.id} has more than nine sections`)
      if (ids.includes('method')) assert.ok(built.method.length > 0)
      if (ids.includes('limits')) assert.ok(built.limits.length > 0)
      if (ids.includes('cases')) assert.ok(built.studies.length > 0)
    }
  }
})

test('Decision only where stages include it; Paradigm and ALETHEIA do not get one', () => {
  for (const language of ['es', 'en']) {
    const providentia = idsOf(model('providentia', language))
    const paradigm = idsOf(model('paradigm', language))
    const aletheia = idsOf(model('aletheia', language))
    const soma = idsOf(model('soma', language))
    assert.ok(providentia.includes('decision'))
    assert.ok(providentia.includes('method'))
    assert.ok(providentia.includes('limits'))
    assert.ok(!paradigm.includes('decision'))
    assert.ok(!aletheia.includes('decision'))
    assert.ok(!soma.includes('decision'))
    assert.ok(!soma.includes('method'))
    // SOMA leads with professional use and what the platform does; its video sits with the public demonstration.
    assert.deepEqual(soma.slice(0, 3), ['work', 'what', 'demo'])
    assert.ok(!soma.includes('results'))
    assert.ok(!soma.includes('product'))
    // The other work-linked projects share the priority order: work, what, ..., demo, results.
    for (const ids of [providentia, paradigm]) {
      assert.deepEqual(ids.slice(0, 2), ['work', 'what'])
      assert.ok(ids.indexOf('demo') > ids.indexOf('method') && ids.indexOf('results') > ids.indexOf('demo'))
    }
  }
})

test('Scope & limits, cases and technical details follow the real copy', () => {
  for (const language of ['es', 'en']) {
    const providentia = model('providentia', language)
    assert.ok(providentia.limits.length >= 2 && providentia.limits.length <= 4)
    assert.deepEqual(
      providentia.studies.map((study) => study.slug).sort(),
      ['capacity-decision', 'demand-forecasting', 'policy-decision'],
    )
    assert.ok(providentia.studies.every((study) => study.canonicalHash.startsWith('#projects/providentia/')))
    assert.ok(providentia.sections.includes('technical'))
    assert.ok(providentia.technical.stack.length > 0)

    const paradigm = model('paradigm', language)
    assert.deepEqual(paradigm.studies.map((study) => study.slug).sort(), ['no-show', 'operational-risk'])

    const aletheia = model('aletheia', language)
    assert.deepEqual(aletheia.studies.map((study) => study.canonicalHash), ['#projects/aletheia/evidence-case'])
    assert.equal(getProjectMeta('aletheia').stack.length, 0)
    assert.equal(getProjectMeta('aletheia').githubUrl, undefined)

    const soma = model('soma', language)
    assert.equal(soma.result.demo, true)
    assert.ok(soma.sections.includes('technical'), 'Soma keeps its repository line in technical details')
    assert.equal(getProjectMeta('soma').privateRepo, true)
  }
})

test('PROVIDENTIA: short detail copy, no internal codes on a first read, figures from the published data', () => {
  const codes = /B198_FINAL|PDI-\d|P7 SCORED|APTO|SCORED|\bC10\b/
  for (const language of ['es', 'en']) {
    const built = model('providentia', language)
    const copy = pickProjectCopy('providentia', language).detail
    assert.equal(built.method.length, 4, 'method is four milestones')
    assert.equal(built.limits.length, 4)
    assert.equal(built.decision.caseNumber, '05')
    const firstRead = JSON.stringify([built.work, built.what, built.method, built.result, built.decision, built.limits, built.facts])
    assert.ok(!codes.test(firstRead), `${language}: internal codes on the first read`)
    // Every simulated-capacity figure is the one the chart shows (visual/data/providentia.js).
    const results = JSON.stringify(copy.result.groups)
    for (const policy of POLICY_TRADEOFF) {
      assert.ok(results.includes(formatNumber(policy.exceedanceRate * 100, language, 2)), language + ': ' + policy.id + ' exceedance')
    }
    // Words on a first read: the old page was ~700.
    const words = (value) => JSON.stringify(value).replace(/[^\p{L}\p{N}%]+/gu, ' ').trim().split(/\s+/).length
    assert.ok(words([built.work, built.what, built.method, built.result, built.decision, built.limits, built.technical.rows]) < 480)
  }
})

test('Products without a documented limitation do not grow an empty limits section', () => {
  for (const id of ['soma', 'hogares', 'kairos']) {
    const ids = idsOf(model(id, 'es'))
    if (id !== 'soma') assert.ok(!ids.includes('limits'), id)
    assert.ok(!ids.includes('method'), id)
  }
})

test('Projects UI does not import the retired Atlas or Cards views, and detail uses details', () => {
  const index = read('components/ProjectsIndex.jsx')
  const detail = read('components/ProjectDetail.jsx')
  assert.ok(!index.includes('ProjectsAtlas'))
  assert.ok(!index.includes('ProjectsCards'))
  assert.match(detail, /<details/)
  assert.match(detail, /buildDetailModel/)
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
  assert.ok(!/target\.focus/.test(nav), 'the heading takes focus, not the section')
  assert.ok(!/location\.hash|pushState|replaceState/.test(nav))
  assert.match(detail, /<SectionNav projectId=\{project\.id\} sections=\{model\.sections\}/)
  assert.ok(!nav.includes('decision') && !nav.includes('question'), 'the nav lists only the sections it is given')
  const sectionTags = detail.match(/<section\b[^>]*>/g) || []
  assert.ok(sectionTags.length >= 2)
  for (const tag of sectionTags) assert.ok(!/tabIndex/.test(tag), 'a section is an anchor, never a focus target')
  assert.match(detail, /<h2[^>]*tabIndex=\{-1\}/)
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
