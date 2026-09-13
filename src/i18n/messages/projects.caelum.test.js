import test from 'node:test'
import assert from 'node:assert/strict'

import { ALL_PROJECT_IDS, FEATURED_PROJECT_IDS, getProjectMeta, getTerritoryForProject } from '../../projects/registry.js'
import { projectsCopy, pickProjectCopy } from './projects.js'
import { resolveAppRoute } from '../../router/resolveAppRoute.js'
import { CAELUM_REPO_URL } from '../../constants/links.js'

const REQUIRED_COPY_FIELDS = [
  'rank',
  'label',
  'nodeSummary',
  'tagline',
  'description',
  'problem',
  'role',
  'impact',
  'impactHighlight',
  'highlights',
  'artifacts',
  'annotation',
  'signals',
]

test('every registered project has bilingual projectsCopy with required narrative fields', () => {
  for (const id of ALL_PROJECT_IDS) {
    const entry = projectsCopy[id]
    assert.ok(entry, `missing projectsCopy entry for "${id}"`)
    for (const language of ['es', 'en']) {
      const copy = entry[language]
      assert.ok(copy, `missing ${language} copy for "${id}"`)
      for (const field of REQUIRED_COPY_FIELDS) {
        const value = copy[field]
        if (Array.isArray(value)) {
          assert.ok(value.length > 0, `"${id}".${language}.${field} must be a non-empty array`)
        } else {
          assert.ok(typeof value === 'string' && value.length > 0, `"${id}".${language}.${field} missing`)
        }
      }
    }
  }
})

test('caelum: registry metadata matches portfolio integration contract', () => {
  const meta = getProjectMeta('caelum')
  assert.ok(meta)
  assert.equal(meta.title, 'Caelum Health Analytics')
  assert.equal(meta.priority, 'primary')
  assert.equal(meta.resultsSectionKey, 'results')
  assert.equal(meta.hasLiveDemo, false)
  assert.deepEqual(meta.caseworkSlugs, [])
  assert.equal(meta.githubUrl, CAELUM_REPO_URL)
  assert.ok(FEATURED_PROJECT_IDS.includes('caelum'))
  assert.equal(getTerritoryForProject('caelum')?.id, 'data-systems')
  assert.ok(meta.stack.includes('dbt Core'))
  assert.ok(meta.stack.includes('DuckDB'))
  assert.ok(meta.stack.includes('Apache Airflow'))
  assert.ok(meta.stack.includes('Terraform'))
  assert.ok(!meta.stack.includes('Docker'))
})

test('caelum: ES/EN copy parity for flow, privacy, and key claims', () => {
  for (const language of ['es', 'en']) {
    const copy = pickProjectCopy('caelum', language)
    assert.ok(copy.privacyNote && /PROVIDENTIA/i.test(copy.privacyNote))
    assert.ok(/AWS/i.test(copy.privacyNote))
    assert.ok(/\.pbix/i.test(copy.privacyNote) || /pbix/i.test(copy.privacyNote))
    assert.ok(Array.isArray(copy.flowSteps) && copy.flowSteps.length === 7)
    assert.ok(copy.flowLead && copy.flowLead.length > 0)
    assert.ok(/103/.test(copy.impact) || copy.highlights.some((h) => /103/.test(h)))
    assert.ok(/USD 0|gasto de infraestructura|infrastructure spend/i.test(copy.privacyNote))
    assert.ok(!/Docker/i.test(JSON.stringify(copy.highlights)))
  }

  const es = pickProjectCopy('caelum', 'es')
  const en = pickProjectCopy('caelum', 'en')
  assert.equal(es.flowSteps.length, en.flowSteps.length)
  assert.equal(es.highlights.length, en.highlights.length)
  assert.equal(es.artifacts.length, en.artifacts.length)
  assert.equal(es.signals.length, en.signals.length)
  assert.match(en.nextStep, /does not claim AWS deployment/i)
  assert.match(es.nextStep, /No afirma despliegue AWS/i)
})

test('caelum: #projects/caelum resolves to project-detail', () => {
  const route = resolveAppRoute('#projects/caelum', { hasCaseworkCase: () => false })
  assert.equal(route.view, 'project-detail')
  assert.equal(route.params.projectId, 'caelum')
  assert.equal(route.canonicalHash, '#projects/caelum')
})

test('primary set includes PROVIDENTIA, Caelum, Paradigm, and Soma', () => {
  assert.deepEqual([...FEATURED_PROJECT_IDS].sort(), ['caelum', 'paradigm', 'providentia', 'soma'].sort())
})
