import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
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

test('atlas.css and destination-views.css are gone', () => {
  assert.equal(fs.existsSync(path.join(srcDir, 'atlas.css')), false)
  assert.equal(fs.existsSync(path.join(srcDir, 'destination-views.css')), false)
  const app = fs.readFileSync(path.join(srcDir, 'App.jsx'), 'utf8')
  assert.ok(!app.includes('engineering-log.css'))
  assert.ok(!app.includes('grid-bg'))
})

test('retired portfolio screens are not in the source tree', () => {
  for (const file of [
    'components/ProjectsAtlas.jsx',
    'components/Approach.jsx',
    'components/Operations.jsx',
    'components/DataBI.jsx',
    'components/CaseworkIndex.jsx',
    'components/ProjectsCards.jsx',
    'projects-view.css',
  ]) {
    assert.equal(fs.existsSync(path.join(srcDir, file)), false, file)
  }
})

test('presentation stills are webp; evidence charts stay png', () => {
  const links = fs.readFileSync(path.join(srcDir, 'constants/links.js'), 'utf8')
  assert.match(links, /representative-forecasts\.webp/)
  assert.match(links, /noshow_by_lead_bucket\.png/)
  const media = path.join(srcDir, '../public/media')
  assert.equal(fs.existsSync(path.join(media, 'kairos/01-kairos-overview.png')), false)
  assert.equal(fs.existsSync(path.join(media, 'kairos/01-kairos-overview.webp')), true)
})

test('README describes the current routes, not the retired Atlas', () => {
  const readme = fs.readFileSync(path.join(srcDir, '../README.md'), 'utf8')
  assert.match(readme, /#projects/)
  assert.match(readme, /npm test/)
  assert.match(readme, /npm run build/)
  assert.doesNotMatch(readme, /Guided Portfolio|Territories|Casework index|Otros proyectos en el Atlas/)
})

const distIndex = path.join(srcDir, '../dist/index.html')

test('home initial js stays within 110 KB gzip-9', {
  skip: fs.existsSync(distIndex) ? false : 'dist is absent; run npm run build',
}, () => {
  const dist = path.join(srcDir, '../dist')
  const html = fs.readFileSync(distIndex, 'utf8')
  const entry = html.match(/src="(\/assets\/[^"]+\.js)"/)
  assert.ok(entry, 'dist/index.html has no entry script')
  const seen = new Set()
  const visit = (href) => {
    if (seen.has(href)) return
    seen.add(href)
    const source = fs.readFileSync(path.join(dist, href.replace(/^\//, '')), 'utf8')
    for (const match of source.matchAll(/(?:import|from)"(\.\/[^"]+\.js)"/g)) {
      visit(path.posix.join(path.posix.dirname(href), match[1]))
    }
  }
  visit(entry[1])
  let total = 0
  for (const href of seen) {
    const buf = fs.readFileSync(path.join(dist, href.replace(/^\//, '')))
    total += zlib.gzipSync(buf, { level: 9 }).length
  }
  assert.ok(total <= 110000, `initial js gzip-9 is ${total} bytes`)
})

test('public chrome does not link to the retired Casework index', () => {
  for (const file of ['components/layout/SiteHeader.jsx', 'components/Footer.jsx', 'components/CaseShell.jsx', 'App.jsx']) {
    const source = fs.readFileSync(path.join(srcDir, file), 'utf8')
    assert.ok(!/#casework/.test(source), file)
  }
})
