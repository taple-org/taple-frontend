<script lang="ts" setup>
import styles from "~/components/auth/form/index.module.css";
import type { NewPasswordActionsType } from "~/interfaces/auth/modal";
import { useNewPasswordForm } from "~/composables/auth/useNewPasswordForm";
import { useI18n } from "vue-i18n";
const emit = defineEmits<{ navigate: [actions: NewPasswordActionsType] }>();
const { t } = useI18n();

const { r$, externalErrors } = useNewPasswordForm();
const { resetPassword, withLoading } = useAuthStore();

const handleSubmit = async () => {
  const values = await r$.$validate();
  if (!values.valid) return;

  await withLoading(async () => {
    await resetPassword(values.data);
    emit("navigate", "success");
  }, externalErrors)();
};
</script>
<template>
  <form :class="styles.form" @submit.prevent="handleSubmit">
    <ui-form-field
      v-model="r$.$value.password"
      type="password"
      :error="r$.password.$errors[0]"
      :placeholder="t('auth.passwordPlaceholder')"
    />
    <ui-form-field
      v-model="r$.$value.confirmPassword"
      type="password"
      :error="r$.confirmPassword.$errors[0]"
      :placeholder="t('auth.confirmPasswordPlaceholder')"
    />
    <ui-info-section size="md">
      {{ t("auth.passwordRequirements") }}
    </ui-info-section>
    <ui-button type="submit">{{ t("auth.setPassword") }}</ui-button>
    <span :class="styles.formText">{{ t("common.or") }}</span>
    <ui-button
      variant="outline"
      @click="emit('navigate', 'cancel')"
      type="button"
      >{{ t("common.cancel") }}</ui-button
    >
  </form>
</template>
