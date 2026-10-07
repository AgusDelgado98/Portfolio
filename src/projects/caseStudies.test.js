import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  CASE_STUDIES,
  listCaseStudies,
  getCaseStudiesForProject,
  getCaseStudy,
  getCaseStudyByLegacySlug,
  hasCaseSection,
  getCaseStudyHash,
} from './caseStudies.js'
import { getProjectEntry, PROJECT_REGISTRY } from './registry.js'
import * as links from '../constants/links.js'
import { translations } from '../i18n/translations.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const caseworkDir = path.resolve(here, '..', 'casework')

// ── The canonical relationship ──────────────────────────────────────────────

test('case studies: the frozen project -> case relationship', () => {
  const byProject = {}
  for (const study of CASE_STUDIES) (byProject[study.projectId] ||= []).push(study.slug)
  assert.deepEqual(byProject, {
    paradigm: ['no-show', 'operational-risk'],
    providentia: ['demand-forecasting', 'capacity-decision', 'policy-decision'],
    aletheia: ['evidence-case'],
  })
})

test('case studies: ALETHEIA has one case with a `research` section; no other case has sections', () => {
  assert.deepEqual([...getCaseStudy('aletheia', 'evidence-case').sections], ['research'])
  for (const study of CASE_STUDIES) {
    if (study.projectId !== 'aletheia') assert.deepEqual([...study.sections], [], `${study.slug} should have no sections`)
  }
  assert.equal(hasCaseSection('aletheia', 'evidence-case', 'research'), true)
  assert.equal(hasCaseSection('aletheia', 'evidence-case', 'nope'), false)
  assert.equal(hasCaseSection('paradigm', 'no-show', 'research'), false)
})

test('case studies: every case belongs to a project that exists in the registry', () => {
  for (const study of CASE_STUDIES) {
    assert.ok(getProjectEntry(study.projectId), `case "${study.slug}" points at unknown project "${study.projectId}"`)
  }
})

test('case studies: no duplicated slug inside a project, no duplicated legacy slug anywhere', () => {
  for (const project of PROJECT_REGISTRY) {
    const slugs = getCaseStudiesForProject(project.id).map((study) => study.slug)
    assert.equal(new Set(slugs).size, slugs.length, `"${project.id}" repeats a case slug`)
  }
  const legacy = CASE_STUDIES.map((study) => study.legacySlug)
  assert.equal(new Set(legacy).size, legacy.length)
  const canonical = CASE_STUDIES.map((study) => study.canonicalHash)
  assert.equal(new Set(canonical).size, canonical.length)
})

test('case studies: slugs are url-safe and numbering is right (01–05 for Casework, none for the Evidence Case)', () => {
  for (const study of CASE_STUDIES) {
    assert.match(study.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/)
    assert.match(study.legacySlug, /^[a-z0-9]+(-[a-z0-9]+)*$/)
  }
  assert.deepEqual(
    CASE_STUDIES.filter((s) => s.classification === 'casework').map((s) => s.number),
    ['01', '02', '03', '04', '05'],
  )
  assert.equal(getCaseStudy('aletheia', 'evidence-case').number, null)
  assert.equal(getCaseStudy('aletheia', 'evidence-case').classification, 'evidenceCase')
})

// ── Everything the router needs, with no JSX ────────────────────────────────

test('case studies: canonical and legacy hashes are derived consistently', () => {
  for (const study of CASE_STUDIES) {
    assert.equal(study.canonicalHash, `#projects/${study.projectId}/${study.slug}`)
    assert.equal(study.legacyHash, `#casework/${study.legacySlug}`)
    for (const section of study.sections) {
      assert.equal(study.canonicalSectionHashes[section], `${study.canonicalHash}/${section}`)
      assert.equal(study.legacySectionHashes[section], `${study.legacyHash}/${section}`)
    }
  }
  assert.equal(getCaseStudyHash('paradigm', 'no-show'), '#projects/paradigm/no-show')
  assert.equal(getCaseStudyHash('providentia', 'demand-forecasting'), '#projects/providentia/demand-forecasting')
  assert.equal(getCaseStudyHash('aletheia', 'evidence-case', 'research'), '#projects/aletheia/evidence-case/research')
  assert.equal(getCaseStudyHash('aletheia', 'evidence-case', 'nope'), null)
  assert.equal(getCaseStudyHash('paradigm', 'does-not-exist'), null)
})

test('case studies: legacy lookup resolves today\'s #casework/<slug> slugs, ALETHEIA\'s legacy slug differs from its canonical one', () => {
  assert.equal(getCaseStudyByLegacySlug('no-show').projectId, 'paradigm')
  assert.equal(getCaseStudyByLegacySlug('policy-decision').projectId, 'providentia')
  assert.deepEqual(
    [getCaseStudyByLegacySlug('aletheia').projectId, getCaseStudyByLegacySlug('aletheia').slug],
    ['aletheia', 'evidence-case'],
  )
  assert.equal(getCaseStudyByLegacySlug('nope'), null)
})

test('case studies: the #engineering-log alias is carried by the no-show case', () => {
  assert.deepEqual([...getCaseStudy('paradigm', 'no-show').legacyPrefixes], ['#engineering-log'])
  const others = CASE_STUDIES.filter((s) => !(s.projectId === 'paradigm' && s.slug === 'no-show'))
  for (const study of others) assert.deepEqual([...study.legacyPrefixes], [])
})

test('case studies: every i18nKey has bilingual casework copy with a title', () => {
  for (const language of ['es', 'en']) {
    for (const study of CASE_STUDIES) {
      const copy = translations[language].casework.cases[study.i18nKey]
      assert.ok(copy && copy.title, `${language}: casework.cases.${study.i18nKey} has no title`)
    }
  }
})

test('case studies: the data is plain — frozen and free of functions/components', () => {
  assert.ok(Object.isFrozen(CASE_STUDIES))
  for (const study of listCaseStudies()) {
    assert.ok(Object.isFrozen(study))
    for (const value of Object.values(study)) assert.notEqual(typeof value, 'function')
  }
})

// ── links.js ────────────────────────────────────────────────────────────────

test('links: the canonical PROJECT_CASE_* constants equal the derived canonical hashes', () => {
  assert.equal(links.PROJECT_CASE_NO_SHOW_HASH, getCaseStudyHash('paradigm', 'no-show'))
  assert.equal(links.PROJECT_CASE_OPERATIONAL_RISK_HASH, getCaseStudyHash('paradigm', 'operational-risk'))
  assert.equal(links.PROJECT_CASE_DEMAND_FORECASTING_HASH, getCaseStudyHash('providentia', 'demand-forecasting'))
  assert.equal(links.PROJECT_CASE_CAPACITY_DECISION_HASH, getCaseStudyHash('providentia', 'capacity-decision'))
  assert.equal(links.PROJECT_CASE_POLICY_DECISION_HASH, getCaseStudyHash('providentia', 'policy-decision'))
  assert.equal(links.PROJECT_CASE_ALETHEIA_HASH, getCaseStudyHash('aletheia', 'evidence-case'))
  assert.equal(links.PROJECT_CASE_ALETHEIA_RESEARCH_HASH, getCaseStudyHash('aletheia', 'evidence-case', 'research'))
})

test('links: the live CASEWORK_* constants are still the legacy routes (F1 must not flip them — F2 does, with the router)', () => {
  assert.equal(links.CASEWORK_HASH, '#casework')
  assert.equal(links.CASEWORK_NO_SHOW_HASH, getCaseStudy('paradigm', 'no-show').legacyHash)
  assert.equal(links.CASEWORK_OPERATIONAL_RISK_HASH, getCaseStudy('paradigm', 'operational-risk').legacyHash)
  assert.equal(links.CASEWORK_DEMAND_FORECASTING_HASH, getCaseStudy('providentia', 'demand-forecasting').legacyHash)
  assert.equal(links.CASEWORK_CAPACITY_DECISION_HASH, getCaseStudy('providentia', 'capacity-decision').legacyHash)
  assert.equal(links.CASEWORK_POLICY_DECISION_HASH, getCaseStudy('providentia', 'policy-decision').legacyHash)
  assert.equal(links.CASEWORK_ALETHEIA_HASH, getCaseStudy('aletheia', 'evidence-case').legacyHash)
  assert.equal(links.CASEWORK_ALETHEIA_RESEARCH_HASH, getCaseStudy('aletheia', 'evidence-case').legacySectionHashes.research)
  assert.equal(links.ENGINEERING_LOG_HASH, '#engineering-log')
})

test('links: buildProjectCaseHash composes project, case and optional section', () => {
  assert.equal(links.buildProjectCaseHash('p', 'c'), '#projects/p/c')
  assert.equal(links.buildProjectCaseHash('p', 'c', 's'), '#projects/p/c/s')
})

// ── casework/registry.js (JSX — verified from source, it cannot be imported here) ──

const registrySource = fs.readFileSync(path.join(caseworkDir, 'registry.js'), 'utf8')

function parseCaseworkRegistry(source) {
  // Each entry: `[KEY_SLUG_CONSTANT]: { slug: ..., component: X, projectId: '...', caseSlug: '...', ...`
  const entries = []
  const pattern = /\[(\w+)\]:\s*\{[^]*?component:\s*(\w+),\s*projectId:\s*'([\w-]+)',\s*caseSlug:\s*'([\w-]+)'/g
  let match
  while ((match = pattern.exec(source)) !== null) {
    entries.push({ keyConstant: match[1], component: match[2], projectId: match[3], caseSlug: match[4] })
  }
  return entries
}

const registryEntries = parseCaseworkRegistry(registrySource)

test('casework registry: exactly one entry per case study, each naming the right projectId and caseSlug', () => {
  assert.equal(registryEntries.length, CASE_STUDIES.length, 'a case study has no casework/registry.js entry (or vice versa)')
  const found = registryEntries.map((e) => `${e.projectId}/${e.caseSlug}`).sort()
  const expected = CASE_STUDIES.map((s) => `${s.projectId}/${s.slug}`).sort()
  assert.deepEqual(found, expected)
})

test('casework registry: each entry\'s legacy key slug is the case study\'s legacySlug', () => {
  for (const entry of registryEntries) {
    const legacySlug = links[entry.keyConstant]
    assert.equal(typeof legacySlug, 'string', `${entry.keyConstant} is not a links.js constant`)
    const study = getCaseStudy(entry.projectId, entry.caseSlug)
    assert.ok(study, `${entry.projectId}/${entry.caseSlug} is not a case study`)
    assert.equal(legacySlug, study.legacySlug, `${entry.keyConstant} does not match legacySlug of ${study.slug}`)
  }
})

test('casework registry: every case study points at an existing component file', () => {
  const imports = new Map()
  for (const match of registrySource.matchAll(/import\s+(\w+)\s+from\s+'([^']+)'/g)) imports.set(match[1], match[2])
  for (const entry of registryEntries) {
    const specifier = imports.get(entry.component)
    assert.ok(specifier, `component "${entry.component}" is not imported in casework/registry.js`)
    const file = path.resolve(caseworkDir, specifier)
    assert.ok(fs.existsSync(file), `component file for ${entry.projectId}/${entry.caseSlug} does not exist: ${specifier}`)
    assert.match(fs.readFileSync(file, 'utf8'), /export default/, `${specifier} has no default export`)
  }
})
