import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/**
 * Extracted from Stack.jsx (Phase 1 — Destination Foundation). Just the
 * tools/capabilities grid (Core, AI/ML, Additional) — no section header, no
 * Formación/learning row. Stack.jsx composes this + <LearningRecord/> for
 * Home (identical output to before). components/DataBI.jsx renders only
 * this grid: Formación belongs to About per router/legacyHashRoadmap.js
 * ("#formacion" -> #about), so reusing all of <Stack/> there would have
 * duplicated the learning record across two destinations.
 */
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

export default function StackGroups() {
  const { t } = useLanguage()

  return (
    <div className="stack-grid">
      {stackGroupsMeta.map((group, i) => (
        <div key={group.id} className={`stack-card card card--spotlight fade-in fade-in-delay-${i + 1}`}>
          <div className="stack-card-head">
            <div className="stack-card-top">
              <div className={`stack-accent-bar ${group.accent}`} />
              <div className="stack-card-heading">
                <h3 className="stack-card-label">{t(`stack.groups.${group.id}.label`)}</h3>
              </div>
            </div>

            <p className="stack-card-desc">{t(`stack.groups.${group.id}.description`)}</p>
          </div>

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
  )
}
