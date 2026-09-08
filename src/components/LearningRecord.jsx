import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/**
 * Extracted from Stack.jsx (Phase 1 — Destination Foundation). Same
 * markup, data and i18n keys (`stack.learning*`) as before — Stack.jsx
 * renders this unchanged on Home (`id="formacion"`, identical DOM), and
 * components/About.jsx renders it as part of the standalone `#about`
 * destination (per item 12: "formación" belongs with About, alongside
 * profile/trajectory/methodology — see router/legacyHashRoadmap.js).
 */
const learningMeta = [
  {
    id: 'issd-cs-ai',
    status: 'in_progress',
    tags: ['Data Science', 'Artificial Intelligence', 'Python', 'Machine Learning'],
  },
  {
    id: 'ibm-gai',
    status: 'completed',
  },
  {
    id: 'coderhouse-data',
    status: 'completed',
    tags: ['Excel', 'SQL', 'Power BI', 'Dashboards'],
  },
]

export default function LearningRecord() {
  const { t } = useLanguage()

  return (
    <div className="learning-row fade-in" id="formacion">
      <div className="learning-header">
        <h3 className="learning-label">{t('stack.learningTitle')}</h3>
      </div>
      <div className="learning-list">
        {learningMeta.map((item) => {
          const title = item.title || t(`stack.learning.${item.id}.title`)
          const institution = t(`stack.learning.${item.id}.institution`)
          const hasInstitution = institution && !String(institution).startsWith('stack.learning')
          const progressNote = t(`stack.learning.${item.id}.progressNote`)
          const hasProgress = progressNote && !String(progressNote).startsWith('stack.learning')
          const statusLabel =
            item.status === 'completed' ? t('stack.statusCompleted') : t('stack.statusInProgress')

          return (
            <div key={item.id} className="learning-item">
              <div className="learning-item-body">
                <div className="learning-item-head">
                  <span className="learning-title">{title}</span>
                  <div className="learning-item-status-wrap">
                    {hasProgress && <span className="learning-progress">{progressNote}</span>}
                    <span className={`learning-status learning-status--${item.status}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
                {hasInstitution && <span className="learning-institution">{institution}</span>}
                <p className="learning-desc">{t(`stack.learning.${item.id}.description`)}</p>
                {item.tags?.length > 0 && (
                  <div className="learning-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="learning-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
