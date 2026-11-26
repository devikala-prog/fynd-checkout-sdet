# Test Plan — Northstar Store Mini Checkout

## 1. Objective
Validate product discovery and the customer checkout journey: catalogue rendering, search, category filtering, cart operations, exact calculations, required-field validation, order confirmation and duplicate-submission prevention.

## 2. Scope
**In scope:** 20 fixed-price synthetic products; search; category filters; add/remove/quantity changes; totals; required name; empty-cart prevention; confirmation reference; duplicate-submission protection; Chromium browser testing.

**Out of scope:** backend, database, persistence across sessions, payment processing, authentication and external inventory integrations.

## 3. Risk priorities

| Priority | Risk | Reason |
|---|---|---|
| P0 | Incorrect order total | Customer sees an incorrect amount |
| P0 | Missing required name accepted | Incomplete order data |
| P0 | Empty cart submitted | Invalid order |
| P0 | Duplicate submission | Duplicate confirmations |
| P1 | Search/filter returns incorrect products | Product discovery failure |
| P1 | Remove/quantity operation fails to update total | Cart inconsistency |
| P1 | Validation loses entered data | Poor recovery experience |
| P2 | Poor small-screen usability | Accessibility/usability concern |

## 4. Automated test cases

### TC-01 — Successful checkout
**Steps:** In a fresh context, add one Wireless Mouse and one Mechanical Keyboard, enter `Asha Kumar`, and click Place order.  
**Expected:** Confirmation and customer name are visible, reference matches `NS-######`, and Place order is disabled.

### TC-02 — Missing customer name
**Steps:** Add one Wireless Mouse, leave name blank, click Place order, then enter a valid name and retry.  
**Expected:** Required-name validation appears; no first-attempt confirmation; cart and total remain; valid retry succeeds.

### TC-03 — Quantity calculation
**Steps:** Add one Wireless Mouse and increase quantity once.  
**Expected:** Quantity 2, line total ₹1,598.00 and order total ₹1,598.00.

### TC-04 — Product catalogue and search
**Steps:** Load the page, count cards, search `Wireless Mouse`, then search `NonexistentProduct`.  
**Expected:** 20 cards initially; one matching mouse card; unmatched search shows no-products state and zero cards.

### TC-05 — Category filtering
**Steps:** Select Audio and inspect visible products and active filter.  
**Expected:** Exactly four products: Wireless Headphones, Bluetooth Speaker, Wireless Earbuds and Desk Microphone. Audio filter has `aria-pressed="true"`.

### TC-06 — Remove product
**Steps:** Add one Wireless Mouse and click Remove in the cart.  
**Expected:** Cart count is 0 items, total is ₹0.00 and empty-cart state is visible.

### TC-07 — Multiple-product calculation
**Steps:** Add one Wireless Mouse and one Mechanical Keyboard.  
**Expected:** Mouse line total ₹799.00, keyboard line total ₹1,499.00, combined total ₹2,298.00.

## 5. Manual exploratory tests

### MT-01 — Empty cart checkout
**Steps:** Open a fresh session, confirm empty cart, enter a name and click Place order.  
**Expected:** Checkout is blocked, empty-cart message appears, no confirmation appears and name is preserved.  
**Reported observation:** User reported this check passed.

### MT-02 — Rapid double-click
**Steps:** Open a fresh session, add a product, enter a name, rapidly double-click Place order and inspect confirmation/reference.  
**Expected:** Exactly one confirmation and reference; Place order becomes disabled.  
**Reported observation:** User reported this check passed and reported capturing a screen recording.

## 6. Execution and defect reporting
Run `npx playwright test`. Record actual date, browser, counts and observations in `RESULTS.md`. Never mark an unexecuted test as passed. For defects, record ID, severity, browser, reproduction steps, expected and actual results, and evidence. Do not invent defects.
