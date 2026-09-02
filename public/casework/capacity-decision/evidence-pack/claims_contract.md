# Claims Contract — Case 04 (Capacity Decision Intelligence)

This file reproduces, **verbatim in substance**, the `allowed_claims` /
`forbidden_claims` / `forbidden_report_substrings` / `required_report_substrings`
from PROVIDENTIA's two decision-related claim contracts:
`config/p6_claims.yaml` (development) and `config/p7_claims.yaml` (final
lockbox). Anything built on top of this Evidence Pack — including a future
Portfolio page — **must preserve these boundaries exactly**, not paraphrase
them away.

---

## DEVELOPMENT_DECISION_POLICY_SIMULATION (source: `config/p6_claims.yaml`)

**Allowed claims:**
- required monthly referral-handling capacity under PI90
- development simulated exceedance
- uncertainty buffer
- scenario capacity gap

**Forbidden claims:**
- actual hospital capacity
- actual saturation
- staff shortage
- unmet patient demand
- 95% guaranteed service level
- probability of saturation
- optimal capacity
- monetary savings
- validación final
- appointment slots

**Forbidden report substrings:** actual saturation · staff shortage ·
probability of saturation · optimal capacity · validación final

**Required report substrings:** `development decision-policy simulation` ·
`lockbox`

---

## FINAL_LOCKED_EVALUATION (source: `config/p7_claims.yaml`)

**Allowed claims:**
- final lockbox performance
- simulated policy exceedance on the reserved final period
- required monthly referral-handling capacity under the frozen PI90 policy
- development versus final generalization gap

**Forbidden claims:**
- actual hospital capacity
- actual saturation
- staff shortage
- unmet patient demand
- 95% guaranteed service level
- probability of saturation
- optimal capacity
- monetary savings
- validación final
- appointment slots
- validated forever
- guaranteed 90% future coverage
- optimal hospital capacity
- production-ready clinical capacity
- actual unused capacity
- actual unmet demand

**Forbidden report substrings:** actual saturation · staff shortage ·
probability of saturation · optimal capacity · validación final ·
validated forever · guaranteed 90% future coverage · optimal hospital
capacity · production-ready clinical capacity · actual unused capacity ·
actual unmet demand

**Required report substrings:** `lockbox` · `SEALED`

---

## Policy-specific limits (do not drop these, they are project-specific and not generic boilerplate)

1. **PI90 is the reference decision policy, not an optimum.** `DDR-007`:
   *"PI90 es una elección normativa intermedia, no un óptimo."* PI80 and
   PI95 remain visible scenarios, never hidden alternatives.
2. **`current_capacity` does not exist in the data and is never invented.**
   `config/p6_decision.yaml`: `current_capacity.source: none`,
   `current_capacity.invent: false`. Confirmed again at closure in
   `reports/p6/scenario-register.json` (`current_capacity_source: "none"`,
   `current_capacity_invented: false`). P6/P7 never compute "unused
   capacity" or "shortage" against a real baseline — because that baseline
   was never observed.
3. **No staffing, no real hospital capacity, no guaranteed service level, no
   monetary savings.** Every capacity number here is
   `required_monthly_referral_handling_capacity` under a *simulated*
   protection policy — not FTEs, not beds, not clinics, not a service-level
   guarantee, and not a cost figure.
4. **Referrals ≠ appointments.** The planning interpretation assumes one
   accepted referral eventually requires one first-outpatient appointment
   slot, but rejection, redirection, conversion and scheduling lag are not
   observed (`DDR-001`). This pack never claims referrals equal delivered
   appointments.
5. **The policy was frozen before the lockbox was opened.** `DDR-007` fixed
   `ets_aicc` × `PI90_POLICY` as the reference *before* `B198_FINAL_LOCKBOX_V1`
   was authorized to open. `human-opening-authorization.json`:
   `"policy_immutable_after_opening": true`.
6. **No tuning, no policy change, post-lockbox.** `config/p7_final.yaml`:
   `post_lockbox_tuning: false`, `post_lockbox_selection: false`,
   `ensemble: false`, `max_of_models: false`. `development_vs_final.csv` /
   `decision_metrics.csv` in this pack carry a `policy_changed` column in
   the underlying source files that is `False` on every row — the final
   lockbox numbers are a *report* of the frozen policy's outcome, never a
   trigger to re-pick it.
7. **`excess_units` are not real idle capacity, and `shortfall_units` are
   not observed unmet patient demand.** Both are outputs of a simulation
   against a *forecast*, on a period where no real capacity was ever
   recorded (`reports/p6/decision-intelligence-report.md`: *"Excess units no
   son ocio real. Shortfall no es demanda insatisfecha observada en
   hospital."*).
8. **Board/specialty/series cuts are descriptive only.** Small subgroup
   counts do not authorize ranking hospitals or specialties by performance.
