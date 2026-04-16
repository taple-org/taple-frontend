<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Доступные планы</h2>
      <p class="card-desc">Выберите план, который подходит вашему бизнесу</p>
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
        <div v-if="plan.popular" class="plan-popular-badge">Популярный</div>
        <div class="plan-card__header">
          <h3 class="plan-card__name">{{ plan.name }}</h3>
          <p class="plan-card__desc">{{ plan.description }}</p>
        </div>
        <div class="plan-card__price">
          <span class="plan-card__amount">${{ plan.price }}</span>
          <span class="plan-card__period"> / мес</span>
        </div>
        <ul class="plan-card__features">
          <li v-for="feature in plan.features" :key="feature" class="plan-card__feature">
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
          {{ plan.id === currentPlanId ? 'Текущий план' : 'Выбрать план' }}
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Plan {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  popular?: boolean
}

const currentPlanId = 'pro'

const availablePlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Для индивидуальных специалистов',
    price: 9,
    features: ['1 000 запросов / мес', '1 рабочее пространство', '1 участник', 'Email-поддержка'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Для небольших команд',
    price: 29,
    features: ['10 000 запросов / мес', '5 рабочих пространств', '10 участников', 'Приоритетная поддержка'],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Для растущего бизнеса',
    price: 79,
    features: ['Безлимитные запросы', 'Неограниченные пространства', 'Неограниченные участники', 'Выделенный менеджер'],
  },
]

function selectPlan(plan: Plan) {
  // TODO: navigate to checkout / upgrade flow
  console.log('Switching to plan:', plan.id)
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
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.plan-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 10%, transparent);
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
  .plans-grid { grid-template-columns: 1fr; }
}
</style>
