<template>
  <div class="settings-card danger-card">
    <div class="card-header">
      <h2 class="card-title">Опасная зона</h2>
      <p class="card-desc">Эти действия необратимы. Будьте внимательны</p>
    </div>

    <div class="danger-item">
      <div class="danger-info">
        <div class="danger-name">Деактивировать аккаунт</div>
        <div class="danger-desc">Аккаунт будет временно скрыт. Вы сможете восстановить его в течение 30 дней</div>
      </div>
      <button class="btn-warning" @click="deactivateAccount">
        Деактивировать
      </button>
    </div>

    <div class="divider" />

    <div class="danger-item">
      <div class="danger-info">
        <div class="danger-name">Удалить аккаунт</div>
        <div class="danger-desc">Все данные — профиль, история, контент — будут удалены безвозвратно</div>
      </div>
      <button class="btn-danger" @click="openDeleteModal">
        Удалить аккаунт
      </button>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal">
        <div class="modal-icon">
          <Icon name="my-icon:error" />
        </div>
        <h3 class="modal-title">Удалить аккаунт?</h3>
        <p class="modal-desc">
          Это действие <strong>необратимо</strong>. Все ваши данные будут удалены без возможности восстановления.
        </p>

        <div class="confirm-field">
          <label class="field-label">
            Введите <code class="inline-code">{{ requiredText }}</code> для подтверждения
          </label>
          <input
              v-model="confirmText"
              class="field-input"
              :class="{ error: confirmError }"
              type="text"
              :placeholder="requiredText"
              autocomplete="off"
          />
          <span v-if="confirmError" class="field-error">{{ confirmError }}</span>
        </div>

        <div class="modal-footer">
          <button class="btn-ghost" @click="closeDeleteModal">Отмена</button>
          <button
              class="btn-delete"
              :disabled="isDeleting || confirmText !== requiredText"
              @click="confirmDelete"
          >
            {{ isDeleting ? 'Удаление...' : 'Да, удалить аккаунт' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const requiredText = 'удалить аккаунт'

const showDeleteModal = ref(false)
const confirmText = ref('')
const confirmError = ref('')
const isDeleting = ref(false)

function openDeleteModal() {
  confirmText.value = ''
  confirmError.value = ''
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
}

async function confirmDelete() {
  confirmError.value = ''

  if (confirmText.value !== requiredText) {
    confirmError.value = 'Текст не совпадает'
    return
  }

  isDeleting.value = true
  try {
    // TODO: await $fetch('/api/user/account', { method: 'DELETE' })
    await new Promise(r => setTimeout(r, 800))
    await navigateTo('/auth/login')
  } finally {
    isDeleting.value = false
  }
}

function deactivateAccount() {
  if (confirm('Деактивировать аккаунт? Вы сможете восстановить его в течение 30 дней')) {
    // TODO: await $fetch('/api/user/account/deactivate', { method: 'POST' })
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

.danger-card {
  border-color: #FFD5D8;
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-error);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.danger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  flex-wrap: wrap;
}

.danger-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dd);
  margin-bottom: 3px;
}

.danger-desc {
  font-size: 12px;
  color: var(--color-neutral-dl);
  max-width: 420px;
  line-height: 1.5;
}

.divider {
  border: none;
  border-top: 1px solid var(--color-neutral-ll);
}

.btn-warning {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-base);
  cursor: pointer;
  background: var(--color-warning-l);
  border: 1px solid transparent;
  color: #7a4a0a;
  white-space: nowrap;
  transition: opacity var(--transition-base);
}

.btn-warning:hover {
  opacity: 0.85;
}

.btn-danger {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-base);
  cursor: pointer;
  background: var(--color-error-l);
  border: 1px solid transparent;
  color: var(--color-error);
  white-space: nowrap;
  transition: opacity var(--transition-base);
}

.btn-danger:hover {
  opacity: 0.85;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: 28px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.14);
}

.modal-icon {
  width: 44px;
  height: 44px;
  background: var(--color-error-l);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-error);
}

.modal-icon svg {
  width: 22px;
  height: 22px;
}

.modal-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-neutral-dd);
}

.modal-desc {
  font-size: 14px;
  color: var(--color-neutral-dm);
  line-height: 1.6;
}

.confirm-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  color: var(--color-neutral-dm);
  line-height: 1.5;
}

.inline-code {
  font-family: monospace;
  background: var(--color-neutral-ll);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-neutral-dd);
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
  transition: border-color var(--transition-base);
  width: 100%;
}

.field-input:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px var(--color-error-l);
}

.field-input.error {
  border-color: var(--color-error);
}

.field-error {
  font-size: 12px;
  color: var(--color-error);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.btn-delete {
  background: var(--color-error);
  color: var(--color-white);
  border: none;
  padding: 9px 18px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-base);
  cursor: pointer;
  transition: opacity var(--transition-base);
}

.btn-delete:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>