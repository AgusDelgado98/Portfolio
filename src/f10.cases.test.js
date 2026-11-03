import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { LAZY_CASE_KEYS, getLazyCase } from './casework/components.js'
import { listCaseStudies } from './projects/caseStudies.js'

/**
 * F10 — public cases under the new shell. Compatibility only: no deep redesign,
 * no content edits, DECERNO stays out.
 */

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const read = (rel) => fs.readFileSync(path.join(root, 'src', rel), 'utf8')

test('F10: exactly six public cases are wired under CaseShell lazy map', () => {
  assert.equal(LAZY_CASE_KEYS.length, 6)
  const publicStudies = listCaseStudies().filter((s) => s.isPublic !== false)
  assert.equal(publicStudies.length, 6)
  for (const study of publicStudies) {
    assert.ok(getLazyCase(study.projectId, study.slug), `${study.projectId}/${study.slug}`)
  }
  assert.ok(!LAZY_CASE_KEYS.some((k) => /decerno/i.test(k)))
})

test('F10 CaseShell: editorial chrome + paper stage tokens, no bordered card chrome', () => {
  const shell = read('components/CaseShell.jsx')
  const css = read('styles/case-shell.css')
  assert.match(shell, /ds-case-chrome/)
  assert.match(shell, /ds-case-stage/)
  assert.match(shell, /Suspense/)
  assert.match(css, /--bg-0:\s*var\(--ds-paper\)/)
  assert.match(css, /background:\s*var\(--ds-paper\)/)
  assert.match(css, /--text:\s*var\(--ds-paper-text\)/)
  assert.match(css, /\.ds-case-chrome\s*\{[^}]*border:\s*0/s)
  assert.ok(!/border:\s*1px solid var\(--ds-border\)/.test(css.match(/\.ds-case-chrome\s*\{[^}]+\}/)?.[0] || ''))
  assert.ok(!/decerno/i.test(shell + css))
})

test('F10: case interiors are not rewritten — DemandForecasting still owns its evidence tables', () => {
  const demand = read('casework/demand-forecasting/DemandForecasting.jsx')
  assert.match(demand, /elog-table-wrap/)
  assert.match(demand, /elog-table/)
  const css = read('styles/case-shell.css')
  assert.match(css, /\.elog-table-wrap/)
  assert.ok(!/ForecastFan|QualityMosaic|ContourMap/.test(demand))
})
