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
import { projectsCopy } from '../i18n/messages/projects.js'

/**
 * Publication contract (F2). A project can be REGISTERED without being PUBLISHED.
 * Caelum is registered and withheld (files and copy stay). DECERNO is published
 * in the personal lab with a minimal verified card.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(here, '..')
const rootDir = path.resolve(srcDir, '..')

const EXPECTED_ORDER = ['constantia', 'soma', 'hogares', 'providentia', 'decerno', 'paradigm', 'aletheia', 'clarusflow', 'lumenvox', 'caelum']
const PUBLISHED = ['constantia', 'soma', 'hogares', 'providentia', 'decerno', 'paradigm', 'aletheia', 'clarusflow', 'lumenvox']

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

test('publication: only Caelum is withheld; the nine others are published', () => {
  assert.deepEqual(getWithheldProjects().map((project) => project.id).sort(), ['caelum'])
  assert.deepEqual(getVisibleProjects().map((project) => project.id).sort(), [...PUBLISHED].sort())
  assert.equal(getRegisteredProjects().length, 10)
  for (const id of PUBLISHED) assert.equal(isPublished(id), true, id)
  for (const id of ['caelum']) assert.equal(isPublished(id), false, id)
})

test('ids: the registered ids and their order are frozen (existing ids never change)', () => {
  assert.deepEqual([...PROJECT_ORDER], EXPECTED_ORDER)
  assert.deepEqual(PROJECT_REGISTRY.map((project) => project.id), EXPECTED_ORDER)
  assert.deepEqual(ALL_PROJECT_IDS.slice(), PUBLISHED)
})

// ── DECERNO: published in the personal lab, minimal verified card ──────────

test('DECERNO: published in the personal lab — Python stack, private repo, no public links or media', () => {
  const entry = getProjectEntry('decerno')
  assert.equal(entry.publication, 'published')
  assert.equal(entry.hidden, false)
  assert.equal(entry.title, 'DECERNO')
  assert.equal(entry.group, 'personal')
  assert.deepEqual([...entry.stack], ['Python'])
  assert.deepEqual([...entry.stages], [], 'no stage is claimed')
  assert.deepEqual([...entry.caseStudies], [])
  assert.equal(entry.usage, null)
  assert.equal(entry.dataProvenance, null)
  assert.equal(entry.hasLiveDemo, false)
  assert.equal(entry.privateRepo, true)
  assert.equal(entry.githubUrl, undefined)
  assert.equal(entry.projectUrl, undefined)
  assert.equal(entry.visual, 'procedural')
})

test('DECERNO: every step of its journey is designed, none demonstrated', () => {
  const journey = getProjectEntry('decerno').journey
  assert.deepEqual(Object.keys(journey).sort(), [...JOURNEY_STEPS].sort())
  for (const [step, value] of Object.entries(journey)) {
    assert.equal(value.status, 'designed', `${step} must stay designed until public evidence is audited`)
    assert.ok(!('source' in value), `${step} cites no source`)
  }
})

test('DECERNO: visible in the personal lab and in Otros proyectos, not on Home or as a pipeline anchor', () => {
  assert.equal(hasProject('decerno'), true)
  assert.equal(isPublished('decerno'), true)
  assert.equal(getProjectMeta('decerno')?.title, 'DECERNO')
  assert.ok(getOtherProjectIds().includes('decerno'))
  assert.ok(getProjectsByGroup('personal').some((project) => project.id === 'decerno'))
  assert.ok(!getHomeWorkIds().includes('decerno'))
  assert.ok(!getHomePersonalIds().includes('decerno'))
  assert.ok(!getSpotlightProjectIds().includes('decerno'))
  assert.ok(!getComplementaryProjectIds().includes('decerno'))
  for (const stage of PROJECT_STAGES) {
    assert.ok(!getProjectsForStage(stage).some((project) => project.id === 'decerno'), stage)
    assert.notEqual(getPipelineAnchor(stage), 'decerno', stage)
  }
  assert.equal(countProjectsByCategory(getVisibleProjects())['ds-ml'], 4)
})

test('DECERNO: the detail route is public; there is no case or legacy alias', () => {
  const detail = resolveAppRoute('#projects/decerno')
  assert.equal(detail.view, 'project-detail')
  assert.equal(detail.params?.projectId, 'decerno')
  for (const hash of ['#projects/decerno/overview', '#projects/decerno/gate-0', '#decerno', '#casework/decerno', '#projects/decerno/case-01']) {
    const route = resolveAppRoute(hash)
    assert.notEqual(route.view, 'project-case', hash)
  }
  const aliases = JSON.stringify([...LEGACY_EXACT_ALIASES.entries?.() ?? [], LEGACY_PREFIX_ALIASES, LEGACY_FAMILY_BASES])
  assert.ok(!/decerno/i.test(aliases), 'no legacy alias points at DECERNO')
})

test('DECERNO: bilingual project copy is shipped; it is not on the Home selected list', () => {
  for (const language of ['es', 'en']) {
    const copy = projectsCopy.decerno[language]
    assert.ok(copy && copy.description && copy.nodeSummary, `${language}: project copy missing`)
    assert.ok(!('decerno' in (translations[language].home?.selected?.projects || {})), `${language}: Home selected lists DECERNO`)
  }
})

test('DECERNO: not in the static public surface (HTML, robots, sitemap, CV notes, public assets)', () => {
  const textFiles = walk(path.join(rootDir, 'public')).filter((file) => /\.(txt|xml|json|md|html|svg|webmanifest|csv)$/i.test(file))
  textFiles.push(path.join(rootDir, 'index.html'))
  for (const file of textFiles) {
    assert.ok(!/decerno/i.test(fs.readFileSync(file, 'utf8')), `${path.relative(rootDir, file)} mentions DECERNO`)
  }
})

test('DECERNO: public source files that name it are the registry and its project copy', () => {
  const named = walk(srcDir)
    .filter((file) => /\.(js|jsx|css)$/.test(file) && !/\.test\.js$/.test(file))
    .filter((file) => /decerno/i.test(stripComments(fs.readFileSync(file, 'utf8'))))
    .map((file) => path.relative(srcDir, file).split(path.sep).join('/'))
  assert.deepEqual(named.sort(), ['i18n/messages/projects.js', 'projects/registry.js'].sort())
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

test('presentation: spotlight is PROVIDENTIA · PARADIGM; in-use is CONSTANTIA · SOMA · HOGARES', () => {
  assert.deepEqual([...SPOTLIGHT_PROJECT_IDS], ['providentia', 'paradigm'])
  assert.deepEqual([...COMPLEMENTARY_PROJECT_IDS], ['constantia', 'soma', 'hogares'])
  assert.deepEqual(getSpotlightProjectIds(), ['providentia', 'paradigm'])
  assert.deepEqual(getComplementaryProjectIds(), ['constantia', 'soma', 'hogares'])
})

test('presentation: the other projects are the rest of the published ones, in catalog order — none lost, none repeated', () => {
  assert.deepEqual(getOtherProjectIds(), ['decerno', 'aletheia', 'clarusflow', 'lumenvox'])
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
