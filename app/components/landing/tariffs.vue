<script lang="ts" setup>
import type {ITariffCard} from "~/interfaces/landing";
const cards: ITariffCard[] = [
  {
    name: 'Plan 1',
    description: 'For individuals',
    pricing: {
      price: 2,
      time: 'month'
    },
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    name: 'Plan 1',
    description: 'For individuals',
    pricing: {
      price: 2,
      time: 'month'
    },
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    name: 'Plan 1',
    description: 'For individuals',
    pricing: {
      price: 2,
      time: 'month'
    },
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  }
]
</script>
<template>
  <section class="tariffs">
    <ui-container class="tariffs__inner" :padding="[30, 15]">
      <h3 class="tariffs__title">
        Тарифы
      </h3>
      <ul class="tariffs__list">
        <li v-for="tariff in cards" class="tariffs__item">
          <landing-tariff-card :card="tariff" />
        </li>
      </ul>
    </ui-container>
  </section>
</template>
<style scoped>

.tariffs__title{
  font-weight: bold;
  font-size: 24px;
  color: var(--color-neutral-dd);
  padding-bottom: 10px;
}
.tariffs__list{
  display: flex;
  gap: 10px;
}
.tariffs__item{
  flex-grow: 1;
}
</style>