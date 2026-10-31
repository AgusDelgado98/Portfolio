import React from 'react'
import ProjectCard from './ProjectCard.jsx'

export default function ProjectGrid({ projects, uniform = false }) {
  if (!projects.length) return null
  return (
    <ul className="ds-proj-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} uniform={uniform} />
      ))}
    </ul>
  )
}
