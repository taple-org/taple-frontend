<script lang="ts" setup>
import styles from "~/components/auth/form/index.module.css";
import { useLoginForm } from "~/composables/auth/useLoginForm";
import type { LoginActionsType } from "~/interfaces/auth/modal";
import { useI18n } from "vue-i18n";

const emit = defineEmits<{ navigate: [actions: LoginActionsType] }>();
const authStore = useAuthStore();
const { t } = useI18n();

const { r$, externalErrors } = useLoginForm();

const handleSubmit = async () => {
  const values = await r$.$validate();
  if (!values.valid) return;

  await authStore.withLoading(async () => {
    await authStore.login(values.data);
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
    <ui-form-field
      v-model="r$.$value.password"
      type="password"
      :placeholder="t('auth.passwordPlaceholder')"
      :error="r$.password.$errors[0]"
    />
    <div class="inline">
      <ui-form-field
        v-model="r$.$value.rememberMe"
        type="checkbox"
        :error="r$.rememberMe.$errors[0]"
        :label="t('auth.rememberMe')"
      />
      <span
        @click.prevent="
          () => {
            emit('navigate', 'recovery');
          }
        "
        class="forget-password"
        >{{ t("auth.forgotPassword") }}</span
      >
    </div>
    <ui-button type="submit">{{ t("auth.login") }}</ui-button>

    <span :class="styles.formText">{{ t("auth.firstTime") }}</span>
    <ui-button
      variant="outline"
      @click="emit('navigate', 'register')"
      type="button"
      >{{ t("auth.register") }}</ui-button
    >
    <ui-info-section size="sm">
      {{ t("auth.consentText") }}
    </ui-info-section>
  </form>
</template>
<style scoped lang="css">
.forget-password {
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  font-family: var(--font-base), sans-serif;
  color: var(--color-highlight-d);
}
.inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
