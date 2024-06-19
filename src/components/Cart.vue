<template>
  <section class="cart">
    <div class="cart__mobile">
      <div class="cart__grid">
        <label class="cart__title">Фото</label>
        <label class="cart__title">Название</label>
        <label class="cart__title">Цена</label>
        <label class="cart__title">Итого</label>
      </div>
    </div>

    <ul class="cart__list">
      <li class="cart__grid" v-for="product in cart" :key="product.id">
        <img
            :src="product.image"
            class="cart__img"
            :alt="product.title"
            @click="goToProductPage(product.id)"
        />
        <p
            class="cart__item-title cart__item-text"
            @click="goToProductPage(product.id)"
        >
          {{ product.title }}
        </p>

        <div class="cart__mobile">
          <span>Цена:</span>
          <p class="cart__item-text">{{ product.price }} руб.</p>
        </div>

        <div class="cart__mobile">
          <span>Итого:</span>
          <p class="cart__item-text">
            {{ product.price }} руб.
          </p>
        </div>

        <div class="cart__mobile-action">
          <BaseIconButton
              @click="removeProductFromCart(product.id)"
              variant="contained"
              iconHoverColor="#ef2525"
              iconColor="#74747474"
              opacity="1"
          >
            <DeleteIcon />
          </BaseIconButton>
        </div>
      </li>
    </ul>

    <div class="cart__totals-block">
      <span class="cart__totals-block-title">Всего забронировано:</span>
      <p>{{ totalProductsAddedToCart }} шт.</p>
    </div>
    <div class="cart__totals-block">
      <span class="cart__totals-block-title">Общая сумма: </span>
      <p>{{ totalAmount }} руб.</p>
    </div>

    <div class="cart__totals-block" v-if="delivery && delivery.name">
      <span class="cart__totals-block-title">Стоимость доставки:</span>
      <p>{{ !isFreeDelivery ? "" : "Бесплатно" }}{{ deliveryPrice }} руб.</p>
    </div>

    <div class="cart__totals-block" v-if="delivery && delivery.name">
      <span class="cart__totals-block-title">Итого:</span>
      <p>{{ total }} руб.</p>
    </div>
  </section>
</template>

<script setup>
import DeleteIcon from "./icons/DeleteIcon.vue";
import BaseIconButton from "./UI/Buttons/BaseIconButton.vue";
import { computed } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useCartStore } from "@/store/useCartStore";
import { storeToRefs } from "pinia";

const props = defineProps({
  delivery: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["onClick"]);

const router = useRouter();
const cartStore = useCartStore();
const { cart, totalProductsAddedToCart, totalAmount } = storeToRefs(cartStore);

const removeProductFromCart = (id) => {
  cartStore.removeProductFromCart(id);
};

const isFreeDelivery = computed(() => props.delivery.price === 0);

const deliveryPrice = computed(() => {
  if (!props.delivery.name) return;
  return isFreeDelivery.value ? "Бесплатно" : props.delivery.price;
});

const total = computed(() =>
    isFreeDelivery.value ? totalAmount.value : (deliveryPrice.value + totalAmount.value).toFixed(2)
);

const goToProductPage = (id) => {
  router.push(`/product/${id}`);
  emit("onClick", "cart");
};
</script>

<style scoped>
.cart {
  display: grid;
}

.cart__title {
  display: none;
}

.cart__grid {
  display: grid;
  gap: 15px;
  border-bottom: 1px solid lightgray;
}

.cart__mobile {
  display: flex;
  gap: 20px;
  align-items: center;
}

.cart__mobile-action {
  justify-self: start;
  padding: 0 0 10px;
}

.cart__mobile > span {
  font-weight: 600;
}

.cart__list {
  display: grid;
  gap: 20px;
  padding: 0;
  list-style: none;
}

.cart__img {
  display: none;
}

.cart__item-title {
  cursor: pointer;
  justify-self: start;
  text-align: left;
}

.cart__item-title:hover {
  transition: color 0.1s linear;
  color: #ed8939;
}

.cart__item-text {
  font-size: 14px;
}

.cart__totals-block {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  padding: 15px 0 0;
}

.cart__actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.cart__totals-block-title {
  display: block;
  font-weight: 600;
}

@media screen and (min-width: 768px) {
  .cart {
    display: block;
  }
  .cart__grid {
    max-width: 900px;
    margin: auto;
    align-items: center;
    justify-items: center;
    grid-template-columns: 1fr 4fr 1fr 1fr 1fr 1fr;
    grid-gap: 15px;
    color: #222;
    padding: 15px 0;
    border-bottom: 1px солидный светло-серый;
  }

  .cart__title {
    display: block;
    font-weight: 600;
  }

  .cart__img {
    cursor: pointer;
    display: block;
    width: 100%;
    height: 40px;
    object-fit: contain;
  }

  .cart__img:hover {
    opacity: 0.7;
    transition: opacity 0.2s linear;
  }

  .cart__mobile {
    display: contents;
  }

  .cart__mobile > span {
    display: none;
  }

  .cart__mobile-action {
    justify-self: center;
    padding: 0;
  }

  .cart__totals-block {
    padding: 15px 20px 0 0;
  }
}
</style>
