import { BASE_URL } from '@/constants/constants';
import { createStore } from 'vuex';

export default createStore({
  state: {
    products: [],
    cart: [],
    likes: [],
    isCartModalOpen: false,
    isLikesModalOpen: false,
  },
  getters: {
    categories(state) {
      const tmp = state.products.map((product) => product.category);
      tmp.unshift('all');
      return [...new Set(tmp)];
    },

    product: (state) => (id) => {
      return state.cart.find((productItem) => productItem.id === id);
    },

    like: (state) => (id) => {
      return state.likes.find((productItem) => productItem.id === id);
    },

    cartTotalProductsQuantity(state) {
      if (state.cart.length === 0) return;
      return state.cart.reduce((totalQuantity, product) => totalQuantity + product.quantity, 0);
    },

    cartTotalLikes(state) {
      if (state.likes.length === 0) return;
      return state.likes.length;
    },
  },
  mutations: {
    setLikes(state, payload) {
      state.likes.push(payload.product);
    },

    unLike(state, payload) {
      state.likes = state.likes.filter((product) => product.id !== payload.productId);
    },

    setProducts(state, payload) {
      state.products = payload.products;
    },

    setProductsToCart(state, payload) {
      state.cart.push(payload.product);
    },

    deleteProduct(state, payload) {
      state.cart = state.cart.filter((product) => product.id !== payload.productId);
    },

    openModal(state, payload) {
      const { type } = payload;
      switch (type) {
        case 'cart':
          state.isCartModalOpen = true;
          break;
        case 'likes':
          state.isLikesModalOpen = true;
          break;
        default:
          state.isCartModalOpen = true;
      }
    },

    closeModal(state, payload) {
      const { type } = payload;
      switch (type) {
        case 'cart':
          state.isCartModalOpen = false;
          break;
        case 'likes':
          state.isLikesModalOpen = false;
          break;
        default:
          state.isCartModalOpen = false;
      }
    },

    incrementQuantity(_, payload) {
      payload.product.quantity++;
    },

    decrementQuantity(_, payload) {
      payload.product.quantity--;
    },
  },
  actions: {
    async fetchProducts({ commit }) {
      try {
        const response = await fetch(BASE_URL);

        if (!response.ok) throw new Error('Something went wrong');

        const products = await response.json();
        commit('setProducts', { products });
      } catch (error) {
        console.log('error:', error);
      }
    },

    setLikes({ commit, getters }, product) {
      const likedProduct = getters.like(product.id);
      if (likedProduct) {
        commit('unLike', { productId: product.id });
        return;
      }
      commit('setLikes', { product });
    },

    setProductsToCart({ commit }, product) {
      commit('setProductsToCart', { product });
      commit('openModal', {type: 'cart'});
    },

    openModal({ commit }, type) {
      commit('openModal', { type: type });
    },

    closeModal({ commit }, type) {
      commit('closeModal', { type });
    },

    incrementQuantity({ commit, getters }, productId) {
      const product = getters.product(productId);
      commit('incrementQuantity', { product });
    },

    decrementQuantity({ commit, getters }, productId) {
      const product = getters.product(productId);
      commit('decrementQuantity', { product });
    },

    deleteProduct({ commit }, productId) {
      commit('deleteProduct', { productId });
    },
  },
  modules: {},
});
