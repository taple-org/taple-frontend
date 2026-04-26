<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">{{ t("subscription.availablePlans") }}</h2>
      <p class="card-desc">{{ t("subscription.selectPlanDesc") }}</p>
    </div>

    <div class="plans-grid">
      <div
        v-for="plan in availablePlans"
        :key="plan.id"
        class="plan-card"
        :class="{
          'plan-card--current': plan.id === currentPlanId,
          'plan-card--popular': plan.popular,
        }"
      >
        <div v-if="plan.popular" class="plan-popular-badge">
          {{ t("subscription.popular") }}
        </div>
        <div class="plan-card__header">
          <h3 class="plan-card__name">{{ plan.name }}</h3>
          <p class="plan-card__desc">{{ plan.description }}</p>
        </div>
        <div class="plan-card__price">
          <span class="plan-card__amount">${{ plan.price }}</span>
          <span class="plan-card__period">
            {{ t("subscription.perMonthShort") }}</span
          >
        </div>
        <ul class="plan-card__features">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="plan-card__feature"
          >
            <Icon name="my-icon:check" class="feature__icon" />
            <span>{{ feature }}</span>
          </li>
        </ul>
        <ui-button
          :variant="plan.id === currentPlanId ? 'outline' : 'primary'"
          :disabled="plan.id === currentPlanId"
          class="plan-card__cta"
          @click="selectPlan(plan)"
        >
          {{
            plan.id === currentPlanId
              ? t("subscription.currentPlanBtn")
              : t("subscription.selectPlanBtn")
          }}
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const currentPlanId = "pro";

const availablePlans = computed<Plan[]>(() => [
  {
    id: "starter",
    name: "Starter",
    description: t("subscription.starterDesc"),
    price: 9,
    features: [
      t("subscription.starterFeature1"),
      t("subscription.starterFeature2"),
      t("subscription.starterFeature3"),
      t("subscription.starterFeature4"),
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: t("subscription.proDesc"),
    price: 29,
    features: [
      t("subscription.proFeature1"),
      t("subscription.proFeature2"),
      t("subscription.proFeature3"),
      t("subscription.proFeature4"),
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    description: t("subscription.businessDesc"),
    price: 79,
    features: [
      t("subscription.businessFeature1"),
      t("subscription.businessFeature2"),
      t("subscription.businessFeature3"),
      t("subscription.businessFeature4"),
    ],
  },
]);

function selectPlan(plan: Plan) {
  // TODO: navigate to checkout / upgrade flow
  console.log("Switching to plan:", plan.id);
}
</script>

<style scoped>
.settings-card {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px 24px;
}

.card-header {
  margin-bottom: 20px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.plan-card {
  position: relative;
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.plan-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px
    color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.plan-card--current {
  border-color: var(--color-primary);
  background: var(--color-highlight-l);
}

.plan-card--popular {
  border-color: var(--color-primary);
}

.plan-popular-badge {
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 11px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 100px;
  white-space: nowrap;
}

.plan-card__header {
  padding-top: 4px;
}

.plan-card__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.plan-card__desc {
  font-size: 12px;
  color: var(--color-neutral-dl);
}

.plan-card__amount {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

.plan-card__period {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.plan-card__features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.plan-card__feature {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--color-neutral-dm);
}

.feature__icon {
  width: 16px;
  height: 16px;
  color: var(--color-success);
  flex-shrink: 0;
  margin-top: 1px;
}

.plan-card__cta {
  width: 100%;
}

@media (max-width: 700px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
