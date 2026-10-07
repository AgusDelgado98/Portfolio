/**
 * Which Project Detail sections exist for a project (F4).
 *
 * Plain data in, plain data out. A section is emitted only when the copy or
 * the registry already holds something to show. Decision follows `stages`,
 * not the word "decision" appearing in a paragraph. Data and the decision
 * step are taken out of the method walkthrough so the same sentence is not
 * printed twice.
 */

const DATA_TITLE =
  /datos|dataset|sint[eé]tic|synthetic|upstream|public data|datos p[uú]blicos/i
const DECISION_TITLE = /decisi[oó]n|decision/i

export const DETAIL_SECTION_ORDER = Object.freeze([
  'overview',
  'data',
  'approach',
  'results',
  'product',
  'decision',
  'limits',
  'cases',
  'technical',
  'links',
])

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function stepsOf(copy) {
  if (!Array.isArray(copy?.flowSteps)) return []
  return copy.flowSteps.filter((step) => text(step?.title) && text(step?.body))
}

export function buildDetailSections(project, copy) {
  const sections = []
  const problem = text(copy?.problem)
  const built = text(copy?.description)
  const role = text(copy?.role)
  if (problem || built || role) sections.push({ id: 'overview', problem, built, role })

  const steps = stepsOf(copy)
  const dataSteps = steps.filter((step) => DATA_TITLE.test(step.title))
  const decisionSteps = project?.stages?.includes('decision')
    ? steps.filter((step) => DECISION_TITLE.test(step.title))
    : []
  const consumed = new Set([...dataSteps, ...decisionSteps])
  const approachSteps = steps.filter((step) => !consumed.has(step))

  if (dataSteps.length) sections.push({ id: 'data', steps: dataSteps })
  if (approachSteps.length) sections.push({ id: 'approach', lead: text(copy?.flowLead), steps: approachSteps })

  const highlights = Array.isArray(copy?.highlights) ? copy.highlights.filter(text) : []
  const impact = text(copy?.impact)
  const impactHighlight = text(copy?.impactHighlight)
  const visuals = Array.isArray(project?.evidenceVisuals) ? project.evidenceVisuals.filter((item) => item?.src) : []
  const demo = Boolean(project?.hasDemoVideo)
  if (impact || impactHighlight || highlights.length || demo || visuals.length) {
    sections.push({
      id: project?.resultsSectionKey === 'product' ? 'product' : 'results',
      impact,
      impactHighlight,
      highlights,
      demo,
      visuals,
    })
  }

  if (decisionSteps.length) sections.push({ id: 'decision', steps: decisionSteps })

  const limits = [copy?.privacyNote, copy?.nextStep].map(text).filter(Boolean)
  if (limits.length) sections.push({ id: 'limits', items: limits })

  const studies = (project?.caseStudies || []).filter((study) => study && study.isPublic !== false)
  if (studies.length) sections.push({ id: 'cases', studies })

  const artifacts = Array.isArray(copy?.artifacts) ? copy.artifacts.filter(text) : []
  const stack = Array.isArray(project?.stack) ? project.stack.filter(text) : []
  if (artifacts.length || stack.length) sections.push({ id: 'technical', artifacts, stack })

  if (project?.githubUrl || project?.projectUrl || project?.privateRepo) sections.push({ id: 'links' })

  return sections
}

export function detailSectionIds(project, copy) {
  return buildDetailSections(project, copy).map((section) => section.id)
}
