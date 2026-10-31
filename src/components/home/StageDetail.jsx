import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { getPipelineAnchor, getProjectMeta, getProjectsForStage } from '../../projects/registry.js'
import { projectHash } from '../../router/hashes.js'
import { STAGE_LABELS } from '../../visual/stages.js'
import { getStageFact } from '../../visual/stageFacts.js'

/**
 * What the hero says about the stage the visitor is hovering, focusing or
 * pinning (F3A §5): one line, the project that anchors the stage, the other
 * projects that show it, and one verifiable figure. Anchors and secondaries
 * come from the registry (`PIPELINE_ANCHORS`, each project's `stages`); the
 * figure from the same data modules as the cards. It replaces the separate
 * "From data to decision" section, so the drawing and its explanation live in
 * one place.
 */
export default function StageDetail({ stage }) {
  const { t, language } = useLanguage()
  const anchorId = getPipelineAnchor(stage)
  const anchor = anchorId ? getProjectMeta(anchorId) : null
  const also = getProjectsForStage(stage).filter((project) => project.id !== anchorId)

  return (
    <div className={`ds-stage-detail ds-stage--${stage}`}>
      <p className="ds-stage-detail-name">{STAGE_LABELS[stage]}</p>
      <p className="ds-stage-detail-line">{t(`home.pipeline.stages.${stage}.line`)}</p>

      <div className="ds-stage-detail-projects">
        {anchor ? (
          <p>
            <span className="ds-stage-detail-label">{t('home.pipeline.anchorLabel')}</span>
            <a className="ds-link" href={projectHash(anchor.id)}>
              <strong>{anchor.title}</strong>
            </a>
          </p>
        ) : null}
        {also.length ? (
          <p>
            <span className="ds-stage-detail-label">{t('home.pipeline.alsoLabel')}</span>
            <span className="ds-stage-detail-also">
              {also.map((project) => (
                <a key={project.id} className="ds-link" href={projectHash(project.id)}>
                  {project.title}
                </a>
              ))}
            </span>
          </p>
        ) : null}
      </div>

      <dl className="ds-stage-detail-fact">
        <dt>{t(`home.pipeline.stages.${stage}.factLabel`)}</dt>
        <dd>{getStageFact(stage, language)}</dd>
      </dl>
    </div>
  )
}
