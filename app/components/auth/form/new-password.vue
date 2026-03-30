<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'
import type {NewPasswordActionsType} from "~/interfaces/auth/auth.modal.interfaces";
import type { RegleExternalErrorTree } from '@regle/core'
import type { NewPasswordForm } from '~/interfaces/auth/auth.form.interfaces'

const emit = defineEmits<{ 'navigate': [actions: NewPasswordActionsType] }>()

const externalErrors = ref<RegleExternalErrorTree<NewPasswordForm>>({})
const { r$ } = useNewPasswordForm(externalErrors);
const {resetPassword, withLoading} = useAuthStore();

const handleSubmit = async () => {
  const values = await r$.$validate();
  if(!values.valid) return;

  await withLoading(
    async () => {
      await resetPassword(values.data);
      emit('navigate', 'success');
    },
    externalErrors
  )();
}
</script>
<template>
  <form :class="styles.form" @submit.prevent="handleSubmit">
    <ui-form-field
        v-model="r$.$value.password"
        type="password"
        :error="r$.password.$errors[0]"
        placeholder="Введите пароль"
    />
    <ui-form-field
        v-model="r$.$value.confirmPassword"
        type="password"
        :error="r$.confirmPassword.$errors[0]"
        placeholder="Подтвердите пароль"
    />
    <ui-info-section size="md">
      Пароль должен состоять минимум из 8 символов и содержать (заглавную букву, цифру и специальный символ)
    </ui-info-section>
    <ui-button type="submit">Установить</ui-button>
    <span :class="styles.formText">или</span>
    <ui-button variant="outline" @click="emit('navigate', 'cancel')" type="button">Отменa</ui-button>
  </form>
</template>