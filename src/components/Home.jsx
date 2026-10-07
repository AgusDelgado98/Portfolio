import React from 'react'
import HomeHero from './home/HomeHero.jsx'
import FeaturedProjects from './home/FeaturedProjects.jsx'
import PipelineSection from './home/PipelineSection.jsx'
import AboutBrief from './home/AboutBrief.jsx'
import ContactStrip from './home/ContactStrip.jsx'

/**
 * Home — PLAN-FROZEN v1.1, F3 (docs/redesign/F3A-preflight.md).
 *
 * Hero → Featured projects → Pipeline → About brief → Contact strip (the global
 * Footer follows). Composition only; every section reads the registry and its
 * own copy. The dark surface (`data-surface="dark"`) is set by App.jsx.
 */
export default function Home() {
  return (
    <div className="ds-home">
      <HomeHero />
      <FeaturedProjects />
      <PipelineSection />
      <AboutBrief />
      <ContactStrip />
    </div>
  )
}
