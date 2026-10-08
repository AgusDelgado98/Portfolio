import { useState } from 'react'

/**
 * Selection state for the parts of an interactive visual (Project Detail).
 *
 * A part is highlighted by pointer hover (mouse only), by keyboard focus, or
 * by a click / tap / Enter / Space that pins it; clicking it again releases
 * it. Hover wins over focus, focus over a pin. `bind(id, label, extraClass)`
 * returns the props for the part's <g>: a real, focusable button, so every
 * pointer interaction has a keyboard and a touch equivalent.
 */
export default function usePartFocus() {
  const [hovered, setHovered] = useState(null)
  const [focused, setFocused] = useState(null)
  const [pinned, setPinned] = useState(null)
  const active = hovered ?? focused ?? pinned
  const toggle = (id) => setPinned((current) => (current === id ? null : id))

  const bind = (id, label, extraClass = '') => ({
    className: `v-part${extraClass ? ` ${extraClass}` : ''}${active === id ? ' is-on' : ''}`,
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    'aria-pressed': pinned === id,
    onPointerEnter: (event) => {
      if (event.pointerType === 'mouse') setHovered(id)
    },
    onPointerLeave: () => setHovered(null),
    onFocus: (event) => {
      // Keyboard focus previews the part; a mouse or touch click pins it instead.
      if (event.currentTarget.matches(':focus-visible')) setFocused(id)
    },
    onBlur: () => setFocused(null),
    onClick: () => toggle(id),
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggle(id)
      }
    },
  })

  return { active, bind, setHovered }
}
