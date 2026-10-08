import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { CASE_STUDIES } from '../projects/caseStudies.js'
import { LAZY_CASE_KEYS, getLazyCase } from './components.js'

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const CASE_FILES = [
  'components/EngineeringLog.jsx',
  'casework/operational-risk/OperationalRisk.jsx',
  'casework/demand-forecasting/DemandForecasting.jsx',
  'casework/capacity-decision/CapacityDecision.jsx',
  'casework/policy-decision/PolicyDecision.jsx',
  'casework/aletheia/Aletheia.jsx',
]

function staticSpecifiers(source) {
  const withoutDynamic = source.replace(/import\s*\(/g, 'dynamic(')
  return [...withoutDynamic.matchAll(/import\s+(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/g)].map((match) => match[1])
}

function resolveSpecifier(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null
  const base = path.resolve(path.dirname(fromFile), specifier)
  for (const candidate of [base, `${base}.js`, `${base}.jsx`]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
  }
  return null
}

function entryReachable() {
  const seen = new Set()
  const queue = [path.join(srcDir, 'main.jsx')]
  while (queue.length) {
    const file = queue.pop()
    if (seen.has(file)) continue
    seen.add(file)
    const source = fs.readFileSync(file, 'utf8')
    for (const specifier of staticSpecifiers(source)) {
      const next = resolveSpecifier(file, specifier)
      if (next && !seen.has(next)) queue.push(next)
    }
  }
  return seen
}

test('lazy map: one React.lazy component per public case, and none for an unknown pair', () => {
  const expected = CASE_STUDIES.map((study) => `${study.projectId}/${study.slug}`).sort()
  assert.deepEqual([...LAZY_CASE_KEYS].sort(), expected)
  for (const study of CASE_STUDIES) {
    const component = getLazyCase(study.projectId, study.slug)
    assert.equal(typeof component, 'object')
    assert.equal(component.$$typeof, Symbol.for('react.lazy'))
  }
  assert.equal(getLazyCase('providentia', 'not-a-case'), null)
  assert.equal(getLazyCase('not-a-project', 'no-show'), null)
})

test('lazy map: the component module does not import case studies statically', () => {
  const source = fs.readFileSync(path.join(srcDir, 'casework/components.js'), 'utf8')
  assert.equal(staticSpecifiers(source).filter((specifier) => specifier.startsWith('.')).length, 0)
  for (const specifier of [
    '../components/EngineeringLog.jsx',
    './operational-risk/OperationalRisk.jsx',
    './demand-forecasting/DemandForecasting.jsx',
    './capacity-decision/CapacityDecision.jsx',
    './policy-decision/PolicyDecision.jsx',
    './aletheia/Aletheia.jsx',
  ]) {
    assert.ok(source.includes(`lazy(() => import('${specifier}'))`), specifier)
  }
  assert.equal((source.match(/lazy\(\(\) => import\(/g) || []).length, CASE_STUDIES.length)
})

test('entry path: Home does not statically import a case study or its copy', () => {
  const reachable = [...entryReachable()].map((file) => path.relative(srcDir, file).replace(/\\/g, '/'))
  for (const file of [
    ...CASE_FILES,
    'casework/aletheia/AletheiaResearch.jsx',
    'casework/aletheia/charts.jsx',
    'casework/aletheia/data.js',
    'casework/registry.js',
    'components/CaseworkIndex.jsx',
    'i18n/messages/elog.js',
    'i18n/messages/aletheia.js',
    'i18n/messages/operationalRisk.js',
    'i18n/messages/demandForecasting.js',
    'i18n/messages/capacityDecision.js',
    'i18n/messages/policyDecision.js',
    'data/engineeringLog/loadEvidence.js',
  ]) {
    assert.ok(!reachable.includes(file), `${file} is still in the initial graph`)
  }
})

test('CaseShell: breadcrumb, back link, and a stable Suspense fallback', () => {
  const shell = fs.readFileSync(path.join(srcDir, 'components/CaseShell.jsx'), 'utf8')
  assert.match(shell, /PROJECTS_HASH/)
  assert.match(shell, /backHref/)
  assert.match(shell, /aria-current="page"/)
  assert.match(shell, /<Suspense fallback=\{<CaseFallback/)
  const css = fs.readFileSync(path.join(srcDir, 'styles/case-shell.css'), 'utf8')
  assert.match(css, /min-height:\s*calc\(100vh - 8rem\)/)
  assert.match(css, /prefers-reduced-motion/)
  assert.equal(fs.existsSync(path.join(srcDir, 'components/CaseworkIndex.jsx')), false)
  assert.equal(fs.existsSync(path.join(srcDir, 'casework-index.css')), false)
  assert.equal(fs.existsSync(path.join(srcDir, 'casework/registry.js')), false)
})

test('public chrome does not link to the retired Casework index', () => {
  for (const file of ['components/layout/SiteHeader.jsx', 'components/Footer.jsx', 'components/CaseShell.jsx', 'App.jsx']) {
    const source = fs.readFileSync(path.join(srcDir, file), 'utf8')
    assert.ok(!/#casework/.test(source), file)
  }
})
