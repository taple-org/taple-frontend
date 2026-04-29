<script lang="ts" setup>
import type { ITariffCard } from "~/interfaces/landing.interfaces";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const cards: ITariffCard[] = [
  {
    name: t("landing.planStarterName"),
    description: t("landing.planStarterDescription"),
    pricing: {
      price: 2,
      time: t("landing.planBillingPeriod"),
    },
    features: [
      t("landing.planStarterFeature1"),
      t("landing.planStarterFeature2"),
      t("landing.planStarterFeature3"),
    ],
  },
  {
    name: t("landing.planTeamName"),
    description: t("landing.planTeamDescription"),
    pricing: {
      price: 2,
      time: t("landing.planBillingPeriod"),
    },
    features: [
      t("landing.planTeamFeature1"),
      t("landing.planTeamFeature2"),
      t("landing.planTeamFeature3"),
    ],
  },
  {
    name: t("landing.planBusinessName"),
    description: t("landing.planBusinessDescription"),
    pricing: {
      price: 2,
      time: t("landing.planBillingPeriod"),
    },
    features: [
      t("landing.planBusinessFeature1"),
      t("landing.planBusinessFeature2"),
      t("landing.planBusinessFeature3"),
    ],
  },
];
</script>
<template>
  <section class="tariffs" id="tariffs">
    <ui-container class="tariffs__inner" :padding="[30, 15]">
      <h3 class="tariffs__title">
        {{ t("landing.pricingTitle") }}
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
.tariffs__title {
  font-weight: bold;
  font-size: 24px;
  color: var(--color-neutral-dd);
  padding-bottom: 10px;
}

.tariffs__list {
  display: flex;
  gap: 10px;
}

.tariffs__item {
  flex-grow: 1;
}
</style>
