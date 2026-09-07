import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import StackGroups from './StackGroups.jsx'
import LearningRecord from './LearningRecord.jsx'

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

      <StackGroups />
      <LearningRecord />
    </section>
  )
}
