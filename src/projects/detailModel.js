/**
 * What a Project Detail page reads, in reading order (F4, recomposed).
 *
 *   work → what → question → method → demo → results (or product) → decision →
 *   limits → cases → technical
 *
 * A work-linked project (`copy.detail.work`) leads with how it is used at work,
 * then what it does, then its PUBLIC demonstration (what the data behind it is,
 * the picture or video), then the verifiable results of that public case.
 *
 * Plain data in, plain data out. A section is emitted only when there is
 * something to show, so a project is never padded to a fixed number of blocks.
 *
 * Copy comes from one of two places:
 *  - `copy.detail`, a short hand-written version (PROVIDENTIA has one): one
 *    question sentence, a four-step method, one headline result, a decision,
 *    2–4 scope bullets and a few technical rows. It wins whenever it exists.
 *  - otherwise the long-form copy every project already has, trimmed on the
 *    way in: the problem is the question, the method steps are the method,
 *    the impact line and highlights are the result, and the long description,
 *    role and impact paragraphs move behind a "more context" disclosure
 *    instead of leading the page. Artifact lists are not shown.
 *
 * Decision follows `stages`, not the word "decision" appearing in a paragraph.
 */

const DATA_TITLE =
  /datos|dataset|sint[eé]tic|synthetic|upstream|public data|datos p[uú]blicos/i
const DECISION_TITLE = /decisi[oó]n|decision/i

export const DETAIL_SECTION_ORDER = Object.freeze([
  'work',
  'what',
  'question',
  'method',
  'demo',
  'results',
  'product',
  'decision',
  'limits',
  'cases',
  'technical',
])

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function list(value) {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : []
}

function stepsOf(copy) {
  if (!Array.isArray(copy?.flowSteps)) return []
  return copy.flowSteps
    .map((step) => ({ title: text(step?.title), body: text(step?.body) }))
    .filter((step) => step.title && step.body)
}

/** The hand-written short copy, when a project has it. */
function fromDetail(detail, project) {
  const decision = detail.decision && text(detail.decision.body) ? detail.decision : null
  return {
    work: text(detail.work),
    what: { lead: text(detail.what?.lead), points: list(detail.what?.points) },
    demo: text(detail.demo),
    titles: detail.titles && typeof detail.titles === 'object' ? detail.titles : {},
    question: text(detail.question),
    facts: Array.isArray(detail.facts) ? detail.facts.filter((fact) => text(fact?.label) && text(fact?.value)) : [],
    method: stepsOf({ flowSteps: detail.method }),
    result: {
      headline: text(detail.result?.headline),
      points: list(detail.result?.points),
      groups: Array.isArray(detail.result?.groups)
        ? detail.result.groups
            .map((group) => ({ title: text(group?.title), points: list(group?.points) }))
            .filter((group) => group.title && group.points.length)
        : [],
      context: [],
    },
    decision: decision ? { body: text(decision.body), caseNumber: text(decision.caseNumber) } : null,
    limits: list(detail.limits),
    technical: {
      rows: Array.isArray(detail.technical)
        ? detail.technical.filter((row) => text(row?.label) && text(row?.value))
        : [],
    },
    project,
  }
}

/** The long-form copy, trimmed for a first read. */
function fromLongCopy(project, copy) {
  const steps = stepsOf(copy)
  const decisionSteps = project?.stages?.includes('decision')
    ? steps.filter((step) => DECISION_TITLE.test(step.title))
    : []
  const methodSteps = steps.filter((step) => !decisionSteps.includes(step))
  const dataFirst = [
    ...methodSteps.filter((step) => DATA_TITLE.test(step.title)),
    ...methodSteps.filter((step) => !DATA_TITLE.test(step.title)),
  ]

  const context = [text(copy?.description), text(copy?.role), text(copy?.impact)].filter(Boolean)
  const limits = [copy?.privacyNote, copy?.nextStep].map(text).filter(Boolean)

  return {
    work: '',
    what: { lead: '', points: [] },
    demo: '',
    titles: {},
    question: text(copy?.problem),
    facts: [],
    method: dataFirst,
    result: {
      headline: text(copy?.impactHighlight),
      points: list(copy?.highlights),
      groups: [],
      context,
    },
    decision: decisionSteps.length
      ? { body: decisionSteps.map((step) => step.body).join(' '), caseNumber: '' }
      : null,
    limits,
    technical: { rows: [] },
    project,
  }
}

export function buildDetailModel(project, copy) {
  const base = copy?.detail ? fromDetail(copy.detail, project) : fromLongCopy(project, copy)

  const visuals = Array.isArray(project?.evidenceVisuals) ? project.evidenceVisuals.filter((item) => item?.src) : []
  const demo = Boolean(project?.hasDemoVideo)
  const stack = list(project?.stack)
  const studies = (project?.caseStudies || []).filter((study) => study && study.isPublic !== false)
  const hasLinks = Boolean(project?.githubUrl || project?.projectUrl || project?.privateRepo)

  // With a `demo` text the picture and the video belong to the public
  // demonstration; without one they stay with the results (every other project).
  const hasDemoSection = Boolean(base.demo)
  const hasWhat = Boolean(base.what.lead || base.what.points.length)
  const hasResult = Boolean(
    base.result.headline ||
      base.result.points.length ||
      base.result.groups.length ||
      base.result.context.length ||
      (!hasDemoSection && (demo || visuals.length)),
  )
  const resultsId = project?.resultsSectionKey === 'product' ? 'product' : 'results'

  const sections = []
  if (base.work) sections.push('work')
  if (hasWhat) sections.push('what')
  if (base.question) sections.push('question')
  if (base.method.length) sections.push('method')
  if (hasDemoSection) sections.push('demo')
  if (hasResult) sections.push(resultsId)
  if (base.decision) sections.push('decision')
  if (base.limits.length) sections.push('limits')
  if (studies.length) sections.push('cases')
  if (stack.length || base.technical.rows.length || hasLinks) sections.push('technical')

  return {
    sections,
    resultsId,
    titles: base.titles,
    work: base.work,
    what: base.what,
    demoText: base.demo,
    question: base.question,
    facts: base.facts,
    method: base.method,
    result: { ...base.result, demo, visuals },
    decision: base.decision,
    limits: base.limits,
    studies,
    technical: { stack, rows: base.technical.rows },
  }
}

export function detailSectionIds(project, copy) {
  return buildDetailModel(project, copy).sections
}
