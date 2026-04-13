<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Номер телефона</h2>
      <p class="card-desc">Используется для двухфакторной аутентификации и восстановления доступа</p>
    </div>

    <div v-if="currentPhone" class="current-phone">
      <div class="phone-info">
        <span class="phone-text">{{ formatPhone(currentPhone) }}</span>
        <span class="badge" :class="phoneVerified ? 'badge-verified' : 'badge-unverified'">
          {{ phoneVerified ? 'Подтверждён' : 'Не подтверждён' }}
        </span>
      </div>
      <div class="phone-actions">
        <button class="btn-link" @click="openChangeForm">Изменить</button>
        <button class="btn-link btn-link-danger" @click="removePhone">Удалить</button>
      </div>
    </div>

    <form v-if="showForm" class="phone-form" @submit.prevent="handleSubmit">
      <div class="phone-row">
        <select v-model="countryCode" class="field-input code-select">
          <option value="+7">+7 (KZ/RU)</option>
          <option value="+1">+1 (US/CA)</option>
          <option value="+44">+44 (UK)</option>
          <option value="+49">+49 (DE)</option>
          <option value="+90">+90 (TR)</option>
        </select>
        <input
            v-model="phoneNumber"
            class="field-input phone-input"
            :class="{ error: phoneError }"
            type="tel"
            placeholder="700 000 0000"
            autocomplete="tel-national"
        />
      </div>
      <span v-if="phoneError" class="field-error">{{ phoneError }}</span>

      <div v-if="showCodeInput" class="code-row">
        <p class="code-hint">Код отправлен на {{ countryCode }} {{ phoneNumber }}</p>
        <input
            v-model="verifyCode"
            class="field-input code-input"
            :class="{ error: codeError }"
            type="text"
            placeholder="Введите 6-значный код"
            maxlength="6"
            inputmode="numeric"
            autofocus
        />
        <span v-if="codeError" class="field-error">{{ codeError }}</span>
      </div>

      <div class="form-footer">
        <button type="button" class="btn-ghost" @click="cancelForm">Отмена</button>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ submitLabel }}
        </button>
      </div>
    </form>

    <div v-if="!currentPhone && !showForm">
      <button class="btn-ghost" @click="showForm = true">+ Добавить номер</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: данные из useAuthStore или загрузить через $fetch('/api/user/phone')
const currentPhone = ref('+7 700 000 0000')
const phoneVerified = ref(true)

const showForm = ref(false)
const showCodeInput = ref(false)

const countryCode = ref('+7')
const phoneNumber = ref('')
const verifyCode = ref('')
const phoneError = ref('')
const codeError = ref('')
const isLoading = ref(false)

const submitLabel = computed(() => {
  if (isLoading.value) return 'Загрузка...'
  return showCodeInput.value ? 'Подтвердить' : 'Отправить код'
})

function formatPhone(phone: string) {
  return phone
}

function openChangeForm() {
  showForm.value = true
}

async function handleSubmit() {
  if (!showCodeInput.value) {
    phoneError.value = ''
    if (!phoneNumber.value.trim()) {
      phoneError.value = 'Введите номер телефона'
      return
    }
    isLoading.value = true
    try {
      // TODO: await $fetch('/api/user/phone/send-code', { method: 'POST', body: { phone: countryCode.value + phoneNumber.value } })
      await new Promise(r => setTimeout(r, 500))
      showCodeInput.value = true
    } finally {
      isLoading.value = false
    }
  } else {
    codeError.value = ''
    if (verifyCode.value.length !== 6) {
      codeError.value = 'Введите 6-значный код'
      return
    }
    isLoading.value = true
    try {
      // TODO: await $fetch('/api/user/phone/verify', { method: 'POST', body: { code: verifyCode.value } })
      await new Promise(r => setTimeout(r, 500))
      currentPhone.value = `${countryCode.value} ${phoneNumber.value}`
      phoneVerified.value = true
      cancelForm()
    } catch {
      codeError.value = 'Неверный код. Попробуйте ещё раз'
    } finally {
      isLoading.value = false
    }
  }
}

function removePhone() {
  currentPhone.value = ''
  phoneVerified.value = false
  // TODO: await $fetch('/api/user/phone', { method: 'DELETE' })
}

function cancelForm() {
  showForm.value = false
  showCodeInput.value = false
  phoneNumber.value = ''
  verifyCode.value = ''
  phoneError.value = ''
  codeError.value = ''
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

.current-phone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-neutral-ll);
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 8px;
}

.phone-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.phone-text {
  font-size: 14px;
  color: var(--color-neutral-dd);
}

.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 20px;
}

.badge-verified {
  background: var(--color-success-l);
  color: var(--color-success);
}

.badge-unverified {
  background: var(--color-warning-l);
  color: #7a4a0a;
}

.phone-actions {
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
}

.btn-link-danger {
  color: var(--color-error);
}

.phone-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.phone-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px;
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

.code-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%238F9098' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;
}

.code-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-hint {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.code-input {
  max-width: 200px;
  letter-spacing: 0.15em;
  font-weight: 500;
}

.field-error {
  font-size: 12px;
  color: var(--color-error);
}

.form-footer {
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