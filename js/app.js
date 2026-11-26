
(() => {
  const productList = document.querySelector("#product-list");
  const cartItems = document.querySelector("#cart-items");
  const cartEmpty = document.querySelector("#cart-empty");
  const cartCount = document.querySelector("#cart-count");
  const subtotal = document.querySelector("#subtotal");
  const orderTotal = document.querySelector("#order-total");

  const form = document.querySelector("#checkout-form");
  const nameInput = document.querySelector("#customer-name");
  const nameError = document.querySelector("#name-error");
  const checkoutError = document.querySelector("#checkout-error");
  const placeOrderButton = document.querySelector("#place-order");

  const confirmation = document.querySelector("#confirmation");
  const confirmationMessage = document.querySelector("#confirmation-message");
  const orderReference = document.querySelector("#order-reference");

  const searchInput = document.querySelector("#product-search");
  const categoryFilters = document.querySelector("#category-filters");
  const resultCount = document.querySelector("#product-result-count");
  const noProducts = document.querySelector("#no-products");

  let selectedCategory = "All";
  let searchQuery = "";

  const categories = {
    "wireless-mouse": "Peripherals",
    "mechanical-keyboard": "Peripherals",
    "wireless-headphones": "Audio",
    "smart-watch": "Accessories",
    "bluetooth-speaker": "Audio",
    "power-bank": "Accessories",
    "usb-c-hub": "Peripherals",
    "laptop-stand": "Accessories",
    "webcam": "Peripherals",
    "gaming-mouse-pad": "Accessories",
    "usb-flash-drive": "Storage",
    "external-ssd": "Storage",
    "laptop-backpack": "Accessories",
    "wireless-earbuds": "Audio",
    "monitor-light-bar": "Accessories",
    "hdmi-cable": "Peripherals",
    "ssd-case": "Storage",
    "desk-microphone": "Audio",
    "cooling-pad": "Peripherals",
    "phone-stand": "Accessories"
  };

  const categoryVisuals = {
    Audio: ["#fce7f3", "#fdf2f8"],
    Accessories: ["#e0e7ff", "#eef2ff"],
    Storage: ["#d1fae5", "#ecfdf5"],
    Peripherals: ["#e0f2fe", "#eff6ff"]
  };

  function getCategory(product) {
    return categories[product.id] || "Accessories";
  }

  function renderProducts() {
    const filtered = window.PRODUCTS.filter(product => {
      const matchesCategory =
        selectedCategory === "All" ||
        getCategory(product) === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesSearch;
    });

    resultCount.textContent =
      `Showing ${filtered.length} of ${window.PRODUCTS.length} products`;

    noProducts.classList.toggle("hidden", filtered.length > 0);
    productList.classList.toggle("hidden", filtered.length === 0);

    productList.innerHTML = filtered.map(product => {
      const category = getCategory(product);
      const colors = categoryVisuals[category] || ["#eef2ff", "#f5f3ff"];

      return `
        <article
          class="product-card"
          data-testid="product-${product.id}"
          style="--visual-start:${colors[0]};--visual-end:${colors[1]}"
        >
          <div class="product-visual">
            <span class="product-emoji" aria-hidden="true">${product.icon}</span>
          </div>

          <div class="p-4 sm:p-5">
            <div class="mb-3 flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                ${category}
              </span>
              <span class="text-[10px] font-semibold text-slate-400">NORTHSTAR</span>
            </div>

            <h3 class="font-display text-sm font-extrabold text-slate-900">
              ${product.name}
            </h3>

            <p class="mt-1 min-h-9 text-xs leading-5 text-slate-500">
              ${product.description}
            </p>

            <div class="mt-5 flex items-center justify-between gap-2">
              <span class="font-display text-base font-extrabold text-slate-950">
                ${product.displayPrice}
              </span>

              <button
                type="button"
                class="product-add-button"
                data-action="add"
                data-product-id="${product.id}"
                aria-label="Add ${product.name} to cart"
              >
                Add +
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderCart() {
    const items = window.Cart.getItems();
    const count = window.Cart.getCount();
    const total = window.Cart.getTotalPaise();

    cartCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;

    subtotal.textContent = window.Cart.formatMoney(total);
    orderTotal.textContent = window.Cart.formatMoney(total);

    cartEmpty.classList.toggle("hidden", items.length > 0);
    cartItems.classList.toggle("hidden", items.length === 0);

    cartItems.innerHTML = items.map(item => `
      <div
        class="flex items-center justify-between gap-3 py-4"
        data-testid="cart-row-${item.id}"
      >
        <div class="min-w-0">
          <p class="truncate text-sm font-bold text-slate-800">
            ${item.name}
          </p>

          <p class="mt-1 text-xs text-slate-500">
            ${window.Cart.formatMoney(item.pricePaise)} each
          </p>

          <button
            type="button"
            class="mt-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
            data-action="remove"
            data-product-id="${item.id}"
          >
            Remove
          </button>
        </div>

        <div class="shrink-0 text-right">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="quantity-button"
              data-action="decrease"
              data-product-id="${item.id}"
              aria-label="Decrease ${item.name} quantity"
            >−</button>

            <span
              class="w-5 text-center text-sm font-bold"
              data-testid="quantity-${item.id}"
            >${item.quantity}</span>

            <button
              type="button"
              class="quantity-button"
              data-action="increase"
              data-product-id="${item.id}"
              aria-label="Increase ${item.name} quantity"
            >+</button>
          </div>

          <p
            class="mt-2 text-sm font-bold"
            data-testid="line-total-${item.id}"
          >
            ${window.Cart.formatMoney(item.lineTotalPaise)}
          </p>
        </div>
      </div>
    `).join("");
  }

  function showCheckoutError(message) {
    checkoutError.textContent = message;
    checkoutError.classList.remove("hidden");
  }

  function clearErrors() {
    checkoutError.textContent = "";
    checkoutError.classList.add("hidden");

    nameError.textContent = "";
    nameError.classList.add("hidden");

    nameInput.removeAttribute("aria-invalid");
  }

  function renderConfirmation(order) {
    confirmationMessage.textContent =
      `Thanks, ${order.customerName}. Your order has been placed successfully.`;

    orderReference.textContent = order.reference;

    confirmation.classList.remove("hidden");

    placeOrderButton.disabled = true;
    placeOrderButton.textContent = "Order placed";
  }

  // Product search
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderProducts();
  });

  // Category filtering
  categoryFilters.addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");

    if (!button) return;

    selectedCategory = button.dataset.category;

    categoryFilters.querySelectorAll("button[data-category]").forEach(chip => {
      const active = chip === button;

      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", String(active));
    });

    renderProducts();
  });

  // Add products
  productList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action='add']");

    if (!button || window.Checkout.getCompletedOrder()) return;

    window.Cart.add(button.dataset.productId);
    renderCart();
  });

  // Cart controls
  cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button || window.Checkout.getCompletedOrder()) return;

    const { action, productId } = button.dataset;

    const item = window.Cart.getItems().find(
      entry => entry.id === productId
    );

    if (action === "remove") {
      window.Cart.remove(productId);
    }

    if (action === "increase" && item) {
      window.Cart.setQuantity(productId, item.quantity + 1);
    }

    if (action === "decrease" && item) {
      window.Cart.setQuantity(productId, item.quantity - 1);
    }

    renderCart();
  });

  // Name field validation feedback
  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim()) {
      nameError.textContent = "";
      nameError.classList.add("hidden");
      nameInput.removeAttribute("aria-invalid");
    }
  });

  // Checkout submission
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (window.Checkout.getCompletedOrder()) return;

    clearErrors();

    const items = window.Cart.getItems();

    const errors = window.CheckoutValidation.validate(
      nameInput.value,
      items
    );

    if (errors.cart) {
      showCheckoutError(errors.cart);
    }

    if (errors.name) {
      nameError.textContent = errors.name;
      nameError.classList.remove("hidden");
      nameInput.setAttribute("aria-invalid", "true");
    }

    if (Object.keys(errors).length) return;

    const result = window.Checkout.placeOrder({
      name: nameInput.value,
      items,
      totalPaise: window.Cart.getTotalPaise()
    });

    if (result.status === "success") {
      renderConfirmation(result.order);
    }
  });

  // Initial rendering
  renderProducts();
  renderCart();

})();
