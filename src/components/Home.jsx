import React from 'react'
import HomeHero from './home/HomeHero.jsx'
import WorkProjects from './home/WorkProjects.jsx'
import PersonalProjects from './home/PersonalProjects.jsx'
import AboutBrief from './home/AboutBrief.jsx'
import ContactStrip from './home/ContactStrip.jsx'

/**
 * Home — PLAN-FROZEN v1.1, F3 (docs/redesign/F3A-preflight.md).
 *
 * Hero (with the DATA → EVIDENCE → PREDICTION → DECISION explanation) →
 * Work-linked projects → Personal projects → About brief → Contact strip (the
 * global Footer follows). Composition only; every section
 * reads the registry and its own copy. The dark surface (`data-surface="dark"`) is set by App.jsx.
 */
export default function Home() {
  return (
    <div className="ds-home">
      <HomeHero />
      <WorkProjects />
      <PersonalProjects />
      <AboutBrief />
      <ContactStrip />
    </div>
  )
}
