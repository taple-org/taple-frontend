<script setup lang="ts">
import type { ITariffCard } from "~/interfaces/landing.interfaces";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{
  card: ITariffCard;
}>();
</script>
<template>
  <article class="tariff">
    <header class="tariff__header">
      <h4 class="tariff__title">{{ card.name }}</h4>
      <span class="tariff__description">{{ card.description }}</span>
    </header>
    <div class="tariff__pricing">
      <span class="pricing__price">{{ card.pricing.price }}</span>
      <span class="pricing__time"> / {{ card.pricing.time }}</span>
    </div>
    <ul class="tariff__features">
      <li v-for="feature in card.features" class="features__item">
        <Icon name="my-icon-check" class="feature__check-icon" />
        <span class="feature__label">{{ feature }}</span>
      </li>
    </ul>
    <ui-button variant="outline">{{ t("landing.registerBtn") }}</ui-button>
  </article>
</template>
<style scoped>
.tariff {
  padding: 32px 24px 24px;
  border-radius: 16px;
  border: var(--color-neutral-ld);
  box-shadow: 0 5px 19px 0 var(--color-neutral-lm);

  display: flex;
  flex-direction: column;
  gap: 32px;
}

.tariff__header {
  padding-bottom: 16px;
}

.tariff__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

.tariff__description {
  font-size: 16px;
  font-weight: 400;
  color: var(--color-neutral-ld);
}

.pricing__price {
  font-size: 64px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

.pricing__time {
  font-weight: 400;
  font-size: 16px;
  color: var(--color-neutral-ld);
}

.features__item {
  display: flex;
  gap: 8px;
}

.feature__check-icon {
  width: 24px;
  height: 24px;
  color: green;
}

.feature__label {
  font-weight: 400;
  font-size: 16px;
  color: var(--color-neutral-dd);
}
</style>
