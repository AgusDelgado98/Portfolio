import React from 'react'
import HomeHero from './home/HomeHero.jsx'
import Seam from './home/Seam.jsx'
import ProfileBlock from './home/ProfileBlock.jsx'
import FeaturedProjects from './home/FeaturedProjects.jsx'
import ContactStrip from './home/ContactStrip.jsx'

/**
 * Home — "Superficie de decisión" (F4).
 *
 * Dark hero with the response surface and the four-step journey → the seam →
 * paper: profile and selected projects → the contact strip (the global Footer
 * follows). The dark and paper bands run edge to edge; their content keeps the
 * page column (styles/home.css). The dark surface (`data-surface="dark"`) is set
 * by App.jsx.
 */
export default function Home() {
  return (
    <div className="ds-home">
      <HomeHero />
      <Seam />
      <div className="home-band home-paper">
        <ProfileBlock />
        <FeaturedProjects />
      </div>
      <ContactStrip />
    </div>
  )
}
