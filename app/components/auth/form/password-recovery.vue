<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'
import type {RecoveryActionsType} from "~/interfaces/auth/auth.modal.interfaces";

const emit = defineEmits<{ 'navigate': [actions: RecoveryActionsType ] }>();

const { r$ } = useRecoveryPasswordForm();

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  const values = await r$.$validate();
  if(!values.valid) return;

  console.log(values.data);
  emit('navigate', 'success');
}
</script>
<template>
  <form :class="styles.form" @submit="handleSubmit">
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
