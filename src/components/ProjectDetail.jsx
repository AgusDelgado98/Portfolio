import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { pickCategoryLabel } from '../i18n/messages/projects.js'
import { getPrimaryCategory } from '../projects/categories.js'
import { buildDetailModel } from '../projects/detailModel.js'
import { mergeProjectCopy } from '../projects/mergeProjectCopy.js'
import { PROJECTS_HASH } from '../router/hashes.js'
import { getPublicCaseStudiesForProject } from '../projects/caseStudies.js'
import ProjectEvidenceGallery from './ProjectEvidenceGallery.jsx'
import SomaDemoVideo from './SomaDemoVideo.jsx'
import ProjectVisual from './projects/ProjectVisual.jsx'
import SectionNav from './projects/SectionNav.jsx'

const VISIBLE_POINTS = 4

/** One section: the <section> is only a landmark and an anchor; the h2 is what takes focus. */
function Block({ id, title, children, className }) {
  return (
    <section id={`detail-${id}`} aria-labelledby={`detail-${id}-title`} className={className}>
      <h2 id={`detail-${id}-title`} tabIndex={-1}>
        {title}
      </h2>
      <div className="ds-block-body">{children}</div>
    </section>
  )
}

function CaseRows({ studies, t }) {
  const sorted = [...studies].sort((a, b) => String(b.number || '').localeCompare(String(a.number || '')))
  return (
    <ul className="ds-case-list">
      {sorted.map((study) => {
        const copy = t(`casework.cases.${study.i18nKey}`)
        const title = copy && typeof copy === 'object' ? copy.title : study.slug
        const kicker = study.number ? String(study.number).padStart(2, '0') : t('casework.evidenceCaseLabel')
        return (
          <li key={study.slug}>
            <a href={study.canonicalHash}>
              <span className="ds-case-num">{kicker}</span>
              <span className="ds-case-title">{title}</span>
              <span className="ds-rule" aria-hidden="true" />
              <span className="ds-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function Technical({ model, project, t }) {
  const hasRepo = project.githubUrl || project.projectUrl || project.privateRepo
  return (
    <section id="detail-technical" className="ds-technical" aria-labelledby="detail-technical-title">
      <details className="ds-details">
        <summary>
          <h2 id="detail-technical-title" tabIndex={-1}>
            {t('projectDetail.sections.technical')}
          </h2>
        </summary>
        <dl className="ds-tech">
          {model.technical.stack.length ? (
            <div>
              <dt>{t('projectDetail.stackLabel')}</dt>
              <dd>{model.technical.stack.join(' · ')}</dd>
            </div>
          ) : null}
          {model.technical.rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
          {hasRepo ? (
            <div>
              <dt>{t('projectDetail.repositoryLabel')}</dt>
              <dd className="ds-tech-links">
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    {t(project.githubCtaKey || 'projects.viewGithub')}
                  </a>
                ) : null}
                {project.projectUrl ? (
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                    {t('projects.openProjectLink')}
                  </a>
                ) : null}
                {project.privateRepo ? <span>{t('projects.privateRepo')}</span> : null}
              </dd>
            </div>
          ) : null}
        </dl>
      </details>
    </section>
  )
}

export default function ProjectDetail({ id }) {
  const { t, language } = useLanguage()
  const project = mergeProjectCopy(id, language)
  if (!project?.id) return null

  const model = buildDetailModel(project, project)
  const studies = getPublicCaseStudiesForProject(project.id)
  // Declared professional use is its own label; it is never a deployment state.
  const statusKey = project.usage === 'professional' ? 'ProfessionalUse' : 'Active'
  const titleOf = (id) => model.titles[id] ?? t(`projectDetail.sections.${id}`)
  const { result } = model
  const shownPoints = result.points.slice(0, VISIBLE_POINTS)
  const morePoints = result.points.slice(VISIBLE_POINTS)
  const decisionCase = model.decision?.caseNumber
    ? studies.find((study) => study.number === model.decision.caseNumber)
    : null

  return (
    <article className="ds-detail" aria-labelledby="project-detail-title">
      <nav className="ds-breadcrumb" aria-label={t('projectDetail.breadcrumbAria')}>
        <a href={PROJECTS_HASH}>{t('projects.title')}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.title}</span>
      </nav>

      <header className="ds-detail-hero">
        <ProjectVisual project={project} language={language} t={t} interactive />
        <div className="ds-detail-intro">
          <p className="ds-proj-kicker">{pickCategoryLabel(getPrimaryCategory(project), language)}</p>
          <h1 id="project-detail-title">{project.title}</h1>
          {project.tagline ? <p className="ds-detail-tagline">{project.tagline}</p> : null}
          <dl className="ds-facts">
            <div>
              <dt>{t('projects.factStatus')}</dt>
              <dd>{t(`projects.status.${statusKey}`)}</dd>
            </div>
            {model.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <SectionNav projectId={project.id} sections={model.sections} titles={model.titles} t={t} />

      <div className="ds-detail-body">
        {model.work ? (
          <Block id="work" title={titleOf('work')}>
            <p className="ds-detail-lead">{model.work}</p>
          </Block>
        ) : null}

        {model.sections.includes('what') ? (
          <Block id="what" title={titleOf('what')}>
            {model.what.lead ? <p className="ds-detail-lead">{model.what.lead}</p> : null}
            {model.what.points.length ? (
              <ul className="ds-points">
                {model.what.points.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </Block>
        ) : null}

        {model.question ? (
          <Block id="question" title={titleOf('question')}>
            <p className="ds-detail-lead">{model.question}</p>
          </Block>
        ) : null}

        {model.method.length ? (
          <Block id="method" title={t('projectDetail.sections.method')}>
            <ol className="ds-milestones">
              {model.method.map((step, index) => (
                <li key={step.title}>
                  <span className="ds-ms-node" aria-hidden="true" />
                  <span className="ds-ms-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </Block>
        ) : null}

        {model.sections.includes('demo') ? (
          <Block id="demo" title={titleOf('demo')}>
            <p>{model.demoText}</p>
            {result.demo ? <SomaDemoVideo label={t('projects.demoLabel')} fallback={t('projects.demoFallback')} /> : null}
            {result.visuals.length ? <ProjectEvidenceGallery items={project.evidenceVisuals} /> : null}
          </Block>
        ) : null}

        {model.sections.includes(model.resultsId) ? (
          <Block id={model.resultsId} title={titleOf(model.resultsId)}>
            {result.headline ? <p className="ds-detail-highlight">{result.headline}</p> : null}
            {result.groups.map((group) => (
              <div key={group.title} className="ds-result-group">
                <h3>{group.title}</h3>
                <ul className="ds-points">
                  {group.points.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {shownPoints.length ? (
              <ul className="ds-points">
                {shownPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {!model.demoText && result.demo ? (
              <SomaDemoVideo label={t('projects.demoLabel')} fallback={t('projects.demoFallback')} />
            ) : null}
            {!model.demoText && result.visuals.length ? <ProjectEvidenceGallery items={project.evidenceVisuals} /> : null}
            {morePoints.length || result.context.length ? (
              <details className="ds-more">
                <summary>{t('projectDetail.moreContext')}</summary>
                {morePoints.length ? (
                  <ul className="ds-points">
                    {morePoints.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {result.context.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </details>
            ) : null}
          </Block>
        ) : null}

        {model.decision ? (
          <Block id="decision" title={titleOf('decision')}>
            <p>{model.decision.body}</p>
            {decisionCase ? (
              <a className="ds-arrow-link" href={decisionCase.canonicalHash}>
                {t('projectDetail.viewCase', { number: decisionCase.number })}
                <span aria-hidden="true"> →</span>
              </a>
            ) : null}
          </Block>
        ) : null}

        {model.limits.length ? (
          <Block id="limits" title={titleOf('limits')}>
            <ul className="ds-limits">
              {model.limits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>
        ) : null}

        {studies.length ? (
          <Block id="cases" title={t('projectDetail.sections.cases')}>
            <CaseRows studies={studies} t={t} />
          </Block>
        ) : null}

        {model.sections.includes('technical') ? <Technical model={model} project={project} t={t} /> : null}
      </div>
    </article>
  )
}
