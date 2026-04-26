<script lang="ts" setup>
import styles from "~/components/auth/form/index.module.css";
import type { RegisterActionsType } from "~/interfaces/auth/modal";
import { useRegisterForm } from "~/composables/auth/useRegisterForm";
import { useI18n } from "vue-i18n";
const emit = defineEmits<{ navigate: [actions: RegisterActionsType] }>();
const authStore = useAuthStore();
const { t } = useI18n();

const { r$, externalErrors } = useRegisterForm();

const handleSubmit = async (e: Event) => {
  const values = await r$.$validate();
  if (!values.valid) return;

  await authStore.withLoading(async () => {
    await authStore.register(values.data);
    emit("navigate", "success");
  }, externalErrors)();
};
</script>
<template>
  <form :class="styles.form" @submit.prevent="handleSubmit">
    <ui-form-field
      v-model="r$.$value.first_name"
      type="text"
      :error="r$.first_name.$errors[0]"
      :placeholder="t('auth.firstNamePlaceholder')"
    />
    <ui-form-field
      v-model="r$.$value.last_name"
      type="text"
      :error="r$.last_name.$errors[0]"
      :placeholder="t('auth.lastNamePlaceholder')"
    />
    <ui-form-field
      v-model="r$.$value.email"
      type="text"
      :error="r$.email.$errors[0]"
      :placeholder="t('auth.emailPlaceholder')"
    />
    <ui-form-field
      v-model="r$.$value.password"
      type="password"
      :error="r$.password.$errors[0]"
      :placeholder="t('auth.passwordPlaceholder')"
    />
    <ui-form-field
      v-model="r$.$value.password_confirm"
      type="password"
      :error="r$.password_confirm.$errors[0]"
      :placeholder="t('auth.confirmPasswordPlaceholder')"
    />
    <ui-info-section size="md">
      {{ t("auth.passwordRequirements") }}
    </ui-info-section>
    <ui-form-field
      v-model="r$.$value.agree"
      type="checkbox"
      :error="r$.agree.$errors[0]"
      :label="t('auth.agreeTerms')"
    />
    <ui-button type="submit">{{ t("auth.continue") }}</ui-button>
    <span :class="styles.formText">{{ t("auth.alreadyHaveAccount") }}</span>
    <ui-button
      variant="outline"
      type="button"
      @click.prevent="emit('navigate', 'login')"
      >{{ t("auth.login") }}</ui-button
    >
  </form>
</template>
<style scoped lang="css">
.error-message {
  color: var(--color-error, #ef4444);
  font-size: 14px;
  padding: 8px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
  text-align: center;
}
</style>
