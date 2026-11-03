import React from 'react'
import Seam from './home/Seam.jsx'
import ProjectsHero from './projects/ProjectsHero.jsx'
import ProjectsSpotlight from './projects/ProjectsSpotlight.jsx'
import OtherProjects from './projects/OtherProjects.jsx'

/**
 * Projects — «Tres casos, tres preguntas» (F5).
 *
 * Dark hero with the three framing questions → seam → paper: spotlight plates
 * (published projects only) and a compact «Otros proyectos» list. No filters,
 * no carousel. ContourMap is generated as a static asset for the principal
 * plate when that project is published; it does not appear while unpublished.
 */
export default function ProjectsIndex() {
  return (
    <div className="ds-home ds-projects">
      <ProjectsHero />
      <Seam />
      <div className="home-band home-paper">
        <ProjectsSpotlight />
        <OtherProjects />
      </div>
    </div>
  )
}
