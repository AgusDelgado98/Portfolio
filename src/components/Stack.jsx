import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const stackGroupsMeta = [
  {
    id: 'core',
    accent: 'sky',
    items: [
      'Python',
      'SQL',
      'Power BI',
      'Advanced Excel',
      'pandas',
      'PostgreSQL',
      'Data Analysis',
      'Data Visualization',
      'KPI Design',
      'ETL/ELT',
      'Data Quality',
      'Reporting Automation',
      'DAX',
      'Tableau',
      'Looker Studio',
      'Databricks',
    ],
  },
  {
    id: 'ai',
    accent: 'emerald',
    items: [
      'scikit-learn',
      'Machine Learning',
      'Predictive Modeling',
      'Model Evaluation',
      'Feature Engineering',
      'Generative AI',
      'Applied LLMs',
      'AI Automation',
    ],
  },
  {
    id: 'additional',
    accent: 'violet',
    items: [
      'Git/GitHub',
      'Streamlit',
      'FastAPI',
      'Django',
      'React',
      'TypeScript',
      'Supabase',
      'Vercel',
    ],
  },
]

const learningMeta = [
  {
    id: 'issd-cs-ai',
    status: 'in_progress',
    tags: ['Data Science', 'Artificial Intelligence', 'Python', 'Machine Learning'],
  },
  {
    id: 'ibm-gai',
    status: 'in_progress',
  },
  {
    id: 'coderhouse-data',
    status: 'completed',
    tags: ['Excel', 'SQL', 'Power BI', 'Dashboards'],
  },
]

export default function Stack() {
  const { t } = useLanguage()

  return (
    <section className="stack-section" id="stack">
      <div className="stack-header fade-in">
        <div>
          <span className="section-label">{t('stack.label')}</span>
          <h2 className="display-lg">
            {t('stack.heading')} <span className="grad-text-emerald">{t('stack.headingAccent')}</span>
          </h2>
        </div>
      </div>

      <div className="stack-grid">
        {stackGroupsMeta.map((group, i) => (
          <div key={group.id} className={`stack-card card card--spotlight fade-in fade-in-delay-${i + 1}`}>
            <div className="stack-card-top">
              <div className={`stack-accent-bar ${group.accent}`} />
              <div className="stack-card-heading">
                <h3 className="stack-card-label">{t(`stack.groups.${group.id}.label`)}</h3>
              </div>
            </div>

            <p className="stack-card-desc">{t(`stack.groups.${group.id}.description`)}</p>

            <div className="tech-list">
              {group.items.map((name) => (
                <div key={name} className="tech-item">
                  <span className="tech-name">{name}</span>
                  <span className="tech-note">{t(`stack.groups.${group.id}.notes.${name}`)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="learning-row fade-in" id="formacion">
        <div className="learning-header">
          <h2 className="learning-label">{t('stack.learningTitle')}</h2>
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
    </section>
  )
}
