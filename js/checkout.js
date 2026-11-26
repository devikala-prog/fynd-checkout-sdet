// Checkout controller. The synchronous `isSubmitting` guard prevents rapid duplicate submits.
window.Checkout = (() => {
  let isSubmitting = false;
  let completedOrder = null;
  let referenceCounter = 0;

  function createReference() {
    referenceCounter += 1;
    return `NS-${String(referenceCounter).padStart(6, "0")}`;
  }

  function placeOrder({ name, items, totalPaise }) {
    if (isSubmitting || completedOrder) return { status: "ignored" };
    isSubmitting = true;
    try {
      const order = {
        reference: createReference(),
        customerName: name.trim(),
        items: items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, lineTotalPaise: item.lineTotalPaise })),
        totalPaise,
        placedAt: new Date().toISOString()
      };
      completedOrder = order;
      return { status: "success", order };
    } finally {
      isSubmitting = false;
    }
  }

  function getCompletedOrder() { return completedOrder; }
  return { placeOrder, getCompletedOrder };
})();
