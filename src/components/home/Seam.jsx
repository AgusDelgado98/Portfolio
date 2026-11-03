import React from 'react'

/**
 * The transition from the dark hero to the paper sections: contour lines along
 * an undulating edge (public/figures/seam.svg). A graphic seam, not an effect:
 * it is static, decorative and hidden from assistive technology.
 */
export default function Seam() {
  return <div className="home-seam" aria-hidden="true" />
}
