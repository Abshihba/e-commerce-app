import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
  }),

  getters: {
    isProductsInCart: (state) => state.cart.length > 0,
    totalProductsAddedToCart: (state) => state.cart.reduce((total, product) => total + product.quantity, 0),
    totalAmount: (state) => state.cart.reduce((total, product) => total + product.price * product.quantity, 0),
    productInCart: (state) => (id) => state.cart.find((product) => product.id === id),
  },

  actions: {
    setProductToCart(product) {
      const productInCart = this.productInCart(product.id);

      if (productInCart) {
        productInCart.quantity += product.quantity;
      } else {
        this.cart.push(product);
      }
    },

    setProductsFromLStoCart(products) {
      this.cart = products;
    },

    incrementQuantity(id) {
      const productInCart = this.productInCart(id);
      if (productInCart) {
        productInCart.quantity += 1;
      }
    },

    decrementQuantity(id) {
      const productInCart = this.productInCart(id);
      if (productInCart && productInCart.quantity > 1) {
        productInCart.quantity -= 1;
      } else {
        this.removeProductFromCart(id);
      }
    },

    removeProductFromCart(id) {
      this.cart = this.cart.filter((product) => product.id !== id);
    },

    clearCart() {
      this.cart = [];
    },
  },
});
