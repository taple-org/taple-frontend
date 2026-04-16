<template>
  <!-- Current plan -->
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

  <!-- Available plans -->
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
          'plan-card--current': plan.id === currentPlan.id,
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
          :variant="plan.id === currentPlan.id ? 'outline' : 'primary'"
          :disabled="plan.id === currentPlan.id"
          class="plan-card__cta"
          @click="selectPlan(plan)"
        >
          {{ plan.id === currentPlan.id ? 'Текущий план' : 'Выбрать план' }}
        </ui-button>
      </div>
    </div>
  </div>

  <!-- Payment method -->
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

  <!-- Billing history -->
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">История платежей</h2>
      <p class="card-desc">Все транзакции за последние 12 месяцев</p>
    </div>

    <table class="billing-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Описание</th>
          <th>Сумма</th>
          <th>Статус</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invoice in billingHistory" :key="invoice.id">
          <td class="billing-date">{{ invoice.date }}</td>
          <td class="billing-desc">{{ invoice.description }}</td>
          <td class="billing-amount">${{ invoice.amount }}</td>
          <td>
            <span class="billing-status" :class="`billing-status--${invoice.status}`">
              {{ statusLabel(invoice.status) }}
            </span>
          </td>
          <td class="billing-actions">
            <button class="btn-link" @click="downloadInvoice(invoice.id)">
              Скачать
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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

interface Invoice {
  id: string
  date: string
  description: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

const currentPlan = reactive({
  id: 'pro',
  name: 'Pro',
  price: 29,
  renewalDate: '1 июня 2025',
})

const usageItems = [
  { label: 'Запросы API', used: '7 240', total: '10 000', percent: 72 },
  { label: 'Рабочие пространства', used: '3', total: '5', percent: 60 },
  { label: 'Участники', used: '8', total: '10', percent: 80 },
]

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

const paymentMethod = reactive({ last4: '4242', expiry: '09/27' })

const billingHistory = ref<Invoice[]>([
  { id: 'inv_001', date: '1 мая 2025',    description: 'Pro — май 2025',    amount: 29, status: 'paid' },
  { id: 'inv_002', date: '1 апр 2025',   description: 'Pro — апрель 2025', amount: 29, status: 'paid' },
  { id: 'inv_003', date: '1 мар 2025',   description: 'Pro — март 2025',   amount: 29, status: 'paid' },
  { id: 'inv_004', date: '1 фев 2025',   description: 'Pro — февраль 2025',amount: 29, status: 'paid' },
])

function statusLabel(s: Invoice['status']) {
  return { paid: 'Оплачен', pending: 'В обработке', failed: 'Ошибка' }[s]
}

function selectPlan(plan: Plan) {
  // TODO: navigate to checkout or upgrade flow
  console.log('Switching to plan:', plan.id)
}

function cancelSubscription() {
  if (confirm('Отменить подписку? Доступ сохранится до конца оплаченного периода.')) {
    // TODO: await $fetch('/api/billing/cancel', { method: 'POST' })
  }
}

function updateCard() {
  // TODO: open Stripe Elements / payment modal
}

function removeCard() {
  if (confirm('Удалить способ оплаты? Подписка будет отменена.')) {
    // TODO: await $fetch('/api/billing/payment-method', { method: 'DELETE' })
  }
}

function downloadInvoice(id: string) {
  // TODO: window.open(`/api/billing/invoices/${id}/pdf`)
  console.log('Downloading invoice:', id)
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

/* ── Current plan ────────────────────────────── */
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

/* ── Usage bars ──────────────────────────────── */
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

/* ── Plans grid ──────────────────────────────── */
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

/* ── Payment method ──────────────────────────── */
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

/* ── Billing table ───────────────────────────── */
.billing-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.billing-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-neutral-dl);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0 0 10px;
  border-bottom: 1px solid var(--color-neutral-lm);
}

.billing-table td {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-neutral-ll);
  color: var(--color-neutral-dd);
  vertical-align: middle;
}

.billing-table tr:last-child td {
  border-bottom: none;
}

.billing-date {
  color: var(--color-neutral-dl);
  white-space: nowrap;
  padding-right: 12px;
}

.billing-amount {
  font-weight: 500;
  white-space: nowrap;
}

.billing-status {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
}

.billing-status--paid {
  background: var(--color-success-l);
  color: var(--color-success);
}

.billing-status--pending {
  background: var(--color-warning-l);
  color: #7a4a0a;
}

.billing-status--failed {
  background: var(--color-error-l);
  color: var(--color-error);
}

.billing-actions {
  text-align: right;
}

/* ── Shared utils ────────────────────────────── */
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

/* ── Responsive ──────────────────────────────── */
@media (max-width: 700px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }

  .usage-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .usage-label {
    width: auto;
  }

  .usage-bar-wrap {
    width: 100%;
  }
}
</style>
