# Case 05 — Claims Contract (PDI)

**Source:** PDI-4 only (`reports/pdi4/`).  
**Contract SHA:** `c8eff4eaa033bd96ecf86f6fdcb1475347bcc70d37b0f41f0db72eca63822bad`  
**Mode:** claim-eligible statements for public evidence. No new metrics.

## Allowed claims

1. SARIMA leads predictive micro-WAPE on the frozen P7 lockbox ledger.  
2. Under SET_A / POLICY_01 / C10, ETS has the lowest point estimate of median normalized decision loss.  
3. Under SET_A / POLICY_01 / C10, ETS vs SARIMA and ETS vs LightGBM are not clearly distinguishable by paired bootstrap (CI crosses 0).  
4. Under C10, ETS POLICY_01 has lower median normalized loss than ETS PI90 (SET_D contrast).  
5. Statement (4) is conditioned on symmetric C10 and must not be generalized as “PI90 is worse”.  
6. Asymmetric cost findings must name C20 / C50 / C100 explicitly.

## Forbidden claims

* Global best model/policy across SET_A–D.  
* Optimal buffer / optimal PI selected from the sensitivity grid.  
* Monetary savings, staffing, observed hospital capacity.  
* Validated Power BI `.pbix` product.  
* Prospective holdout / new lockbox.

## Display labels

| ID | Label |
|---|---|
| C10 | primary (1:1) |
| C05, C20, C50, C100 | sensitivity |
| POLICY_01 | point forecast capacity |
| POLICY_03 / PI90 | incumbent uncertainty-aware reference |
