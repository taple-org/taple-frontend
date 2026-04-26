<script setup lang="ts">
import { useNotification } from "~/composables/useNotification";
import { useAuthStore } from "~/stores/auth.store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const requiredText = t("dangerZone.deleteConfirmText");

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
    confirmError.value = t("dangerZone.textMismatch");
    return;
  }
  isDeleting.value = true;
  try {
    await $apiClient.api.deleteAccountApiV1AuthAccountDelete();
    notification.success(t("common.success"), t("dangerZone.accountDeleted"));
    showDeleteModal.value = false;
    await authStore.signOut();
    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Failed to delete account:", error);
    notification.error(t("common.error"), t("dangerZone.deleteError"));
  } finally {
    isDeleting.value = false;
  }
}

async function confirmDeactivate() {
  isDeactivating.value = true;
  try {
    await $apiClient.api.deactivateAccountApiV1AuthAccountDeactivatePost();
    notification.success(
      t("common.success"),
      t("dangerZone.accountDeactivated"),
    );
    showDeactivateModal.value = false;
    await authStore.signOut();
    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Failed to deactivate account:", error);
    notification.error(t("common.error"), t("dangerZone.deactivateError"));
  } finally {
    isDeactivating.value = false;
  }
}
</script>

<template>
  <div class="settings-card danger-card">
    <div class="card-header">
      <h2 class="card-title">{{ t("dangerZone.title") }}</h2>
      <p class="card-desc">{{ t("dangerZone.desc") }}</p>
    </div>

    <div class="danger-item">
      <div class="danger-info">
        <div class="danger-name">{{ t("dangerZone.deactivateTitle") }}</div>
        <div class="danger-desc">
          {{ t("dangerZone.deactivateDesc") }}
        </div>
      </div>
      <ui-button variant="outline" @click="showDeactivateModal = true">
        {{ t("dangerZone.deactivateBtn") }}
      </ui-button>
    </div>

    <div class="divider" />

    <div class="danger-item">
      <div class="danger-info">
        <div class="danger-name">{{ t("dangerZone.deleteTitle") }}</div>
        <div class="danger-desc">
          {{ t("dangerZone.deleteDesc") }}
        </div>
      </div>
      <ui-button variant="error" @click="openDeleteModal">
        {{ t("dangerZone.deleteBtn") }}
      </ui-button>
    </div>
  </div>

  <ui-modal
    v-model:open="showDeactivateModal"
    :title="t('dangerZone.deactivateModalTitle')"
    :description="t('dangerZone.deactivateModalDesc')"
  >
    <template #footer>
      <ui-button variant="outline" @click="showDeactivateModal = false">{{
        t("common.cancel")
      }}</ui-button>
      <ui-button
        variant="error"
        :disabled="isDeactivating"
        @click="confirmDeactivate"
      >
        {{
          isDeactivating
            ? t("dangerZone.deactivating")
            : t("dangerZone.confirmDeactivate")
        }}
      </ui-button>
    </template>
  </ui-modal>

  <ui-modal
    v-model:open="showDeleteModal"
    :title="t('dangerZone.deleteModalTitle')"
    :description="t('dangerZone.deleteModalDesc')"
  >
    <div class="confirm-body">
      <div class="modal-icon">
        <Icon name="my-icon:error" class="modal-icon__svg" />
      </div>

      <ui-form-field
        type="text"
        v-model="confirmText"
        :error="confirmError"
        :label="t('dangerZone.confirmLabel', { text: requiredText })"
        :placeholder="t('dangerZone.deleteConfirmText')"
        autocomplete="off"
      />
    </div>

    <template #footer>
      <ui-button variant="outline" @click="showDeleteModal = false">{{
        t("common.cancel")
      }}</ui-button>
      <ui-button
        variant="error"
        :disabled="isDeleting || confirmText !== requiredText"
        @click="confirmDelete"
      >
        {{
          isDeleting ? t("dangerZone.deleting") : t("dangerZone.confirmDelete")
        }}
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
