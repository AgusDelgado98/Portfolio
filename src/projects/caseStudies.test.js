import test from 'node:test'
import assert from 'node:assert/strict'

import {
  CASE_STUDIES,
  listCaseStudies,
  getCaseStudiesForProject,
  getCaseStudy,
  getCaseStudyByLegacySlug,
  hasCaseSection,
  getCaseStudyHash,
  isCasePublic,
  getPublicCaseStudiesForProject,
} from './caseStudies.js'
import { getProjectEntry, PROJECT_REGISTRY } from './registry.js'
import * as links from '../constants/links.js'
import { translations } from '../i18n/translations.js'

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

test('case studies: every case declares isPublic explicitly; the public helpers follow it', () => {
  for (const study of CASE_STUDIES) {
    assert.equal(typeof study.isPublic, 'boolean', `${study.projectId}/${study.slug}`)
    assert.equal(study.isPublic, true)
    assert.equal(isCasePublic(study), true)
  }
  assert.equal(isCasePublic({ isPublic: false }), false)
  assert.equal(isCasePublic({}), false)
  for (const project of PROJECT_REGISTRY) {
    assert.deepEqual(
      getPublicCaseStudiesForProject(project.id).map((s) => s.slug),
      getCaseStudiesForProject(project.id).filter((s) => s.isPublic === true).map((s) => s.slug),
    )
  }
})

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

test('links: the CASEWORK_*_HASH constants the case components import carry the canonical hashes (flipped in F2)', () => {
  const byLegacySlug = {
    [links.NO_SHOW_CASE_SLUG]: links.CASEWORK_NO_SHOW_HASH,
    [links.OPERATIONAL_RISK_CASE_SLUG]: links.CASEWORK_OPERATIONAL_RISK_HASH,
    [links.DEMAND_FORECASTING_CASE_SLUG]: links.CASEWORK_DEMAND_FORECASTING_HASH,
    [links.CAPACITY_DECISION_CASE_SLUG]: links.CASEWORK_CAPACITY_DECISION_HASH,
    [links.POLICY_DECISION_CASE_SLUG]: links.CASEWORK_POLICY_DECISION_HASH,
    [links.ALETHEIA_CASE_SLUG]: links.CASEWORK_ALETHEIA_HASH,
  }
  assert.equal(Object.keys(byLegacySlug).length, CASE_STUDIES.length, 'every case study has a constant')
  for (const study of CASE_STUDIES) {
    assert.equal(byLegacySlug[study.legacySlug], study.canonicalHash, study.slug)
  }
  const research = CASE_STUDIES.find((study) => study.sections.includes('research'))
  assert.equal(links.CASEWORK_ALETHEIA_RESEARCH_HASH, research.canonicalSectionHashes.research)
  assert.equal(links.ALETHEIA_PROJECT_ID, research.projectId)
  assert.equal(links.ALETHEIA_CASE_STUDY_SLUG, research.slug)
})

test('links: the legacy-hash helpers left constants/links.js — the router owns them now', () => {
  for (const name of ['CASEWORK_HASH', 'ENGINEERING_LOG_HASH', 'isEngineeringLogHash', 'parseCaseworkHash', 'PROJECT_CASE_NO_SHOW_HASH']) {
    assert.equal(name in links, false, `links.js still exports ${name}`)
  }
})

test('links: buildProjectCaseHash composes project, case and optional section', () => {
  assert.equal(links.buildProjectCaseHash('p', 'c'), '#projects/p/c')
  assert.equal(links.buildProjectCaseHash('p', 'c', 's'), '#projects/p/c/s')
})
