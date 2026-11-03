import React from 'react'

/**
 * Monogram of the "Superficie de decisión" identity: a ring (the surface), a
 * wave (the estimate) and a dashed line across it (the decision threshold —
 * the only copper in the mark). Decorative: the link or heading that holds it
 * carries the name. Colors come from tokens in styles/shell.css.
 */
export default function BrandMark({ size = 28 }) {
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="brand-mark__ring" cx="14" cy="14" r="11" />
      <path className="brand-mark__wave" d="M7 18 C11 18 12 11 14 11 S17 18 21 18" />
      <line className="brand-mark__threshold" x1="5" y1="14" x2="23" y2="14" />
    </svg>
  )
}
