import React, { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { mergeProjectCopy } from '../projects/mergeProjectCopy.js'
import { ALL_FILTER_ID, filterProjectsByCategory } from '../projects/categories.js'
import { getVisibleCategoryFilters, getVisibleProjects, getProjectsByGroup } from '../projects/registry.js'
import FilterBar from './projects/FilterBar.jsx'
import ProjectGrid from './projects/ProjectGrid.jsx'

/**
 * Projects — one catalog (F4), in two groups: the projects linked to my
 * professional activity (PARADIGM → PROVIDENTIA → SOMA, the registry's
 * `WORK_PROJECT_ORDER`) and the personal ones. Filters are local state: they do
 * not touch the URL, and they apply inside both groups. Which chips exist comes
 * from the registry and categories.js, not from a list written into this file.
 */
export default function ProjectsIndex() {
  const { t, language } = useLanguage()
  const projects = getVisibleProjects().map((project) => mergeProjectCopy(project.id, language))
  const filters = [ALL_FILTER_ID, ...getVisibleCategoryFilters()]
  const [filter, setFilter] = useState(ALL_FILTER_ID)
  const visible = filterProjectsByCategory(projects, filter)
  const visibleIds = new Set(visible.map((project) => project.id))
  const groups = ['work', 'personal']
    .map((group) => ({
      id: group,
      projects: getProjectsByGroup(group)
        .filter((project) => visibleIds.has(project.id))
        .map((project) => visible.find((item) => item.id === project.id)),
    }))
    .filter((group) => group.projects.length)

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
      {groups.map((group) => (
        <section key={group.id} className="ds-proj-group" aria-labelledby={`proj-group-${group.id}`}>
          <h2 id={`proj-group-${group.id}`} className="ds-proj-group-title">
            {t(`home.projectGroups.${group.id}.title`)}
          </h2>
          <p className="ds-proj-group-lead">{t(`home.projectGroups.${group.id}.lead`)}</p>
          <ProjectGrid projects={group.projects} uniform={group.id === 'work'} />
        </section>
      ))}
    </div>
  )
}
