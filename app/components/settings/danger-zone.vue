<script setup lang="ts">
import { useNotification } from "~/composables/useNotification";
import { useAuthStore } from "~/stores/auth.store";

const requiredText = "удалить аккаунт";

const { $apiClient } = useNuxtApp();
const notification = useNotification();
const authStore = useAuthStore();

const showDeleteModal = ref(false);
const showDeactivateModal = ref(false);
const confirmText = ref("");
const confirmError = ref("");
const isDeleting = ref(false);
const isDeactivating = ref(false);

function openDeleteModal() {
  confirmText.value = "";
  confirmError.value = "";
  showDeleteModal.value = true;
}

async function confirmDelete() {
  confirmError.value = "";
  if (confirmText.value !== requiredText) {
    confirmError.value = "Текст не совпадает";
    return;
  }
  isDeleting.value = true;
  try {
    await $apiClient.api.deleteAccountApiV1AuthAccountDelete();
    notification.success("Успех", "Аккаунт удален");
    showDeleteModal.value = false;
    await authStore.signOut();
    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Failed to delete account:", error);
    notification.error("Ошибка", "Не удалось удалить аккаунт");
  } finally {
    isDeleting.value = false;
  }
}

async function confirmDeactivate() {
  isDeactivating.value = true;
  try {
    await $apiClient.api.deactivateAccountApiV1AuthAccountDeactivatePost();
    notification.success("Успех", "Аккаунт деактивирован");
    showDeactivateModal.value = false;
    await authStore.signOut();
    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Failed to deactivate account:", error);
    notification.error("Ошибка", "Не удалось деактивировать аккаунт");
  } finally {
    isDeactivating.value = false;
  }
}
</script>

<template>
  <div class="settings-card danger-card">
    <div class="card-header">
      <h2 class="card-title">Опасная зона</h2>
      <p class="card-desc">Эти действия необратимы. Будьте внимательны</p>
    </div>

    <div class="danger-item">
      <div class="danger-info">
        <div class="danger-name">Деактивировать аккаунт</div>
        <div class="danger-desc">
          Аккаунт будет временно скрыт. Вы сможете восстановить его в течение 30
          дней
        </div>
      </div>
      <ui-button variant="outline" @click="showDeactivateModal = true">
        Деактивировать
      </ui-button>
    </div>

    <div class="divider" />

    <div class="danger-item">
      <div class="danger-info">
        <div class="danger-name">Удалить аккаунт</div>
        <div class="danger-desc">
          Все данные — профиль, история, контент — будут удалены безвозвратно
        </div>
      </div>
      <ui-button variant="error" @click="openDeleteModal">
        Удалить аккаунт
      </ui-button>
    </div>
  </div>

  <ui-modal
    v-model:open="showDeactivateModal"
    title="Деактивировать аккаунт?"
    description="Аккаунт будет скрыт. Вы сможете восстановить его в течение 30 дней после входа."
  >
    <template #footer>
      <ui-button variant="outline" @click="showDeactivateModal = false"
        >Отмена</ui-button
      >
      <ui-button
        variant="error"
        :disabled="isDeactivating"
        @click="confirmDeactivate"
      >
        {{ isDeactivating ? "Деактивация..." : "Да, деактивировать" }}
      </ui-button>
    </template>
  </ui-modal>

  <ui-modal
    v-model:open="showDeleteModal"
    title="Удалить аккаунт?"
    description="Это действие необратимо. Все ваши данные будут удалены без возможности восстановления."
  >
    <div class="confirm-body">
      <div class="modal-icon">
        <Icon name="my-icon:error" class="modal-icon__svg" />
      </div>

      <ui-form-field
        type="text"
        v-model="confirmText"
        :error="confirmError"
        :label="`Введите «${requiredText}» для подтверждения`"
        :placeholder="requiredText"
        autocomplete="off"
      />
    </div>

    <template #footer>
      <ui-button variant="outline" @click="showDeleteModal = false"
        >Отмена</ui-button
      >
      <ui-button
        variant="error"
        :disabled="isDeleting || confirmText !== requiredText"
        @click="confirmDelete"
      >
        {{ isDeleting ? "Удаление..." : "Да, удалить аккаунт" }}
      </ui-button>
    </template>
  </ui-modal>
</template>

<style scoped>
.settings-card {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px 24px;
}

.danger-card {
  border-color: #ffd5d8;
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

.confirm-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 360px;
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

.modal-icon__svg {
  width: 22px;
  height: 22px;
}
</style>
