<template>
  <div class="subscription-page">
    <div class="page-header">
      <h1 class="page-title">Подписка</h1>
      <p class="page-desc">Управляйте планом, оплатой и историей транзакций</p>
    </div>

    <settings-subscription-current-plan-card />
    <settings-subscription-plans-grid />
    <settings-subscription-payment-method-card />
    <settings-subscription-billing-history-card />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'settings' })
</script>

<style scoped>
.subscription-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  margin-bottom: 8px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.page-desc {
  font-size: 14px;
  color: var(--color-neutral-dl);
}
</style>
