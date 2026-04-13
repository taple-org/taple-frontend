<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Email адрес</h2>
      <p class="card-desc">Используется для входа, уведомлений и восстановления аккаунта</p>
    </div>

    <div class="email-list">
      <div
          v-for="(item, i) in emails"
          :key="i"
          class="email-row"
      >
        <div class="email-info">
          <span class="email-text">{{ item.email || '—' }}</span>
          <span v-if="item.isPrimary" class="badge badge-primary">Основной</span>
          <span
              class="badge"
              :class="item.verified ? 'badge-verified' : 'badge-unverified'"
          >
            {{ item.verified ? 'Подтверждён' : 'Не подтверждён' }}
          </span>
        </div>
        <div class="email-actions">
          <button
              v-if="!item.verified"
              class="btn-link"
              @click="resendVerification(item.email)"
          >
            Отправить код
          </button>
          <button
              v-if="!item.isPrimary"
              class="btn-link"
              @click="makePrimary(i)"
          >
            Сделать основным
          </button>
          <button
              v-if="!item.isPrimary"
              class="btn-link btn-link-danger"
              @click="removeEmail(i)"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <div v-if="!showAddForm" class="add-row">
      <button class="btn-ghost" @click="showAddForm = true">
        + Добавить email
      </button>
    </div>

    <form v-else class="add-form" @submit.prevent="addEmail">
      <input
          v-model="newEmail"
          class="field-input"
          type="email"
          placeholder="new@example.com"
          :class="{ error: newEmailError }"
          autofocus
      />
      <span v-if="newEmailError" class="field-error">{{ newEmailError }}</span>
      <div class="add-form-footer">
        <button type="button" class="btn-ghost" @click="cancelAdd">Отмена</button>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Добавление...' : 'Добавить' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface EmailEntry {
  email: string
  verified: boolean
  isPrimary: boolean
}

// TODO: загрузить из API
const emails = ref<EmailEntry[]>([
  { email: 'askar@example.com', verified: true, isPrimary: true },
  { email: 'askar.backup@example.com', verified: false, isPrimary: false },
])

const showAddForm = ref(false)
const newEmail = ref('')
const newEmailError = ref('')
const isLoading = ref(false)

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function addEmail() {
  newEmailError.value = ''

  if (!validateEmail(newEmail.value)) {
    newEmailError.value = 'Введите корректный email'
    return
  }

  if (emails.value.some(e => e.email === newEmail.value)) {
    newEmailError.value = 'Этот email уже добавлен'
    return
  }

  isLoading.value = true
  try {
    // TODO: await $fetch('/api/user/emails', { method: 'POST', body: { email: newEmail.value } })
    await new Promise(r => setTimeout(r, 500))
    emails.value.push({ email: newEmail.value, verified: false, isPrimary: false })
    cancelAdd()
  } finally {
    isLoading.value = false
  }
}

async function resendVerification(email: string) {
  // TODO: await $fetch('/api/user/emails/verify', { method: 'POST', body: { email } })
  alert(`Код подтверждения отправлен на ${email}`)
}

function makePrimary(index: number) {
  emails.value.forEach(e => { e.isPrimary = false })
  emails.value[index]!.isPrimary = true
  // TODO: await $fetch('/api/user/emails/primary', { method: 'PUT', body: { email: emails.value[index].email } })
}

function removeEmail(index: number) {
  emails.value.splice(index, 1)
  // TODO: await $fetch('/api/user/emails', { method: 'DELETE', body: { email } })
}

function cancelAdd() {
  showAddForm.value = false
  newEmail.value = ''
  newEmailError.value = ''
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

.email-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 14px;
}

.email-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-neutral-ll);
  flex-wrap: wrap;
  gap: 8px;
}

.email-row:last-child {
  border-bottom: none;
}

.email-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.email-text {
  font-size: 14px;
  color: var(--color-neutral-dd);
}

.badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 20px;
}

.badge-primary {
  background: var(--color-highlight-l);
  color: var(--color-primary);
}

.badge-verified {
  background: var(--color-success-l);
  color: var(--color-success);
}

.badge-unverified {
  background: var(--color-warning-l);
  color: #7a4a0a;
}

.email-actions {
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

.add-row {
  padding-top: 4px;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

.field-input {
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 9px 12px;
  font-size: 14px;
  font-family: var(--font-base);
  color: var(--color-neutral-dd);
  background: var(--color-white);
  outline: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  width: 100%;
}

.field-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 111, 253, 0.12);
}

.field-input.error {
  border-color: var(--color-error);
}

.field-error {
  font-size: 12px;
  color: var(--color-error);
}

.add-form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 9px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-base);
  cursor: pointer;
  transition: opacity var(--transition-base);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--color-neutral-lm);
  padding: 9px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-base);
  color: var(--color-neutral-dm);
  cursor: pointer;
  transition: background var(--transition-base);
}

.btn-ghost:hover {
  background: var(--color-neutral-ll);
}
</style>