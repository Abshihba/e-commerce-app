<template>
  <div class="delivery-location">
    <BaseHeading variant="h3" v-if="isLocationVisible">
      <span class="delivery-location__title">Ваше местоположение:</span>
      {{ location }}
    </BaseHeading>
    <div v-if="!isSelected" class="delivery-location__confirm-block">
      <BaseHeading variant="h3">Это правильно?</BaseHeading>
      <div class="delivery-location__actions">
        <BaseButton variant="outlined" @click="confirm(false)">Нет</BaseButton>
        <BaseButton variant="contained" mode="success" @click="confirm(true)"
        >Да</BaseButton
        >
      </div>
    </div>

    <h3 v-if="isSelected" :class="[isCorrectRegion ? 'success' : 'fail']">
      {{ message }}
    </h3>
  </div>
</template>

<script setup>
import BaseButton from "./UI/Buttons/BaseButton.vue";
import BaseHeading from "./UI/BaseHeading.vue";
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

const MESSAGE_SUCCESS = "Спасибо. Ваш регион будет установлен автоматически.";
const MESSAGE_FAIL =
    "Извините. Пожалуйста, введите ваш регион доставки вручную в форме ниже.";

const emit = defineEmits(["onConfirmLocationClick"]);
const props = defineProps({
  location: {
    type: String,
    required: true,
  },
});

const isCorrectRegion = ref(false);
const isSelected = ref(false);

const confirm = (isConfirmed) => {
  isCorrectRegion.value = isConfirmed;
  isSelected.value = true;
  emit("onConfirmLocationClick", isConfirmed);
};

const message = computed(() =>
    isCorrectRegion.value ? MESSAGE_SUCCESS : MESSAGE_FAIL
);

const isLocationVisible = computed(
    () =>
        (props.location && !isSelected.value) ||
        (props.location && isSelected.value && isCorrectRegion.value)
);
</script>

<style scoped>
.delivery-location {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.delivery-location__title {
  color: lightgray;
}

.delivery-location__confirm-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.delivery-location__actions {
  display: flex;
  gap: 20px;
}

.success {
  color: #5ec343;
}

.fail {
  color: #ef2525;
}
</style>
