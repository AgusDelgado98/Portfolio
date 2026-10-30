import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { projectsCopy } from '../i18n/messages/projects.js'
import { translations } from '../i18n/translations.js'
import { PROJECT_REGISTRY, WORK_PROJECT_ORDER } from './registry.js'

/**
 * The three work-linked projects (PARADIGM · PROVIDENTIA · SOMA): what the
 * public copy may and may not say. Professional use is a declared fact; the
 * public demonstration is built on synthetic, public or fictitious data; and
 * nothing here is a deployment state or a workplace result.
 */

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function allStrings(value, out = []) {
  if (typeof value === 'string') out.push(value)
  else if (value && typeof value === 'object') Object.values(value).forEach((child) => allStrings(child, out))
  return out
}

function keyPaths(value, prefix = '', out = []) {
  if (Array.isArray(value)) out.push(`${prefix}[${value.length}]`)
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) keyPaths(child, `${prefix}${key}.`, out)
  else out.push(prefix.slice(0, -1))
  return out
}

test('SOMA is never labelled "production" or described as in use by professionals / in real use — registry, status labels, copy', () => {
  assert.ok(PROJECT_REGISTRY.every((project) => project.status !== 'production'))
  for (const language of ['es', 'en']) {
    assert.ok(!('Production' in translations[language].projects.status), `${language}: a "Production" status label is still defined`)
    assert.ok(translations[language].projects.status.ProfessionalUse)
  }
  const forbidden = /producci[oó]n|production\b|en uso por|used by (healthcare|health)|in use by|uso real|real use|ownership|healthops/i
  for (const language of ['es', 'en']) {
    for (const text of allStrings(projectsCopy.soma[language])) assert.ok(!forbidden.test(text), `soma.${language}: "${text}"`)
    for (const text of allStrings(translations[language].home.featured.cards.soma)) assert.ok(!forbidden.test(text), `home.soma.${language}: "${text}"`)
    for (const text of allStrings(translations[language].projects.visuals.soma)) assert.ok(!forbidden.test(text), `visuals.soma.${language}: "${text}"`)
  }
})

test('no public source file labels a project "production" any more', () => {
  const files = ['projects/registry.js', 'components/ProjectDetail.jsx', 'components/projects/ProjectCard.jsx', 'i18n/messages/ui.js']
  for (const file of files) {
    const source = fs.readFileSync(path.join(srcDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    assert.ok(!/status:\s*'production'|production:\s*'Production'|"Production":/.test(source), `${file} still carries a "production" status`)
  }
})

test('SOMA: the approved professional-use wording and the fictitious-data demonstration, in both languages', () => {
  const es = projectsCopy.soma.es
  const en = projectsCopy.soma.en
  assert.match(es.description, /Desarrollo utilizado en mi actividad profesional para organizar procesos administrativos y clínicos\. Incluye gestión de pacientes, turnos, documentación y herramientas operativas\./)
  assert.match(es.description, /La demostración pública utiliza exclusivamente datos ficticios para proteger la privacidad y confidencialidad de la información clínica/)
  assert.match(en.description, /exclusively fictitious data to protect the privacy and confidentiality of clinical information/)
  assert.match(es.detail.demo, /exclusivamente datos ficticios/)
  assert.match(en.detail.demo, /exclusively fictitious data/)
  assert.match(es.detail.demo, /no se muestra/)
  assert.match(en.detail.demo, /not shown/)
})

test('SOMA: functions yes, impact metrics and an "absence of metrics" section no', () => {
  for (const language of ['es', 'en']) {
    const detail = projectsCopy.soma[language].detail
    assert.equal(detail.result, undefined, 'SOMA has no results section')
    const blob = JSON.stringify(projectsCopy.soma[language])
    assert.ok(!/\d+\s?%/.test(blob), `${language}: a percentage appears in SOMA copy`)
    assert.ok(!/sin métricas|no metrics|no hay métricas|there are no .*metrics|no verificables/i.test(blob))
    assert.ok(detail.what.points.length >= 5)
  }
})

test('PARADIGM: "limited predictive capacity", results per case, Streamlit runs locally, no finished dashboard', () => {
  for (const language of ['es', 'en']) {
    const copy = projectsCopy.paradigm[language]
    const blob = JSON.stringify(copy)
    assert.ok(!/moderad[ao]|moderate/i.test(blob), `${language}: "moderate" signal wording is still there`)
    assert.match(blob, language === 'es' ? /capacidad predictiva es limitada|capacidad predictiva limitada/ : /predictive capacity is limited|limited predictive capacity/)
    assert.equal(copy.detail.result.groups.length, 2, 'each case keeps its own results')
    assert.match(blob, language === 'es' ? /de forma local/ : /locally/)
    assert.ok(!/12\.008 registros|12,008 records/.test(copy.description + copy.detail.what.points.join(' ')), 'raw count presented as the cleaned one')
    assert.ok(!/Aplicación Streamlit del caso|Power BI y Streamlit presentan|Power BI and Streamlit present/.test(blob))
    assert.ok(!copy.artifacts.some((item) => /dashboard/i.test(item)), 'a dashboard is listed as an artifact')
  }
})

test('every work-linked project: ES and EN detail copy have the same shape; work text is declared use, not a result', () => {
  for (const id of WORK_PROJECT_ORDER) {
    assert.deepEqual(keyPaths(projectsCopy[id].es.detail).sort(), keyPaths(projectsCopy[id].en.detail).sort(), `${id}: ES/EN detail shape differs`)
    for (const language of ['es', 'en']) {
      const detail = projectsCopy[id][language].detail
      assert.ok(detail.work.length > 40 && detail.demo.length > 40, `${id}.${language}`)
      assert.ok(!/\d/.test(detail.work), `${id}.${language}: the declared use at work carries a number`)
    }
  }
})

test('every work-linked project: results are labelled as the public case, never as workplace results', () => {
  for (const id of ['paradigm', 'providentia']) {
    for (const language of ['es', 'en']) {
      const detail = projectsCopy[id][language].detail
      assert.match(detail.titles.results, language === 'es' ? /públic/ : /public/)
      assert.match(detail.limits.join(' '), language === 'es' ? /no son resultados de mi lugar de trabajo|no son resultados de mi lugar de trabajo/ : /not results from my workplace/)
    }
  }
})

test('SOMA preview: a labelled recording with player controls — no login, no link to the app, no backend', () => {
  assert.equal(translations.es.projects.demoLabel, 'Vista previa de SOMA · Datos ficticios')
  assert.equal(translations.en.projects.demoLabel, 'SOMA preview · Fictitious data')
  assert.equal(projectsCopy.soma.es.detail.titles.demo, 'Vista previa')
  assert.equal(projectsCopy.soma.en.detail.titles.demo, 'Preview')

  const strip = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\'"`])\/\/.*$/gm, '$1')
  const player = strip(fs.readFileSync(path.join(srcDir, 'components/SomaDemoVideo.jsx'), 'utf8'))
  assert.ok(/\n\s+controls\n/.test(player) && !/controls=\{false\}/.test(player), 'the player must show its controls')
  assert.ok(/muted/.test(player) && /playsInline/.test(player) && /poster=/.test(player))
  assert.ok(!/<a\s|href=|supabase|login|password/i.test(player), 'the player carries no link, credential or backend')

  const soma = PROJECT_REGISTRY.find((project) => project.id === 'soma')
  assert.equal(soma.hasLiveDemo, false)
  assert.equal(soma.projectUrl, undefined)
  assert.equal(soma.githubUrl, undefined)
  assert.equal(soma.hasDemoVideo, true)
  const links = fs.readFileSync(path.join(srcDir, 'constants/links.js'), 'utf8')
  assert.ok(!/soma-eight-pi|supabase\.co/.test(links), 'no URL of the application or its backend is stored')
  for (const file of ['i18n/messages/projects.js', 'i18n/messages/home.js', 'i18n/messages/ui.js']) {
    assert.ok(!/soma-eight-pi|zcfakfvv|supabase\.co/.test(fs.readFileSync(path.join(srcDir, file), 'utf8')), `${file} points at the application`)
  }
})
