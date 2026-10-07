import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { pickCategoryLabel } from '../../i18n/messages/projects.js'
import { getPrimaryCategory } from '../../projects/categories.js'
import { cardShowsFeaturedPresence, cardVariant } from '../../projects/catalog.js'
import { projectHash } from '../../router/hashes.js'
import { cardMetric, visualStage } from '../../visual/cardVisuals.jsx'
import ProjectVisual from './ProjectVisual.jsx'

const STATUS_KEY = { active: 'Active', production: 'Production' }

function chipsFor(project) {
  if (project.homeStack?.length) return project.homeStack.slice(0, 4)
  if (project.stack?.length) return project.stack.slice(0, 4)
  return project.tags || []
}

export default function ProjectCard({ project }) {
  const { t, language } = useLanguage()
  const variant = cardVariant(project.tier)
  const stage = visualStage(project)
  const labels = project.visual === 'forecast' || project.visual === 'pipeline' || project.visual === 'evidence-network'
    ? t(`home.featured.cards.${project.id === 'caelum' ? 'caelum' : project.id}`)
    : null
  const metricLabels =
    labels ||
    (project.visual === 'rules-vs-ml'
      ? { metricLabel: t('projects.metrics.f1'), metricNote: t('projects.metrics.f1Note') }
      : null)
  const metric = metricLabels ? cardMetric(project, language, metricLabels) : null
  const evidence = metric ? null : project.impactHighlight
  const stageClass = stage ? `ds-stage--${stage}` : 'ds-stage--product'
  const cta = project.id === 'aletheia' ? t('projects.exploreResearch') : t('projects.viewProject')

  return (
    <li
      className={[
        'ds-proj',
        `ds-proj--${variant}`,
        cardShowsFeaturedPresence(project.tier) ? 'ds-proj--featured' : '',
        stageClass,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <a className="ds-proj-link" href={projectHash(project.id)}>
        <ProjectVisual project={project} language={language} t={t} decorative />
        <div className="ds-proj-body">
          <p className="ds-proj-kicker">{pickCategoryLabel(getPrimaryCategory(project), language)}</p>
          <h2 className="ds-proj-title">{project.title}</h2>
          <p className="ds-proj-line">{project.nodeSummary || project.tagline}</p>
          {metric ? (
            <p className="ds-proj-metric">
              <span className="ds-proj-metric-label">{metric.label}</span>
              <span className="ds-proj-metric-value">
                {metric.value}
                {metric.note ? <span className="ds-proj-metric-note">{metric.note}</span> : null}
              </span>
            </p>
          ) : null}
          {evidence ? <p className="ds-proj-evidence">{evidence}</p> : null}
          {chipsFor(project).length ? (
            <ul className="ds-chips">
              {chipsFor(project).map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          ) : null}
          <p className="ds-proj-cta">
            {cta}
            <span aria-hidden="true"> →</span>
          </p>
        </div>
      </a>
    </li>
  )
}
