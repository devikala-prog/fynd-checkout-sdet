window.CheckoutValidation = {
  validate(name, cartItems) {
    const errors = {};
    if (!cartItems.length) errors.cart = "Your cart is empty. Add at least one product before placing an order.";
    if (!name.trim()) errors.name = "Please enter your name.";
    return errors;
  }
};
