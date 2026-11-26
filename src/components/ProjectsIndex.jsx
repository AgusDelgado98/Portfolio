import React from 'react'
import Seam from './home/Seam.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import ProjectsHero from './projects/ProjectsHero.jsx'
import ProjectsInUse from './projects/ProjectsInUse.jsx'
import ProjectsSpotlight from './projects/ProjectsSpotlight.jsx'
import OtherProjects from './projects/OtherProjects.jsx'

/**
 * Projects — two groups (F5, regrouped).
 *
 * Dark hero with one question per application in use → seam → paper:
 * «Proyectos en uso» (CONSTANTIA, SOMA, HOGARES, equal rows) and then
 * «Mi laboratorio personal»: spotlight plates (published projects only) and a
 * compact «Otros proyectos» list. No filters, no carousel. ContourMap is
 * generated as a static asset for the principal plate when that project is
 * published; it does not appear while unpublished.
 */
export default function ProjectsIndex() {
  const { t } = useLanguage()
  return (
    <div className="ds-home ds-projects">
      <ProjectsHero />
      <Seam />
      <div className="home-band home-paper">
        <ProjectsInUse />
        <section className="proj-other" aria-labelledby="proj-lab-title">
          <div className="proj-other__head">
            <h2 id="proj-lab-title" className="home-label home-label--ink">
              {t('home.projectGroups.personal.title')}
            </h2>
            <span className="proj-other__rule" aria-hidden="true" />
          </div>
          <p className="proj-other__lead">{t('home.projectGroups.personal.lead')}</p>
          <ProjectsSpotlight />
          <OtherProjects />
        </section>
      </div>
    </div>
  )
}
