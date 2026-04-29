<script setup lang="ts">
import { useNotification } from "~/composables/useNotification";
import { useAuthStore } from "~/stores/auth.store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: `${t("security.pageTitle")} — Taple`,
  description: t("security.pageDescription"),
  robots: "noindex, nofollow",
});

const { $apiClient } = useNuxtApp();
const notification = useNotification();
const authStore = useAuthStore();
const router = useRouter();

// Modal states
const showDeactivateModal = ref(false);
const showDeleteModal = ref(false);
const isDeactivating = ref(false);
const isDeleting = ref(false);

async function deactivateAccount() {
  isDeactivating.value = true;
  try {
    await $apiClient.api.deactivateAccountApiV1AuthAccountDeactivatePost();
    notification.success(t("common.success"), t("security.deactivateSuccess"));
    showDeactivateModal.value = false;
    authStore.clearAuth();
    await router.push("/auth/login");
  } catch (error) {
    console.error("Failed to deactivate account:", error);
    notification.error(t("common.error"), t("security.deactivateError"));
  } finally {
    isDeactivating.value = false;
  }
}

async function deleteAccount() {
  isDeleting.value = true;
  try {
    await $apiClient.api.deleteAccountApiV1AuthAccountDelete();
    notification.success(t("common.success"), t("security.deleteSuccess"));
    showDeleteModal.value = false;
    authStore.clearAuth();
    await router.push("/auth/login");
  } catch (error) {
    console.error("Failed to delete account:", error);
    notification.error(t("common.error"), t("security.deleteError"));
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <ui-container :padding="[20, 15, 20]" class="security-container">
    <div class="security-settings">
      <div class="page-header">
        <h1 class="page-title">{{ t("security.pageTitle") }}</h1>
        <p class="page-desc">{{ t("security.pageDescription") }}</p>
      </div>

      <!-- Danger Zone -->
      <div class="settings-card danger-zone">
        <div class="card-header">
          <h2 class="card-title">{{ t("security.dangerZoneTitle") }}</h2>
          <p class="card-desc">{{ t("security.dangerZoneDesc") }}</p>
        </div>

        <div class="danger-actions">
          <div class="danger-action">
            <div class="danger-action__info">
              <h3 class="danger-action__title">
                {{ t("security.deactivateTitle") }}
              </h3>
              <p class="danger-action__desc">
                {{ t("security.deactivateDesc") }}
              </p>
            </div>
            <ui-button
              variant="outline"
              class="btn-danger-outline"
              @click="showDeactivateModal = true"
            >
              {{ t("security.deactivateButton") }}
            </ui-button>
          </div>

          <div class="danger-action">
            <div class="danger-action__info">
              <h3 class="danger-action__title">
                {{ t("security.deleteTitle") }}
              </h3>
              <p class="danger-action__desc">{{ t("security.deleteDesc") }}</p>
            </div>
            <ui-button class="btn-danger" @click="showDeleteModal = true">
              {{ t("security.deleteButton") }}
            </ui-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Deactivate Confirmation Modal -->
    <ui-modal
      v-model:open="showDeactivateModal"
      :title="t('security.deactivateModalTitle')"
      :description="t('security.deactivateModalDesc')"
      :persistent="isDeactivating"
    >
      <div class="modal-body">
        <p class="modal-warning">
          <Icon name="my-icon:alert" class="modal-warning__icon" />
          <span>{{ t("security.deactivateWarning") }}</span>
        </p>
      </div>

      <template #footer>
        <div class="modal-footer">
          <ui-button
            variant="outline"
            :disabled="isDeactivating"
            @click="showDeactivateModal = false"
          >
            {{ t("security.cancel") }}
          </ui-button>
          <ui-button
            class="btn-danger-outline"
            :disabled="isDeactivating"
            @click="deactivateAccount"
          >
            {{
              isDeactivating
                ? t("security.deactivating")
                : t("security.deactivateButton")
            }}
          </ui-button>
        </div>
      </template>
    </ui-modal>

    <!-- Delete Confirmation Modal -->
    <ui-modal
      v-model:open="showDeleteModal"
      :title="t('security.deleteModalTitle')"
      :description="t('security.deleteModalDesc')"
      :persistent="isDeleting"
    >
      <div class="modal-body">
        <p class="modal-warning modal-warning--critical">
          <Icon name="my-icon:alert" class="modal-warning__icon" />
          <span>{{ t("security.deleteWarning") }}</span>
        </p>
      </div>

      <template #footer>
        <div class="modal-footer">
          <ui-button
            variant="outline"
            :disabled="isDeleting"
            @click="showDeleteModal = false"
          >
            {{ t("security.cancel") }}
          </ui-button>
          <ui-button
            class="btn-danger"
            :disabled="isDeleting"
            @click="deleteAccount"
          >
            {{
              isDeleting
                ? t("security.deleting")
                : t("security.deleteAccountConfirm")
            }}
          </ui-button>
        </div>
      </template>
    </ui-modal>
  </ui-container>
</template>

<style scoped>
.security-container {
  max-width: 800px;
  margin: 0 auto;
}

.security-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  margin-bottom: 4px;
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

/* ── Card shell ──────────────────────────── */
.settings-card {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px 24px;
}

.danger-zone {
  border-color: var(--color-error);
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

/* ── Danger Actions ───────────────────────────── */
.danger-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.danger-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: var(--color-neutral-ll);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-neutral-lm);
}

.danger-action__info {
  flex: 1;
}

.danger-action__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.danger-action__desc {
  font-size: 13px;
  color: var(--color-neutral-dl);
  line-height: 1.4;
}

.btn-danger {
  background: var(--color-error) !important;
  color: white !important;
  border-color: var(--color-error) !important;
}

.btn-danger:hover {
  background: color-mix(in srgb, var(--color-error) 90%, black) !important;
}

.btn-danger-outline {
  border-color: var(--color-error) !important;
  color: var(--color-error) !important;
}

.btn-danger-outline:hover {
  background: var(--color-error-l) !important;
}

/* ── Modal Styles ──────────────────────────── */
.modal-body {
  padding-top: 16px;
}

.modal-warning {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fff8e6;
  border: 1px solid #ffc107;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #856404;
  line-height: 1.5;
}

.modal-warning--critical {
  background: var(--color-error-l);
  border-color: var(--color-error);
  color: var(--color-error);
}

.modal-warning__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
