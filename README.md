# Northstar Store — Mini Checkout & Browser Test Suite

## Overview
A single-page synthetic e-commerce checkout application built for the Fynd SDET Intern Mini Checkout challenge. It supports a 20-product catalogue, search, category filters, cart operations, exact totals, required-name validation and single order confirmation.

## Technology
- HTML5, Vanilla JavaScript
- Tailwind CSS CDN and custom CSS
- Playwright Test with TypeScript
- Chromium
- `serve` static server

## Setup
Requirements: Node.js 18+ and npm.

```bash
npm install
npx playwright install chromium
```

## Run the application manually
```bash
npx serve -l 4173 .
```
Open `http://127.0.0.1:4173`.

## Run browser tests
Playwright starts the static server automatically through `webServer` in `playwright.config.ts`.

```bash
npx playwright test
npx playwright show-report
```

For headed execution:
```bash
npx playwright test --headed
```

## Features
- 20 synthetic products with fixed prices.
- Product search by name and description.
- Audio, Accessories, Storage and Peripherals category filters.
- Add/remove products and quantity adjustments.
- Automatic line totals and order total.
- Required customer-name and empty-cart validation.
- Preserves cart and customer input after validation errors.
- Unique order reference and duplicate-submission protection.
- Responsive product catalogue and sticky checkout sidebar.

Prices are stored as integer paise to avoid floating-point currency calculation errors. No backend, database or payment service is used.

## Automated test cases

| ID | Scenario | Main assertion |
|---|---|---|
| TC-01 | Successful checkout | Confirmation, customer name and reference appear |
| TC-02 | Missing name | Validation appears; cart is preserved; valid retry succeeds |
| TC-03 | Quantity calculation | Quantity and exact line/order totals |
| TC-04 | Product catalogue and search | 20 products initially; matching and no-result states |
| TC-05 | Category filtering | Audio filter shows four expected products |
| TC-06 | Remove product | Cart empties and total returns to ₹0.00 |
| TC-07 | Multiple-product calculation | Mouse + keyboard total is ₹2,298.00 |

Each test uses a fresh Playwright browser context and retrying `expect` assertions rather than fixed sleeps.

**Execution note:** The earlier three-test suite was reported as 3 passed, 0 failed, 0 skipped. The expanded seven-test suite must be run after updating `tests/checkout.spec.ts`; the earlier result does not establish that all seven tests pass. See `RESULTS.md`.

## Manual testing
- MT-01: Empty-cart checkout.
- MT-02: Rapid double-click protection.

The user reported both manual checks passed and reported capturing a screen recording. Copy the actual recording and any screenshots into an `evidence/` folder in the project; do not claim files are included until copied there.

## Reports and artifacts
- HTML report: `playwright-report/`
- Failure artifacts: `test-results/`

## Limitations
- No backend or database; order state exists in browser memory.
- No real payment processing.
- Synthetic fixed product catalogue.
- Tailwind CSS is loaded from a CDN, so CDN styling requires internet access.
