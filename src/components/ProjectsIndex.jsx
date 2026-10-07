import React, { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { mergeProjectCopy } from '../projects/mergeProjectCopy.js'
import { ALL_FILTER_ID, filterProjectsByCategory } from '../projects/categories.js'
import { getVisibleCategoryFilters, getVisibleProjects } from '../projects/registry.js'
import FilterBar from './projects/FilterBar.jsx'
import ProjectGrid from './projects/ProjectGrid.jsx'

/**
 * Projects — one catalog (F4). Filters are local state: they do not touch the
 * URL. Which chips exist comes from the registry and categories.js, not from
 * a list written into this file.
 */
export default function ProjectsIndex() {
  const { t, language } = useLanguage()
  const projects = getVisibleProjects().map((project) => mergeProjectCopy(project.id, language))
  const filters = [ALL_FILTER_ID, ...getVisibleCategoryFilters()]
  const [filter, setFilter] = useState(ALL_FILTER_ID)
  const visible = filterProjectsByCategory(projects, filter)

  return (
    <div className="ds-proj-page">
      <header className="ds-proj-header">
        <h1 className="ds-proj-title-page">{t('projects.title')}</h1>
        <p className="ds-proj-lead">{t('projects.lead')}</p>
      </header>
      <FilterBar
        filters={filters}
        active={filter}
        onChange={setFilter}
        count={visible.length}
        language={language}
        t={t}
      />
      <ProjectGrid projects={visible} />
    </div>
  )
}
