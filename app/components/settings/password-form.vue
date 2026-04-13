<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Смена пароля</h2>
      <p class="card-desc">Используйте надёжный пароль длиной от 8 символов</p>
    </div>

    <form class="form" @submit.prevent="handleSubmit">
      <div class="field">
        <label class="field-label" for="currentPassword">Текущий пароль</label>
        <div class="password-wrapper">
          <input
              id="currentPassword"
              v-model="form.currentPassword"
              class="field-input"
              :class="{ error: errors.currentPassword }"
              :type="showPasswords.current ? 'text' : 'password'"
              placeholder="Введите текущий пароль"
              autocomplete="current-password"
          />
          <button
              type="button"
              class="eye-btn"
              @click="showPasswords.current = !showPasswords.current"
          >
            <Icon name="my-icon:visible" v-if="!showPasswords.current" />
            <Icon name="my-icon:invisible" v-else />
          </button>
        </div>
        <span v-if="errors.currentPassword" class="field-error">{{ errors.currentPassword }}</span>
      </div>

      <div class="field">
        <label class="field-label" for="newPassword">Новый пароль</label>
        <div class="password-wrapper">
          <input
              id="newPassword"
              v-model="form.newPassword"
              class="field-input"
              :class="{ error: errors.newPassword }"
              :type="showPasswords.new ? 'text' : 'password'"
              placeholder="Минимум 8 символов"
              autocomplete="new-password"
          />
          <button
              type="button"
              class="eye-btn"
              @click="showPasswords.new = !showPasswords.new"
          >
            <Icon name="my-icon:visible" v-if="!showPasswords.new" />
            <Icon name="my-icon:invisible" v-else />
          </button>
        </div>
        <span v-if="errors.newPassword" class="field-error">{{ errors.newPassword }}</span>

        <div v-if="form.newPassword" class="strength-bar">
          <div
              v-for="i in 4"
              :key="i"
              class="strength-segment"
              :class="strengthClass(i)"
          />
        </div>
        <span v-if="form.newPassword" class="strength-label" :class="`strength-text-${strength.level}`">
          {{ strength.label }}
        </span>
      </div>

      <div class="field">
        <label class="field-label" for="confirmPassword">Повторите пароль</label>
        <div class="password-wrapper">
          <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              class="field-input"
              :class="{ error: errors.confirmPassword }"
              :type="showPasswords.confirm ? 'text' : 'password'"
              placeholder=""
              autocomplete="new-password"
          />
          <button
              type="button"
              class="eye-btn"
              @click="showPasswords.confirm = !showPasswords.confirm"
          >
            <Icon name="my-icon:visible" v-if="!showPasswords.confirm" />
            <Icon name="my-icon:invisible" v-else />
          </button>
        </div>
        <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
      </div>

      <div v-if="successMsg" class="success-banner">{{ successMsg }}</div>

      <div class="form-footer">
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Сохранение...' : 'Сменить пароль' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showPasswords = reactive({ current: false, new: false, confirm: false })
const errors = reactive<Record<string, string>>({})
const isLoading = ref(false)
const successMsg = ref('')

const strength = computed(() => {
  const p = form.newPassword
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) score++

  const labels = ['', 'Слабый', 'Средний', 'Хороший', 'Надёжный']
  return { score, level: score, label: labels[score] || 'Слабый' }
})

function strengthClass(segment: number) {
  if (strength.value.score < segment) return 'empty'
  const classes = ['', 'weak', 'medium', 'good', 'strong']
  return classes[strength.value.score]
}

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.currentPassword) errors.currentPassword = 'Введите текущий пароль'
  if (form.newPassword.length < 8) errors.newPassword = 'Пароль должен содержать минимум 8 символов'
  if (form.newPassword !== form.confirmPassword) errors.confirmPassword = 'Пароли не совпадают'

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  isLoading.value = true
  successMsg.value = ''

  try {
    // TODO: await $fetch('/api/user/password', { method: 'PUT', body: { currentPassword: form.currentPassword, newPassword: form.newPassword } })
    await new Promise(r => setTimeout(r, 600))
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    successMsg.value = 'Пароль успешно изменён'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch {
    errors.currentPassword = 'Неверный текущий пароль'
  } finally {
    isLoading.value = false
  }
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

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 440px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-neutral-dm);
}

.password-wrapper {
  position: relative;
}

.field-input {
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 9px 40px 9px 12px;
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

.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-neutral-dl);
  display: flex;
  align-items: center;
  padding: 0;
  transition: color var(--transition-base);
}

.eye-btn:hover {
  color: var(--color-neutral-dm);
}

.eye-btn svg {
  width: 16px;
  height: 16px;
}

.field-error {
  font-size: 12px;
  color: var(--color-error);
}

.strength-bar {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.strength-segment {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: var(--color-neutral-lm);
  transition: background var(--transition-base);
}

.strength-segment.weak   { background: var(--color-error); }
.strength-segment.medium { background: var(--color-warning); }
.strength-segment.good   { background: #3AC0A0; }
.strength-segment.strong { background: var(--color-success); }
.strength-segment.empty  { background: var(--color-neutral-lm); }

.strength-label {
  font-size: 11px;
  font-weight: 500;
}

.strength-text-1 { color: var(--color-error); }
.strength-text-2 { color: var(--color-warning); }
.strength-text-3 { color: var(--color-success); }
.strength-text-4 { color: var(--color-success); }

.success-banner {
  padding: 10px 14px;
  background: var(--color-success-l);
  color: var(--color-success);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 10px 22px;
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
</style>