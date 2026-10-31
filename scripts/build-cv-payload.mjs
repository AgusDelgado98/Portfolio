// Rebuilds the CV payload served by api/cv.js from public/cv/Agustin-Delgado-2026.pdf:
// api/cv-data/chunk1…7.js (base64) and EXPECTED_GIT_BLOB_SHA in api/cv.js.
//
//   node scripts/build-cv-payload.mjs
//
// Run it after replacing the PDF, then `npm test` (src/cv.test.js checks that the
// static file, the payload and the expected SHA all agree).
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const path = (p) => fileURLToPath(new URL(p, root))

const CHUNKS = 7
const pdf = readFileSync(path('public/cv/Agustin-Delgado-2026.pdf'))
if (pdf.subarray(0, 5).toString('latin1') !== '%PDF-') throw new Error('Not a PDF')

const base64 = pdf.toString('base64')
// A multiple of 4 keeps every chunk a self-contained base64 run (the handler only concatenates them).
const size = Math.ceil(base64.length / CHUNKS / 4) * 4
for (let i = 0; i < CHUNKS; i += 1) {
  const part = base64.slice(i * size, (i + 1) * size)
  writeFileSync(path(`api/cv-data/chunk${i + 1}.js`), `export default \`${part}\`;\n`)
}

const sha = createHash('sha1')
  .update(Buffer.concat([Buffer.from(`blob ${pdf.length}\0`), pdf]))
  .digest('hex')
const handlerPath = path('api/cv.js')
const handler = readFileSync(handlerPath, 'utf8')
const next = handler.replace(/const EXPECTED_GIT_BLOB_SHA = '[0-9a-f]{40}'/, `const EXPECTED_GIT_BLOB_SHA = '${sha}'`)
if (next === handler && !handler.includes(sha)) throw new Error('EXPECTED_GIT_BLOB_SHA not found in api/cv.js')
writeFileSync(handlerPath, next)

console.log(`CV payload: ${pdf.length} bytes, ${CHUNKS} chunks of up to ${size} chars, git blob SHA ${sha}`)
