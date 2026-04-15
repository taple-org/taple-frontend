<template>
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
interface Invoice {
  id: string
  date: string
  description: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

const billingHistory = ref<Invoice[]>([
  { id: 'inv_001', date: '1 мая 2025',     description: 'Pro — май 2025',     amount: 29, status: 'paid' },
  { id: 'inv_002', date: '1 апр 2025',    description: 'Pro — апрель 2025',  amount: 29, status: 'paid' },
  { id: 'inv_003', date: '1 мар 2025',    description: 'Pro — март 2025',    amount: 29, status: 'paid' },
  { id: 'inv_004', date: '1 фев 2025',    description: 'Pro — февраль 2025', amount: 29, status: 'paid' },
])

function statusLabel(s: Invoice['status']) {
  return { paid: 'Оплачен', pending: 'В обработке', failed: 'Ошибка' }[s]
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

.billing-status--paid    { background: var(--color-success-l); color: var(--color-success); }
.billing-status--pending { background: var(--color-warning-l); color: #7a4a0a; }
.billing-status--failed  { background: var(--color-error-l);   color: var(--color-error); }

.billing-actions {
  text-align: right;
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
</style>
