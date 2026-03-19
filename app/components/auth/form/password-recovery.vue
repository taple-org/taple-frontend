<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'
import type {RecoveryActionsType} from "~/interfaces/auth/auth.modal.interfaces";
import type { RegleExternalErrorTree } from '@regle/core'
import type { RecoveryPasswordForm } from '~/interfaces/auth/auth.form.interfaces'
import { ApiException } from '~/repositories/repository.helpers'

const emit = defineEmits<{ 'navigate': [actions: RecoveryActionsType ] }>();

const externalErrors = ref<RegleExternalErrorTree<RecoveryPasswordForm>>({})
const { r$ } = useRecoveryPasswordForm(externalErrors);
const {setPendingEmail, forgotPassword, withLoading} = useAuthStore();

const handleSubmit = async () => {
  externalErrors.value = {}
  const values = await r$.$validate();
  if(!values.valid) return;

  setPendingEmail(values.data.email);
  
  const ok = await withLoading(
    async () => {
      await forgotPassword(values.data);
      emit('navigate', 'success');
    },
    (e: ApiException) => {
      if (e.fieldErrors) {
        externalErrors.value = e.fieldErrors as RegleExternalErrorTree<RecoveryPasswordForm>
      }
    }
  )();
}
</script>
<template>
  <form :class="styles.form" @submit.prevent="handleSubmit">
    <ui-form-field
        v-model="r$.$value.email"
        type="text"
        placeholder="Введите email"
        :error="r$.email.$errors[0]"
    />
    <ui-button type="submit">Восстановить</ui-button>
    <span :class="styles.formText">или</span>
    <ui-button variant="outline" @click="emit('navigate', 'cancel')" type="button">Отменить</ui-button>
  </form>
</template>
