<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'
import { useRecoveryPasswordForm } from '~/composables/auth/useRecoveryPasswordForm';
import type {RecoveryActionsType} from "~/interfaces/auth/modal";

const emit = defineEmits<{ 'navigate': [actions: RecoveryActionsType ] }>();

const { r$ } = useRecoveryPasswordForm();
// const {setPendingEmail, forgotPassword} = useAuthStore();
const handleSubmit = async () => {
  const values = await r$.$validate();
  if(!values.valid) return;

  // setPendingEmail(values.data.email);
  // const ok = await forgotPassword(values.data);
  
  // if(ok)
  emit('navigate', 'success');
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
