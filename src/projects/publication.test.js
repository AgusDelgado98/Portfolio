import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  PROJECT_REGISTRY,
  PROJECT_ORDER,
  PROJECT_PUBLICATIONS,
  PROJECT_STAGES,
  JOURNEY_STEPS,
  JOURNEY_STATUSES,
  SPOTLIGHT_PROJECT_IDS,
  COMPLEMENTARY_PROJECT_IDS,
  ALL_PROJECT_IDS,
  getProjectEntry,
  getProjectMeta,
  getRegisteredProjects,
  getWithheldProjects,
  getVisibleProjects,
  getSpotlightProjectIds,
  getComplementaryProjectIds,
  getOtherProjectIds,
  getHomeWorkIds,
  getHomePersonalIds,
  getProjectsByGroup,
  getProjectsForStage,
  getPipelineAnchor,
  getJourney,
  hasProject,
  isPublished,
} from './registry.js'
import { countProjectsByCategory } from './categories.js'
import { resolveAppRoute } from '../router/resolveAppRoute.js'
import { LEGACY_EXACT_ALIASES, LEGACY_PREFIX_ALIASES, LEGACY_FAMILY_BASES } from '../router/legacyHashRoadmap.js'
import { translations } from '../i18n/translations.js'

/**
 * Publication contract (F2). A project can be REGISTERED without being PUBLISHED.
 * DECERNO is registered and withheld: its public content needs an independent
 * authorization (disclosure audit, evidence-log EG6). These tests are the lock on
 * that door — publishing DECERNO means changing `publication` AND editing this
 * file on purpose, after the audit. Do not "fix" a failure here by relaxing it.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(here, '..')
const rootDir = path.resolve(srcDir, '..')

const EXPECTED_ORDER = ['providentia', 'decerno', 'caelum', 'aletheia', 'paradigm', 'soma', 'tekmerion', 'lumenvox', 'clarusflow', 'hogares', 'kairos']
const PUBLISHED = ['providentia', 'caelum', 'aletheia', 'paradigm', 'soma', 'tekmerion', 'lumenvox', 'clarusflow']

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1')
}

// ── The publication field ─────────────────────────────────────────────────

test('publication: every project declares a valid publication, and `hidden` is derived from it', () => {
  assert.deepEqual([...PROJECT_PUBLICATIONS], ['published', 'withheld'])
  for (const project of PROJECT_REGISTRY) {
    assert.ok(PROJECT_PUBLICATIONS.includes(project.publication), `"${project.id}" publication`)
    assert.equal(project.hidden, project.publication !== 'published', `"${project.id}" hidden must follow publication`)
  }
})

test('publication: only DECERNO, Hogares and Kairós are withheld; the eight others are published', () => {
  assert.deepEqual(getWithheldProjects().map((project) => project.id).sort(), ['decerno', 'hogares', 'kairos'])
  assert.deepEqual(getVisibleProjects().map((project) => project.id).sort(), [...PUBLISHED].sort())
  assert.equal(getRegisteredProjects().length, 11)
  for (const id of PUBLISHED) assert.equal(isPublished(id), true, id)
  for (const id of ['decerno', 'hogares', 'kairos']) assert.equal(isPublished(id), false, id)
})

test('ids: the registered ids and their order are frozen (existing ids never change)', () => {
  assert.deepEqual([...PROJECT_ORDER], EXPECTED_ORDER)
  assert.deepEqual(PROJECT_REGISTRY.map((project) => project.id), EXPECTED_ORDER)
  assert.deepEqual(ALL_PROJECT_IDS.slice(), ['providentia', 'caelum', 'aletheia', 'paradigm', 'soma', 'tekmerion', 'lumenvox', 'clarusflow'])
})

// ── DECERNO: registered, withheld, structure only ─────────────────────────

test('DECERNO: the entry is structure only — no stack, links, media, results, stages or case studies', () => {
  const entry = getProjectEntry('decerno')
  assert.equal(entry.publication, 'withheld')
  assert.equal(entry.hidden, true)
  assert.equal(entry.title, 'DECERNO')
  const allowed = [
    'id', 'title', 'categories', 'tags', 'tier', 'status', 'group', 'usage', 'dataProvenance', 'publication', 'hidden',
    'stages', 'journey', 'visual', 'accent', 'resultsSectionKey', 'stack', 'hasLiveDemo', 'caseStudies',
  ]
  assert.deepEqual(Object.keys(entry).sort(), allowed.sort(), 'a new field on DECERNO must be reviewed against the disclosure audit')
  assert.deepEqual([...entry.stack], [])
  assert.deepEqual([...entry.stages], [], 'no stage is claimed')
  assert.deepEqual([...entry.caseStudies], [])
  assert.deepEqual([...entry.tags], [])
  assert.equal(entry.usage, null)
  assert.equal(entry.dataProvenance, null, 'no data provenance is claimed before the audit')
  assert.equal(entry.hasLiveDemo, false)
  assert.equal(entry.visual, 'procedural', 'no figure is attached yet')
})

test('DECERNO: every step of its journey is designed, none demonstrated', () => {
  const journey = getProjectEntry('decerno').journey
  assert.deepEqual(Object.keys(journey).sort(), [...JOURNEY_STEPS].sort())
  for (const [step, value] of Object.entries(journey)) {
    assert.equal(value.status, 'designed', `${step} must stay designed until public evidence is audited`)
    assert.ok(!('source' in value), `${step} cites no source`)
  }
})

test('DECERNO: absent from every public accessor, list, count and anchor', () => {
  assert.equal(hasProject('decerno'), false)
  assert.equal(isPublished('decerno'), false)
  assert.equal(getProjectMeta('decerno'), null)
  assert.equal(getJourney('decerno'), null)
  const everyList = [
    ALL_PROJECT_IDS,
    getVisibleProjects().map((project) => project.id),
    getHomeWorkIds(),
    getHomePersonalIds(),
    getSpotlightProjectIds(),
    getComplementaryProjectIds(),
    getOtherProjectIds(),
    getProjectsByGroup('work').map((project) => project.id),
    getProjectsByGroup('personal').map((project) => project.id),
    ...PROJECT_STAGES.map((stage) => getProjectsForStage(stage).map((project) => project.id)),
  ]
  for (const list of everyList) assert.ok(!list.includes('decerno'), `found in ${JSON.stringify(list)}`)
  for (const stage of PROJECT_STAGES) assert.notEqual(getPipelineAnchor(stage), 'decerno', stage)
  assert.equal(countProjectsByCategory(getVisibleProjects())['ds-ml'], 3, 'DECERNO does not count in the DS / ML filter')
})

test('DECERNO: no public route reaches it (detail, case, sections, aliases)', () => {
  for (const hash of ['#projects/decerno', '#projects/decerno/overview', '#projects/decerno/gate-0', '#decerno', '#casework/decerno', '#projects/decerno/case-01']) {
    const route = resolveAppRoute(hash)
    assert.ok(!['project-detail', 'project-case'].includes(route.view), `${hash} resolved to ${route.view}`)
    assert.notEqual(route.params?.projectId, 'decerno', hash)
    assert.ok(['#projects', '#home'].includes(route.canonicalHash), `${hash} -> ${route.canonicalHash}`)
  }
  const aliases = JSON.stringify([...LEGACY_EXACT_ALIASES.entries?.() ?? [], LEGACY_PREFIX_ALIASES, LEGACY_FAMILY_BASES])
  assert.ok(!/decerno/i.test(aliases), 'no legacy alias points at DECERNO')
})

test('DECERNO: no copy in any shipped message (ES or EN), so nothing about it can be rendered', () => {
  assert.ok(!/decerno/i.test(JSON.stringify(translations)))
})

test('DECERNO: not in the static public surface (HTML, robots, sitemap, CV notes, public assets)', () => {
  const textFiles = walk(path.join(rootDir, 'public')).filter((file) => /\.(txt|xml|json|md|html|svg|webmanifest|csv)$/i.test(file))
  textFiles.push(path.join(rootDir, 'index.html'))
  for (const file of textFiles) {
    assert.ok(!/decerno/i.test(fs.readFileSync(file, 'utf8')), `${path.relative(rootDir, file)} mentions DECERNO`)
  }
})

test('DECERNO: the only source file that names it is projects/registry.js', () => {
  const named = walk(srcDir)
    .filter((file) => /\.(js|jsx|css)$/.test(file) && !/\.test\.js$/.test(file))
    .filter((file) => /decerno/i.test(stripComments(fs.readFileSync(file, 'utf8'))))
    .map((file) => path.relative(srcDir, file).split(path.sep).join('/'))
  assert.deepEqual(named, ['projects/registry.js'])
})

// ── Journey (Explore · Model · Evaluate · Decide) ─────────────────────────

test('journey: valid steps and statuses; a demonstrated step cites a repository source that exists', () => {
  assert.deepEqual([...JOURNEY_STEPS], ['explore', 'model', 'evaluate', 'decide'])
  assert.deepEqual([...JOURNEY_STATUSES], ['demonstrated', 'designed'])
  for (const project of PROJECT_REGISTRY.filter((item) => item.journey)) {
    for (const [step, value] of Object.entries(project.journey)) {
      assert.ok(JOURNEY_STEPS.includes(step), `${project.id}.${step}`)
      assert.ok(JOURNEY_STATUSES.includes(value.status), `${project.id}.${step} status`)
      if (value.status === 'demonstrated') {
        assert.ok(value.source, `${project.id}.${step} must cite a source`)
        assert.ok(fs.existsSync(path.join(rootDir, value.source)), `${project.id}.${step}: ${value.source} does not exist`)
      }
    }
  }
})

// The ES/EN names and lines of the four steps arrive with their first consumer, the redesigned Home (F4),
// together with their parity test: copy with no consumer would only add bytes to the initial JavaScript.

test('journey: only the three main projects have one, and it is read through published projects only', () => {
  assert.deepEqual(PROJECT_REGISTRY.filter((project) => project.journey).map((project) => project.id).sort(), ['decerno', 'paradigm', 'providentia'])
  assert.deepEqual(Object.keys(getJourney('providentia')).sort(), ['decide', 'evaluate', 'model'])
  assert.deepEqual(Object.keys(getJourney('paradigm')).sort(), ['evaluate', 'explore', 'model'])
  assert.equal(getJourney('soma'), null)
  assert.equal(getJourney('nope'), null)
})

test('journey: PROVIDENTIA\'s decide step is a policy SIMULATION, never a real capacity decision', () => {
  assert.equal(getJourney('providentia').decide.scope, 'simulation')
})

// ── Presentation lists of the redesigned portfolio ────────────────────────

test('presentation: spotlight order is DECERNO, PROVIDENTIA, PARADIGM; today only the published ones show', () => {
  assert.deepEqual([...SPOTLIGHT_PROJECT_IDS], ['decerno', 'providentia', 'paradigm'])
  assert.deepEqual([...COMPLEMENTARY_PROJECT_IDS], ['soma'])
  assert.deepEqual(getSpotlightProjectIds(), ['providentia', 'paradigm'])
  assert.deepEqual(getComplementaryProjectIds(), ['soma'])
})

test('presentation: the other projects are the rest of the published ones, in catalog order — none lost, none repeated', () => {
  assert.deepEqual(getOtherProjectIds(), ['caelum', 'aletheia', 'tekmerion', 'lumenvox', 'clarusflow'])
  const all = [...getSpotlightProjectIds(), ...getComplementaryProjectIds(), ...getOtherProjectIds()]
  assert.equal(new Set(all).size, all.length)
  assert.deepEqual([...all].sort(), [...PUBLISHED].sort())
})

// ── The UI never reads the unpublished side ───────────────────────────────

test('production code never touches the registered-but-unpublished side of the registry', () => {
  const internal = /\b(PROJECT_REGISTRY|getRegisteredProjects|getWithheldProjects)\b/
  const offenders = walk(srcDir)
    .filter((file) => /\.(js|jsx)$/.test(file) && !/\.test\.js$/.test(file))
    .filter((file) => path.relative(srcDir, file).split(path.sep).join('/') !== 'projects/registry.js')
    .filter((file) => internal.test(stripComments(fs.readFileSync(file, 'utf8'))))
    .map((file) => path.relative(srcDir, file))
  assert.deepEqual(offenders, [], 'the UI must go through hasProject / getProjectMeta / getVisibleProjects / the spotlight lists')
})
