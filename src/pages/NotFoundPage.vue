<template>
  <section class="page-not-found">
    <BaseHeading variant="h1">Страница не найдена</BaseHeading>
    <BaseHeading variant="h1" class="page-not-found__error">404</BaseHeading>

    <BaseHeading variant="h3" class="page-not-found__text">
      Вы будете перенаправлены на главную страницу через
    </BaseHeading>
    <CountDownTimer :timeout="5" @onTimerEnd="redirectToHomepage" />
  </section>
</template>

<script setup>
import BaseHeading from "@/components/UI/BaseHeading.vue";
import CountDownTimer from "@/components/CountDownTimer.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const redirectToHomepage = () => {
  router.replace("/");
};
</script>

<style scoped>
.page-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.page-not-found__text {
  color: lightgray;
}

.page-not-found__error {
  color: #ef2525;
}
</style>
