// F11 Lighthouse sample (lab). Max 3 runs per page. Usage:
//   node lighthouse-sample.mjs <baseUrl> <outDir>
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const [base, outDirArg] = process.argv.slice(2)
if (!base || !outDirArg) {
  console.error('Usage: node lighthouse-sample.mjs <baseUrl> <outDir>')
  process.exit(2)
}
const outDir = path.resolve(outDirArg)
fs.mkdirSync(outDir, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const pages = [
  { id: 'home', hash: '#home' },
  { id: 'projects', hash: '#projects' },
  { id: 'about', hash: '#about' },
  { id: 'case-demand', hash: '#projects/providentia/demand-forecasting' },
]

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

const runLh = (url, reportPath) =>
  new Promise((resolve, reject) => {
    const args = [
      '--yes',
      'lighthouse',
      url,
      '--quiet',
      '--form-factor=mobile',
      '--screenEmulation.mobile',
      '--throttling-method=simulate',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json',
      `--output-path=${reportPath}`,
      '--chrome-flags=--headless=new --no-first-run --disable-gpu',
    ]
    const child = spawn('npx', args, {
      cwd: repoRoot,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, CHROME_PATH: EDGE },
    })
    let err = ''
    child.stderr.on('data', (d) => { err += d.toString() })
    child.stdout.on('data', (d) => { err += d.toString() })
    child.on('exit', (code) => {
      if (code === 0 && fs.existsSync(reportPath)) resolve()
      else reject(new Error(`lighthouse exit ${code}: ${err.slice(-1200)}`))
    })
  })

const summary = {
  kind: 'laboratory-simulated',
  tool: 'Lighthouse mobile simulated throttling via Edge (CHROME_PATH)',
  pages: {},
  note: 'Lab metrics only — not field/RUM user data. Simulated LCP on case pages is known to inflate vs observed paint (see evidence-log.md).',
}

for (const page of pages) {
  const runs = []
  for (let i = 1; i <= 3; i += 1) {
    const reportPath = path.join(outDir, `${page.id}-run${i}.json`)
    const url = `${base}/${page.hash}`
    console.log(`LH ${page.id} run ${i}…`)
    await runLh(url, reportPath)
    const json = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    const audits = json.audits
    const cats = json.categories
    runs.push({
      run: i,
      performance: Math.round((cats.performance?.score || 0) * 100),
      accessibility: Math.round((cats.accessibility?.score || 0) * 100),
      bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
      seo: Math.round((cats.seo?.score || 0) * 100),
      fcp: Math.round(audits['first-contentful-paint']?.numericValue || 0),
      lcp: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
      cls: Number((audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
      tbt: Math.round(audits['total-blocking-time']?.numericValue || 0),
    })
  }
  summary.pages[page.id] = {
    runs,
    median: {
      performance: median(runs.map((r) => r.performance)),
      accessibility: median(runs.map((r) => r.accessibility)),
      bestPractices: median(runs.map((r) => r.bestPractices)),
      seo: median(runs.map((r) => r.seo)),
      fcp: median(runs.map((r) => r.fcp)),
      lcp: median(runs.map((r) => r.lcp)),
      cls: Number(median(runs.map((r) => Math.round(r.cls * 1000))) / 1000),
      tbt: median(runs.map((r) => r.tbt)),
    },
  }
  console.log(`  median Perf ${summary.pages[page.id].median.performance} LCP ${summary.pages[page.id].median.lcp} CLS ${summary.pages[page.id].median.cls}`)
}

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
console.log('Wrote', path.join(outDir, 'summary.json'))
