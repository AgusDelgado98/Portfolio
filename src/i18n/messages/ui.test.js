import test from 'node:test'
import assert from 'node:assert/strict'

import { uiEs, uiEn } from './ui.js'
import { homeEs, homeEn } from './home.js'

const es = uiEs
const en = uiEn

function leaves(node, prefix, out) {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) leaves(value, prefix ? `${prefix}.${key}` : key, out)
    return
  }
  out.push(prefix)
}

test('ui copy: Spanish and English have the same key paths', () => {
  const esKeys = []
  const enKeys = []
  leaves(es, '', esKeys)
  leaves(en, '', enKeys)
  assert.deepEqual(esKeys.sort(), enKeys.sort())
})

test('retired namespaces are gone from the UI dictionary', () => {
  for (const dict of [es, en]) {
    for (const key of ['plates', 'approach', 'dataBi', 'operations']) {
      assert.equal(dict[key], undefined, key)
    }
    assert.equal(dict.nav.available, undefined)
    assert.equal(dict.nav.dataBi, undefined)
    assert.equal(dict.contact.lead, undefined)
    assert.equal(dict.contact.aboutP1, undefined)
    assert.equal(dict.contact.tags, undefined)
    assert.equal(dict.footer.engineeringLog, undefined)
  }
})

test('availability stays on the public contact line and never says immediate', () => {
  assert.equal(homeEs.contact.availability, 'Disponibilidad estimada: A conversar')
  assert.equal(homeEn.contact.availability, 'Estimated availability: To discuss')
  assert.ok(!/immediate/i.test(homeEn.contact.availability))
  assert.ok(!/inmediat/i.test(homeEs.contact.availability))
  assert.ok(!/híbrido|hybrid/i.test(`${homeEs.contact.availability} ${homeEn.contact.availability}`))
})
