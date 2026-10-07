import { useEffect, useState } from 'react'

/**
 * Whether the element behind `ref` is currently on screen. Used to pause the
 * hero's single ambient animation while it cannot be seen. Without
 * IntersectionObserver (or before it reports) it answers `true`, so the page
 * never depends on it to show something.
 */
export default function useInView(ref, options = { threshold: 0.1 }) {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), options)
    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])

  return inView
}
