import React from 'react'
import { pickCategoryLabel } from '../../i18n/messages/projects.js'
import { ALL_FILTER_ID } from '../../projects/categories.js'

export default function FilterBar({ filters, active, onChange, count, language, t }) {
  return (
    <div className="ds-filters">
      <div className="ds-filter-row" role="group" aria-label={t('projects.filterAria')}>
        {filters.map((id) => (
          <button
            key={id}
            type="button"
            className="ds-btn ds-filter"
            aria-pressed={active === id}
            onClick={() => onChange(id)}
          >
            {id === ALL_FILTER_ID ? pickCategoryLabel(ALL_FILTER_ID, language) : pickCategoryLabel(id, language)}
          </button>
        ))}
      </div>
      <p className="ds-filter-count" aria-live="polite" aria-atomic="true">
        {count === 0 ? t('projects.emptyFilter') : t('projects.resultCount', { count })}
      </p>
    </div>
  )
}
