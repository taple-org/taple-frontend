<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">{{ t("settings.changePassword") }}</h2>
      <p class="card-desc">{{ t("settings.passwordDesc") }}</p>
    </div>

    <form class="form" @submit.prevent="handleSubmit">
      <ui-form-field
        type="password"
        v-model="r$.$value.currentPassword"
        :error="r$.currentPassword.$errors[0]"
        :label="t('settings.currentPassword')"
        :placeholder="t('settings.currentPasswordPlaceholder')"
      />

      <div class="field-with-strength">
        <ui-form-field
          type="password"
          v-model="r$.$value.newPassword"
          :error="r$.newPassword.$errors[0]"
          :label="t('settings.newPassword')"
          :placeholder="t('settings.newPasswordPlaceholder')"
        />
        <template v-if="r$.$value.newPassword">
          <div class="strength-bar">
            <div
              v-for="i in 4"
              :key="i"
              class="strength-segment"
              :class="strengthClass(i)"
            />
          </div>
          <span
            class="strength-label"
            :class="`strength-text-${strength.level}`"
          >
            {{ strength.label }}
          </span>
        </template>
      </div>

      <ui-form-field
        type="password"
        v-model="r$.$value.confirmPassword"
        :error="r$.confirmPassword.$errors[0]"
        :label="t('settings.confirmPassword')"
        :placeholder="t('settings.confirmPasswordPlaceholder')"
      />

      <div v-if="successMsg" class="success-banner">{{ successMsg }}</div>

      <div class="form-footer">
        <ui-button type="submit" :disabled="isLoading">
          {{ isLoading ? t("common.saving") : t("settings.changePasswordBtn") }}
        </ui-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { usePasswordForm } from "~/composables/settings/usePasswordForm";
import { extractApiClientError } from "~/utils/extractApiClientError";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { r$, state, externalErrors } = usePasswordForm();

const isLoading = ref(false);
const successMsg = ref("");

const strength = computed(() => {
  const p = state.newPassword;
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) score++;
  const labels = [
    "",
    t("password.weak"),
    t("password.medium"),
    t("password.good"),
    t("password.strong"),
  ];
  return { score, level: score, label: labels[score] || t("password.weak") };
});

function strengthClass(segment: number) {
  if (strength.value.score < segment) return "empty";
  const classes = ["", "weak", "medium", "good", "strong"];
  return classes[strength.value.score];
}
const { $apiClient } = useNuxtApp();

async function handleSubmit() {
  const { data, valid } = await r$.$validate();
  if (!valid) return;

  isLoading.value = true;
  successMsg.value = "";
  try {
    const result =
      await $apiClient.api.changePasswordApiV1AuthChangePasswordPost({
        old_password: data.currentPassword,
        new_password: data.newPassword,
        new_password_confirm: data.confirmPassword,
      });
    r$.$reset();
    successMsg.value = t("settings.passwordChangedSuccess");
    setTimeout(() => {
      successMsg.value = "";
    }, 3000);
  } catch (e) {
    console.log("error", e);
    const error = extractApiClientError(e);
    useNotification().error(t("common.error"), error?.message, 1000);
  } finally {
    isLoading.value = false;
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
}

.field-with-strength {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.strength-bar {
  display: flex;
  gap: 4px;
}

.strength-segment {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: var(--color-neutral-lm);
  transition: background var(--transition-base);
}

.strength-segment.weak {
  background: var(--color-error);
}
.strength-segment.medium {
  background: var(--color-warning);
}
.strength-segment.good {
  background: #3ac0a0;
}
.strength-segment.strong {
  background: var(--color-success);
}
.strength-segment.empty {
  background: var(--color-neutral-lm);
}

.strength-label {
  font-size: 11px;
  font-weight: 500;
}

.strength-text-1 {
  color: var(--color-error);
}
.strength-text-2 {
  color: var(--color-warning);
}
.strength-text-3 {
  color: var(--color-success);
}
.strength-text-4 {
  color: var(--color-success);
}

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
</style>
