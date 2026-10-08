import { useState } from 'react'

/**
 * One-of-N selection that previews on hover (mouse only) and keyboard focus,
 * and settles on click / tap. `shown` is what the panel should display:
 * hover, else focus, else the settled choice. Every pointer path has a
 * keyboard and a touch equivalent, because focus previews and click settles.
 */
export default function useSelectable(initial) {
  const [selected, setSelected] = useState(initial)
  const [hovered, setHovered] = useState(null)
  const [focused, setFocused] = useState(null)
  const shown = hovered ?? focused ?? selected

  const bind = (id) => ({
    'aria-pressed': selected === id,
    'data-shown': shown === id ? 'true' : undefined,
    onClick: () => setSelected(id),
    onPointerEnter: (event) => {
      if (event.pointerType === 'mouse') setHovered(id)
    },
    onPointerLeave: () => setHovered(null),
    onFocus: (event) => {
      if (event.currentTarget.matches(':focus-visible')) setFocused(id)
    },
    onBlur: () => setFocused(null),
  })

  return { shown, bind }
}
