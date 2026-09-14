import test from 'node:test'
import assert from 'node:assert/strict'

import { translations } from '../translations.js'
import { CV_HREF } from '../config.js'

const es = translations.es
const en = translations.en

function profileStrings(dict) {
  return [
    dict.hero.experience,
    dict.contact.lead,
    dict.contact.aboutP1,
    dict.home.hero.seeking,
    dict.home.hero.opportunityLevels,
    ...dict.contact.experienceJobs.flatMap((job) => [job.role, job.org, job.meta, ...job.bullets]),
  ]
}

test('current healthcare analytics role is canonical in ES and EN', () => {
  assert.equal(es.contact.experienceJobs[0].role, 'Data Analyst | Healthcare Analytics')
  assert.match(es.contact.experienceJobs[0].meta, /Mar 2024 – Presente/)
  assert.match(en.contact.experienceJobs[0].meta, /Mar 2024 – Present/)
  assert.match(es.hero.experience, /equipo de cinco personas/)
  assert.match(en.hero.experience, /five-person team/)
})

test('administrative role ends before the data role begins', () => {
  const esAdmin = es.contact.experienceJobs.find((job) => job.org === 'Consultorio Barcala')
  const enAdmin = en.contact.experienceJobs.find((job) => job.org === 'Consultorio Barcala')

  assert.ok(esAdmin)
  assert.ok(enAdmin)
  assert.match(esAdmin.meta, /Mar 2021 – Feb 2024/)
  assert.match(enAdmin.meta, /Mar 2021 – Feb 2024/)
})

test('rendered professional copy contains no retired freelance/first-role narrative', () => {
  const retired = /first formal|primera incorporación formal|self-employed|profesional independiente|freelance/i
  for (const value of [...profileStrings(es), ...profileStrings(en)]) {
    assert.doesNotMatch(value, retired)
  }
})

test('availability is not asserted as an unsupported fixed notice period', () => {
  assert.equal(es.contact.aboutFacts.availabilityValue, 'A conversar')
  assert.equal(en.contact.aboutFacts.availabilityValue, 'To discuss')
})

test('all portfolio CV buttons resolve to the September 2026 official PDF path', () => {
  assert.equal(CV_HREF, '/cv/Agustin_Delgado_CV_EN.pdf')
})
