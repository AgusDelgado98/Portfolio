import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { translations } from './i18n/translations.js'

/**
 * F9 — editorial positioning, SEO and Contact target roles (EG8).
 * "Data Scientist" must not appear as a held job title; junior/trainee are
 * target roles on Contact only.
 */

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const es = translations.es
const en = translations.en

test('F9 SEO: titles and descriptions follow the approved positioning and stay under ~60 for titles', () => {
  assert.match(es.meta.title, /Data Science/)
  assert.match(es.meta.title, /Analítica Aplicada|ML/)
  assert.match(en.meta.title, /Data Science/)
  assert.match(en.meta.title, /Applied Analytics/)
  assert.ok(es.meta.title.length <= 60, `ES title ${es.meta.title.length}`)
  assert.ok(en.meta.title.length <= 60, `EN title ${en.meta.title.length}`)
  assert.match(es.meta.description, /ciencia de datos|machine learning/i)
  assert.match(en.meta.description, /data science|machine learning/i)
  assert.ok(!/Data Analyst enfocado|focused on Business Intelligence/i.test(es.meta.description + en.meta.description))
  assert.equal(es.meta.title, es.meta.ogTitle)
  assert.equal(en.meta.title, en.meta.ogTitle)
})

test('F9 index.html first-paint meta matches Spanish SEO copy', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
  assert.match(html, /<title>Agustín Delgado \| Data Science, ML y Analítica Aplicada<\/title>/)
  assert.match(html, /og:title" content="Agustín Delgado \| Data Science, ML y Analítica Aplicada"/)
  assert.match(html, /Analítica aplicada · Evidencia y decisiones/)
  assert.ok(!/og:title" content="Agustín Delgado \| Data Analyst"/i.test(html))
  assert.match(html, /rel="canonical" href="https:\/\/portfolio-me-f104\.vercel\.app\/"/)
  assert.ok(!html.includes('decerno'))
})

test('F9 Contact: target roles include DS/ML junior paths and keep Data Analyst / BI', () => {
  assert.deepEqual(Object.keys(es.contact.roles), Object.keys(en.contact.roles))
  assert.equal(es.contact.roles.length, 4)
  assert.equal(en.contact.roles.length, 4)
  const esBlob = es.contact.roles.join(' · ')
  const enBlob = en.contact.roles.join(' · ')
  assert.match(esBlob, /Data Science Junior|Trainee/i)
  assert.match(esBlob, /Machine Learning Junior/i)
  assert.match(esBlob, /Data Analyst/)
  assert.match(esBlob, /BI Analyst/)
  assert.match(enBlob, /Junior Data Science|Trainee/i)
  assert.match(enBlob, /Junior Machine Learning/i)
  assert.match(enBlob, /Data Analyst/)
  assert.match(enBlob, /BI Analyst/)
  assert.match(es.contact.pageLede, /dedicación parcial/)
  assert.match(en.contact.pageLede, /partial dedication/)
  assert.ok(!/Data Scientist/i.test(esBlob + enBlob + es.contact.pageLede + en.contact.pageLede))
})

test('F9 Footer and brand line carry the new positioning', () => {
  assert.match(es.footer.tagline, /Data Science · Machine Learning · Analítica aplicada/)
  assert.match(en.footer.tagline, /Data Science · Machine Learning · Applied Analytics/)
  assert.ok(!/^Data Analyst · SQL/i.test(es.footer.tagline))
  assert.ok(!/^Data Analyst · SQL/i.test(en.footer.tagline))
})

test('F9 ContactView renders lede and roles without inventing channels', () => {
  const contact = fs.readFileSync(path.join(root, 'src/components/ContactView.jsx'), 'utf8')
  assert.match(contact, /contact\.pageLede/)
  assert.match(contact, /contact\.roles/)
  assert.match(contact, /LINKEDIN_URL/)
  assert.match(contact, /GITHUB_PROFILE_URL/)
  assert.match(contact, /CV_HREF/)
  assert.ok(!/<form/i.test(contact))
  assert.ok(!/decerno/i.test(contact))
})

test('F9 EG8: experience copy still names the held role as Data Analyst, never Data Scientist', () => {
  assert.equal(es.contact.experienceJobs[0].role, 'Data Analyst | Healthcare Analytics')
  assert.equal(en.contact.experienceJobs[0].role, 'Data Analyst | Healthcare Analytics')
  for (const blob of [JSON.stringify(es.contact.experienceJobs), JSON.stringify(en.contact.experienceJobs)]) {
    assert.ok(!/Data Scientist/i.test(blob))
  }
})
