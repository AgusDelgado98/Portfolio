/**
 * PROVIDENTIA — real numbers behind Home's visuals (PLAN-FROZEN F3 / F3A §4).
 *
 * Every figure is copied from a frozen file of the public evidence packs
 * (public/casework/**); `visual/data.test.js` re-reads those files and fails if
 * a value here drifts. Nothing is parsed at runtime and nothing is invented —
 * in particular there is NO time series: the repo only holds a PNG of one.
 *
 * Policy trade-off — public/casework/capacity-decision/evidence-pack/policy_tradeoff.csv
 *   rows: evaluation_label = FINAL_LOCKED_EVALUATION, model_id = ets_aicc
 *   meanBuffer      <- mean_buffer
 *   exceedanceRate  <- exceedance_rate
 *   PI90 is the `reference` row: the policy frozen before the lockbox opened.
 */
export const POLICY_TRADEOFF = Object.freeze([
  Object.freeze({ id: 'PI80', level: 0.8, meanBuffer: 100.34399551066218, exceedanceRate: 0.1091470258136924 }),
  Object.freeze({ id: 'PI90', level: 0.9, meanBuffer: 134.9385521885522, exceedanceRate: 0.0606060606060606 }),
  Object.freeze({ id: 'PI95', level: 0.95, meanBuffer: 168.37149270482604, exceedanceRate: 0.0356341189674523 }),
])

/** The policy frozen before the lockbox was opened (`evaluation_role = reference`). */
export const REFERENCE_POLICY_ID = 'PI90'

/**
 * Point accuracy, FINAL_LOCKED_EVALUATION — public/casework/demand-forecasting/evidence-pack/forecasting_metrics.csv
 * (metric_family = point, metric_id = wape). `ets_aicc` is the frozen primary model.
 */
export const FINAL_WAPE = Object.freeze({
  ets: 0.0915211380161353,
  naive: 0.1068545529129435,
  seasonalNaive: 0.1397697711887405,
})

/**
 * Prediction-interval calibration of the primary model, same file
 * (metric_family = interval, metric_id = coverage, level = 0.9, FINAL_LOCKED_EVALUATION).
 */
export const FINAL_PI90_COVERAGE = Object.freeze({ nominal: 0.9, observed: 0.8956228956228957 })

/**
 * Mean interval width of the primary model at PI80 / PI90 / PI95 (same file,
 * metric_id = mean_width, FINAL_LOCKED_EVALUATION). Home's hero draws its three
 * nested bands with these RATIOS (1 : 1.34 : 1.68); the series itself is
 * illustrative and the hero says so.
 */
export const FINAL_MEAN_WIDTH = Object.freeze([200.69142064841455, 269.87319522799174, 336.7370992652393])

export const BAND_RATIOS = Object.freeze(FINAL_MEAN_WIDTH.map((width) => width / FINAL_MEAN_WIDTH[0]))
