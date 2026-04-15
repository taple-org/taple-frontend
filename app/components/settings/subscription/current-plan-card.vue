<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Текущий план</h2>
      <p class="card-desc">Управляйте подпиской и способом оплаты</p>
    </div>

    <div class="current-plan">
      <div class="plan-info">
        <div class="plan-badge">
          <Icon name="my-icon:star-filled" class="plan-badge__icon" />
          <span class="plan-badge__label">{{ currentPlan.name }}</span>
        </div>
        <div class="plan-meta">
          <span class="plan-price">
            ${{ currentPlan.price }}<span class="plan-price__period"> / месяц</span>
          </span>
          <span class="plan-renewal">
            Следующее списание: <strong>{{ currentPlan.renewalDate }}</strong>
          </span>
        </div>
      </div>
      <div class="plan-actions">
        <ui-button variant="outline" @click="cancelSubscription">
          Отменить подписку
        </ui-button>
      </div>
    </div>

    <div class="usage-section">
      <div class="usage-row" v-for="item in usageItems" :key="item.label">
        <div class="usage-label">{{ item.label }}</div>
        <div class="usage-bar-wrap">
          <div class="usage-bar">
            <div
              class="usage-bar__fill"
              :class="{ 'usage-bar__fill--warn': item.percent >= 80 }"
              :style="{ width: item.percent + '%' }"
            />
          </div>
          <span class="usage-value">{{ item.used }} / {{ item.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentPlan = reactive({
  id: 'pro',
  name: 'Pro',
  price: 29,
  renewalDate: '1 июня 2025',
})

const usageItems = [
  { label: 'Запросы API',         used: '7 240', total: '10 000', percent: 72 },
  { label: 'Рабочие пространства', used: '3',     total: '5',      percent: 60 },
  { label: 'Участники',           used: '8',     total: '10',     percent: 80 },
]

function cancelSubscription() {
  // TODO: open confirmation modal, then await $fetch('/api/billing/cancel', { method: 'POST' })
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

.current-plan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-neutral-ll);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.plan-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-highlight-l);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 100px;
  margin-bottom: 10px;
}

.plan-badge__icon {
  width: 14px;
  height: 14px;
}

.plan-price {
  display: block;
  font-size: 26px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  line-height: 1;
  margin-bottom: 6px;
}

.plan-price__period {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-neutral-dl);
}

.plan-renewal {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.plan-renewal strong {
  color: var(--color-neutral-dd);
}

.usage-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.usage-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.usage-label {
  font-size: 13px;
  color: var(--color-neutral-dm);
  width: 160px;
  flex-shrink: 0;
}

.usage-bar-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.usage-bar {
  flex: 1;
  height: 6px;
  background: var(--color-neutral-lm);
  border-radius: 100px;
  overflow: hidden;
}

.usage-bar__fill {
  height: 100%;
  border-radius: 100px;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.usage-bar__fill--warn {
  background: var(--color-warning);
}

.usage-value {
  font-size: 12px;
  color: var(--color-neutral-dl);
  white-space: nowrap;
  min-width: 80px;
  text-align: right;
}

@media (max-width: 700px) {
  .usage-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .usage-label { width: auto; }
  .usage-bar-wrap { width: 100%; }
}
</style>
