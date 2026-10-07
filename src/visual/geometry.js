/**
 * Deterministic geometry helpers shared by Home's SVG visuals. Pure functions,
 * no randomness: the same input always draws the same picture (stable renders,
 * stable tests).
 */

/** One decimal is plenty for an SVG path and keeps the markup small. */
export function r(value) {
  return Math.round(value * 10) / 10
}

/** A small, fixed pseudo-jitter in [-amount, amount] for index `i`. */
function jitter(i, a, b, amount) {
  return (((i * a + b) % 9) - 4) * (amount / 4)
}

/** A cols × rows grid of points with a fixed, slight displacement. Row-major. */
export function dotGrid({ cols, rows, x0, y0, dx, dy, spread = 3 }) {
  const points = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const i = row * cols + col
      points.push({
        i,
        row,
        col,
        x: r(x0 + col * dx + jitter(i, 37, 11, spread)),
        y: r(y0 + row * dy + jitter(i, 53, 7, spread)),
      })
    }
  }
  return points
}

/**
 * Points as ONE path: a zero-length segment per point, drawn as a dot by a
 * round `stroke-linecap`. Dozens of dots cost a single DOM element.
 */
export function dotsPath(points) {
  return points.map((p) => `M${r(p.x)} ${r(p.y)}h.01`).join('')
}

/** `M x y L x y …` for an open polyline of [x, y] pairs. */
export function polylinePath(points) {
  return points.map((p, index) => `${index === 0 ? 'M' : 'L'}${r(p[0])} ${r(p[1])}`).join('')
}

/**
 * Nested prediction-interval bands around a straight forecast centerline.
 * Half-width grows with √t (as a forecast's uncertainty does) and its end value
 * is `halfWidth × ratio`, so the bands keep the given ratios to each other.
 * Returns the closed paths widest-first (so they stack correctly), the
 * half-widths at the far end and the centerline's end point.
 */
export function bandPaths({ x0, y0, x1, y1, halfWidth, ratios, steps = 6 }) {
  const centerAt = (t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]
  const paths = ratios.map((ratio) => {
    const top = []
    const bottom = []
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps
      const [x, y] = centerAt(t)
      const w = halfWidth * ratio * Math.sqrt(t)
      top.push([x, y - w])
      bottom.push([x, y + w])
    }
    return `${polylinePath([...top, ...bottom.reverse()])}Z`
  })
  return {
    paths: paths.slice().reverse(),
    endHalfWidths: ratios.map((ratio) => r(halfWidth * ratio)),
    end: centerAt(1),
  }
}
