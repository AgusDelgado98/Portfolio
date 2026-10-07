/**
 * Number formatting for Home's metrics. Hand-rolled (not Intl) so the output is
 * identical in every browser and in Node's test runner: "9,2 %" in Spanish,
 * "9.2%" in English.
 */
export function formatPercent(fraction, language = 'es', digits = 1) {
  const text = (Number(fraction) * 100).toFixed(digits)
  return language === 'en' ? `${text}%` : `${text.replace('.', ',')} %`
}

/** A plain number rounded to `digits` decimals ("135"). */
export function formatNumber(value, language = 'es', digits = 0) {
  const text = Number(value).toFixed(digits)
  return language === 'en' ? text : text.replace('.', ',')
}
