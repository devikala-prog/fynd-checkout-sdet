# Test Execution Results — Northstar Store Mini Checkout

## 1. Execution record
**Project:** Northstar Store — Mini Checkout and Browser Test Suite  
**Target browser:** Chromium  
**Framework:** Playwright Test with TypeScript  
**Documentation update date:** 26 November 2026

This report separates the earlier three-test run from the expanded seven-test suite. The earlier results must not be represented as evidence that the expanded suite passed.

## 2. Earlier automated execution — original suite
The user reported the following result for the original three automated tests:

| Metric | Reported result |
|---|---:|
| Passed | 3 |
| Failed | 0 |
| Skipped | 0 |

Reported scenarios: TC-01 successful checkout, TC-02 missing-name validation, TC-03 quantity calculation.

## 3. Expanded automated suite — TC-01 through TC-07

| Test ID | Scenario | Status |
|---|---|---|
| TC-01 | Successful checkout | PENDING — rerun expanded suite |
| TC-02 | Missing customer name | PENDING — rerun expanded suite |
| TC-03 | Quantity calculation | PENDING — rerun expanded suite |
| TC-04 | Product catalogue and search | PENDING — new test |
| TC-05 | Category filtering | PENDING — new test |
| TC-06 | Remove product | PENDING — new test |
| TC-07 | Multiple-product calculation | PENDING — new test |

**Expanded-suite totals:** Not yet reported. Run `npx playwright test` and replace pending statuses with actual results. Do not assume seven passes.

## 4. Manual exploratory results
The user reported completing both manual checks and observing expected behavior.

| Test ID | Scenario | User-reported result |
|---|---|---|
| MT-01 | Empty-cart checkout validation | PASS |
| MT-02 | Rapid double-click protection | PASS |

The user also reported that a screen recording was captured. Copy the actual recording into `evidence/` and record its filename before final submission.

## 5. Defect summary
No defects were reported from the scenarios described above. This is limited to the tests described above and does not establish that the application is free of all possible defects. The expanded automated suite remains pending execution.

## 6. Evidence
- Earlier three-test result: user-reported 3 passed, 0 failed, 0 skipped.
- Manual checks: user-reported MT-01 and MT-02 passed.
- Screen recording: reported as captured; copy the actual file into `evidence/`.
- Expanded seven-test HTML report: pending execution.

After execution, Playwright generates the HTML report in `playwright-report/`; failure artifacts are stored in `test-results/` according to configuration.

## 7. Final execution commands
```bash
npm install
npx playwright install chromium
npx playwright test
npx playwright show-report
```

After the expanded run, update Section 3 with the actual execution date, browser, pass/fail/skip counts and any observed failures.
