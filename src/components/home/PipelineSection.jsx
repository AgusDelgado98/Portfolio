import React, { useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { PROJECT_STAGES, getPipelineAnchor, getProjectMeta, getProjectsForStage } from '../../projects/registry.js'
import { PROJECTS_HASH, projectHash } from '../../router/hashes.js'
import { FlowSvg } from '../../visual/HeroFlowVisual.jsx'
import { STAGE_LABELS } from '../../visual/stages.js'
import { getStageFact } from '../../visual/stageFacts.js'

/**
 * DATA → EVIDENCE → PREDICTION → DECISION as ONE compact piece (F3A §5): four
 * tabs and a single panel for the selected stage — the hero's drawing with that
 * stage highlighted, one line,
 * the anchor project, the other projects that show the stage, and one
 * verifiable figure. Anchors and secondaries come from the registry
 * (`PIPELINE_ANCHORS`, each project's `stages`), so DECERNO becomes
 * Decision's anchor by data. The selection is local state: no hash, no routing,
 * no auto-advance. This is evidence of capabilities, not a career timeline.
 *
 * Tabs follow the WAI-ARIA pattern: arrow keys / Home / End move between them
 * (roving tabindex); the panel is labelled by its tab.
 */
export default function PipelineSection() {
  const { t, language } = useLanguage()
  const [active, setActive] = useState(PROJECT_STAGES[0])
  const tabRefs = useRef({})

  const select = (stage, { focus = false } = {}) => {
    setActive(stage)
    if (focus) tabRefs.current[stage]?.focus()
  }

  const onKeyDown = (event) => {
    const index = PROJECT_STAGES.indexOf(active)
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = PROJECT_STAGES[(index + 1) % PROJECT_STAGES.length]
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = PROJECT_STAGES[(index - 1 + PROJECT_STAGES.length) % PROJECT_STAGES.length]
    else if (event.key === 'Home') next = PROJECT_STAGES[0]
    else if (event.key === 'End') next = PROJECT_STAGES[PROJECT_STAGES.length - 1]
    if (next) {
      event.preventDefault()
      select(next, { focus: true })
    }
  }

  const anchorId = getPipelineAnchor(active)
  const anchor = anchorId ? getProjectMeta(anchorId) : null
  const also = getProjectsForStage(active).filter((project) => project.id !== anchorId)

  return (
    <section aria-labelledby="home-pipeline-title">
      <div className="ds-section-head">
        <div>
          <h2 id="home-pipeline-title" className="ds-h2">
            {t('home.pipeline.title')}
          </h2>
          <p className="ds-lead">{t('home.pipeline.lead')}</p>
        </div>
      </div>

      <div className="ds-pipeline-tabs" role="tablist" aria-label={t('home.pipeline.tablistAria')} onKeyDown={onKeyDown}>
        {PROJECT_STAGES.map((stage, index) => (
          <button
            key={stage}
            ref={(node) => {
              tabRefs.current[stage] = node
            }}
            type="button"
            role="tab"
            id={`home-pipeline-tab-${stage}`}
            aria-selected={active === stage}
            aria-controls="home-pipeline-panel"
            tabIndex={active === stage ? 0 : -1}
            className={`ds-pipeline-tab ds-stage--${stage}`}
            onClick={() => select(stage)}
          >
            <span className="ds-pipeline-tab-num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="ds-pipeline-tab-name">{STAGE_LABELS[stage]}</span>
          </button>
        ))}
      </div>

      <div
        id="home-pipeline-panel"
        role="tabpanel"
        aria-labelledby={`home-pipeline-tab-${active}`}
        className={`ds-pipeline-panel ds-stage--${active}`}
      >
        <FlowSvg className="ds-pipeline-glyph" focus={active} />

        <div className="ds-pipeline-copy">
          <p className="ds-pipeline-stage">{STAGE_LABELS[active]}</p>
          <p className="ds-pipeline-line">{t(`home.pipeline.stages.${active}.line`)}</p>

          <div className="ds-pipeline-projects">
            {anchor ? (
              <p>
                <span className="ds-pipeline-projects-label">{t('home.pipeline.anchorLabel')}</span>
                <a className="ds-link" href={projectHash(anchor.id)}>
                  <strong>{anchor.title}</strong>
                </a>
              </p>
            ) : null}
            {also.length ? (
              <p>
                <span className="ds-pipeline-projects-label">{t('home.pipeline.alsoLabel')}</span>
                <span className="ds-pipeline-also">
                  {also.map((project) => (
                    <a key={project.id} className="ds-link" href={projectHash(project.id)}>
                      {project.title}
                    </a>
                  ))}
                </span>
              </p>
            ) : null}
          </div>

          <dl className="ds-pipeline-fact">
            <dt>{t(`home.pipeline.stages.${active}.factLabel`)}</dt>
            <dd>{getStageFact(active, language)}</dd>
          </dl>
        </div>
      </div>

      <p className="ds-pipeline-more">
        <a className="ds-link" href={PROJECTS_HASH}>
          {t('home.viewAll')}
        </a>
      </p>
    </section>
  )
}
