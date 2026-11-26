// Cart state and pure calculation helpers.
window.Cart = (() => {
  const quantities = new Map();

  function add(productId) {
    quantities.set(productId, (quantities.get(productId) || 0) + 1);
  }
  function setQuantity(productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      quantities.delete(productId);
      return;
    }
    quantities.set(productId, quantity);
  }
  function remove(productId) { quantities.delete(productId); }
  function clear() { quantities.clear(); }
  function getItems() {
    return [...quantities.entries()].map(([id, quantity]) => {
      const product = window.PRODUCTS.find(p => p.id === id);
      return product ? { ...product, quantity, lineTotalPaise: product.pricePaise * quantity } : null;
    }).filter(Boolean);
  }
  function getCount() { return [...quantities.values()].reduce((sum, quantity) => sum + quantity, 0); }
  function getTotalPaise() { return getItems().reduce((sum, item) => sum + item.lineTotalPaise, 0); }
  function formatMoney(paise) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(paise / 100);
  }
  return { add, setQuantity, remove, clear, getItems, getCount, getTotalPaise, formatMoney };
})();
