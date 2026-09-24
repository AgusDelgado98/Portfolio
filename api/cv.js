import { createHash } from 'node:crypto'
import c1 from './cv-data/chunk1.js'
import c2 from './cv-data/chunk2.js'
import c3 from './cv-data/chunk3.js'
import c4 from './cv-data/chunk4.js'
import c5 from './cv-data/chunk5.js'
import c6 from './cv-data/chunk6.js'
import c7 from './cv-data/chunk7.js'

const EXPECTED_GIT_BLOB_SHA = '3b570b11062092977cc7b2eda2fa2fdf5900a8c8'
const DOWNLOAD_FILENAME = "Agustín Delgado 2026.pdf"

export default function handler(req, res) {
  const base64 = c1 + c2 + c3 + c4 + c5 + c6 + c7
  const pdf = Buffer.from(base64, 'base64')
  const gitHeader = Buffer.from(`blob ${pdf.length}\0`)
  const gitSha = createHash('sha1')
    .update(Buffer.concat([gitHeader, pdf]))
    .digest('hex')

  if (gitSha !== EXPECTED_GIT_BLOB_SHA) {
    return res.status(500).json({
      error: 'CV payload verification failed',
      gitSha,
      size: pdf.length,
    })
  }

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Length', String(pdf.length))
  res.setHeader(
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent(DOWNLOAD_FILENAME)}`,
  )
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600')
  return res.status(200).send(pdf)
}
