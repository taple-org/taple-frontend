<script lang="ts" setup>
import styles from "~/components/auth/form/index.module.css";
import type { RecoveryActionsType } from "~/interfaces/auth/modal";
import { useRecoveryPasswordForm } from "~/composables/auth/useRecoveryPasswordForm";
import { useI18n } from "vue-i18n";
const emit = defineEmits<{ navigate: [actions: RecoveryActionsType] }>();
const { t } = useI18n();

const { r$, externalErrors } = useRecoveryPasswordForm();
const { setPendingEmail, forgotPassword, withLoading } = useAuthStore();

const handleSubmit = async () => {
  const values = await r$.$validate();
  if (!values.valid) return;

  setPendingEmail(values.data.email);

  await withLoading(async () => {
    await forgotPassword(values.data);
    emit("navigate", "success");
  }, externalErrors)();
};
</script>
<template>
  <form :class="styles.form" @submit.prevent="handleSubmit">
    <ui-form-field
      v-model="r$.$value.email"
      type="text"
      :placeholder="t('auth.emailPlaceholder')"
      :error="r$.email.$errors[0]"
    />
    <ui-button type="submit">{{ t("auth.restore") }}</ui-button>
    <span :class="styles.formText">{{ t("common.or") }}</span>
    <ui-button
      variant="outline"
      @click="emit('navigate', 'cancel')"
      type="button"
      >{{ t("common.cancel") }}</ui-button
    >
  </form>
</template>
