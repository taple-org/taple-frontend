<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Способ оплаты</h2>
      <p class="card-desc">Карта, привязанная к вашей подписке</p>
    </div>

    <div class="payment-row">
      <div class="card-icon-wrap">
        <Icon name="my-icon:credit-card" class="card-icon" />
      </div>
      <div class="payment-info">
        <div class="payment-name">•••• •••• •••• {{ paymentMethod.last4 }}</div>
        <div class="payment-expiry">Истекает {{ paymentMethod.expiry }}</div>
      </div>
      <div class="payment-actions">
        <button class="btn-link" @click="updateCard">Обновить</button>
        <button class="btn-link btn-link-danger" @click="removeCard">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const paymentMethod = reactive({ last4: '4242', expiry: '09/27' })

function updateCard() {
  // TODO: open Stripe Elements / payment modal
}

function removeCard() {
  // TODO: open confirmation modal, then await $fetch('/api/billing/payment-method', { method: 'DELETE' })
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

.payment-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.card-icon-wrap {
  width: 44px;
  height: 30px;
  background: var(--color-neutral-ll);
  border: 1px solid var(--color-neutral-lm);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  width: 20px;
  height: 20px;
  color: var(--color-neutral-dm);
}

.payment-info {
  flex: 1;
}

.payment-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dd);
  letter-spacing: 0.05em;
}

.payment-expiry {
  font-size: 12px;
  color: var(--color-neutral-dl);
  margin-top: 2px;
}

.payment-actions {
  display: flex;
  gap: 12px;
}

.btn-link {
  font-size: 13px;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-base);
  padding: 0;
  transition: opacity var(--transition-base);
}

.btn-link:hover {
  opacity: 0.75;
}

.btn-link-danger {
  color: var(--color-error);
}
</style>
