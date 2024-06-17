<template>
  <div class="category-tabs">
    <ul class="category-tabs__list">
      <li
          v-for="category in items"
          :key="category"
          :class="{ active: category === selectedCategory }"
          @click="selectCategory(category)"
      >
        {{ category }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['onCategoryClick']);

const selectedCategory = ref('all');

const selectCategory = (category) => {
  selectedCategory.value = category;
  emit('onCategoryClick', category);
};
</script>

<style scoped>
.category-tabs {
  margin-bottom: 20px;
}

.category-tabs__list {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
}

.category-tabs__list li {
  cursor: pointer;
  transition: color 0.3s;
}

.category-tabs__list li.active {
  color: #ffa801;
}

.category-tabs__list li:hover {
  color: #ffa801;
}
</style>
