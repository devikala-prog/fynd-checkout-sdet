
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  // Verify a clean initial application state.
  await expect(page.getByTestId("cart-count")).toHaveText("0 items");
  await expect(page.getByTestId("order-total")).toHaveText("₹0.00");
});

// TC-01: Successful checkout
test("TC-01: successful checkout shows one confirmation and reference", async ({ page }) => {
  await page.getByRole("button", { name: "Add Wireless Mouse to cart" }).click();
  await page.getByRole("button", { name: "Add Mechanical Keyboard to cart" }).click();

  await page.getByTestId("customer-name").fill("Asha Kumar");
  await page.getByTestId("place-order").click();

  await expect(page.getByTestId("confirmation")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();

  await expect(page.getByTestId("confirmation")).toContainText("Asha Kumar");
  await expect(page.getByTestId("order-reference")).toHaveText(/^NS-\d{6}$/);
  await expect(page.getByTestId("place-order")).toBeDisabled();
});

// TC-02: Missing name validation
test("TC-02: missing customer name blocks checkout and preserves cart", async ({ page }) => {
  await page.getByRole("button", { name: "Add Wireless Mouse to cart" }).click();
  await page.getByTestId("place-order").click();

  await expect(page.getByTestId("name-error"))
    .toHaveText("Please enter your name.");

  await expect(page.getByTestId("confirmation")).toBeHidden();
  await expect(page.getByTestId("cart-count")).toHaveText("1 item");
  await expect(page.getByTestId("order-total")).toHaveText("₹799.00");

  await page.getByTestId("customer-name").fill("Asha Kumar");

  await expect(page.getByTestId("name-error")).toBeHidden();

  await page.getByTestId("place-order").click();

  await expect(page.getByTestId("confirmation")).toBeVisible();
});

// TC-03: Quantity calculation
test("TC-03: quantity change updates exact line and order totals", async ({ page }) => {
  await page.getByRole("button", { name: "Add Wireless Mouse to cart" }).click();

  await page.getByRole("button", {
    name: "Increase Wireless Mouse quantity"
  }).click();

  await expect(page.getByTestId("quantity-wireless-mouse")).toHaveText("2");

  await expect(page.getByTestId("line-total-wireless-mouse"))
    .toHaveText("₹1,598.00");

  await expect(page.getByTestId("order-total"))
    .toHaveText("₹1,598.00");
});

// TC-04: Product catalogue and search
test("TC-04: displays 20 products and filters search results", async ({ page }) => {
  const productCards = page.locator("#product-list article");

  // Verify all 20 products are displayed initially.
  await expect(productCards).toHaveCount(20);

  await expect(page.getByText("Showing 20 of 20 products"))
    .toBeVisible();

  // Search for a specific product.
  await page.getByRole("searchbox", {
    name: "Search products"
  }).fill("Wireless Mouse");

  await expect(productCards).toHaveCount(1);

  await expect(
    page.getByTestId("product-wireless-mouse")
  ).toBeVisible();

  await expect(page.getByText("Showing 1 of 20 products"))
    .toBeVisible();

  // Verify unmatched searches show the empty state.
  await page.getByRole("searchbox", {
    name: "Search products"
  }).fill("NonexistentProduct");

  await expect(page.getByText("No products found"))
    .toBeVisible();

  await expect(productCards).toHaveCount(0);
});

// TC-05: Category filtering
test("TC-05: Audio filter displays only audio products", async ({ page }) => {
  await page.getByRole("button", {
    name: "Audio",
    exact: true
  }).click();

  const productCards = page.locator("#product-list article");

  await expect(productCards).toHaveCount(4);

  await expect(
    page.getByTestId("product-wireless-headphones")
  ).toBeVisible();

  await expect(
    page.getByTestId("product-bluetooth-speaker")
  ).toBeVisible();

  await expect(
    page.getByTestId("product-wireless-earbuds")
  ).toBeVisible();

  await expect(
    page.getByTestId("product-desk-microphone")
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Audio", exact: true })
  ).toHaveAttribute("aria-pressed", "true");

  await expect(page.getByText("Showing 4 of 20 products"))
    .toBeVisible();
});

// TC-06: Remove product
test("TC-06: removing a product updates cart and order total", async ({ page }) => {
  await page.getByRole("button", {
    name: "Add Wireless Mouse to cart"
  }).click();

  await expect(page.getByTestId("order-total"))
    .toHaveText("₹799.00");

  await page.getByRole("button", {
    name: "Remove",
    exact: true
  }).click();

  await expect(page.getByTestId("cart-count"))
    .toHaveText("0 items");

  await expect(page.getByTestId("order-total"))
    .toHaveText("₹0.00");

  await expect(page.getByText("Your bag is empty"))
    .toBeVisible();
});

// TC-07: Multiple product calculations
test("TC-07: multiple products produce the correct combined total", async ({ page }) => {
  await page.getByRole("button", {
    name: "Add Wireless Mouse to cart"
  }).click();

  await page.getByRole("button", {
    name: "Add Mechanical Keyboard to cart"
  }).click();

  await expect(page.getByTestId("cart-count"))
    .toHaveText("2 items");

  // ₹799 + ₹1,499 = ₹2,298
  await expect(page.getByTestId("order-total"))
    .toHaveText("₹2,298.00");

  await expect(page.getByTestId("line-total-wireless-mouse"))
    .toHaveText("₹799.00");

  await expect(page.getByTestId("line-total-mechanical-keyboard"))
    .toHaveText("₹1,499.00");
});
