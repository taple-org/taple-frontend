<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'

const emit = defineEmits<{ 'go-to': [step: Step] }>();

const { r$ } = useRecoveryPasswordForm();

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  const values = await r$.$validate();
  if(!values.valid) return;

  console.log(values.data);
  emit('go-to', Step.NewPassword);
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
    <ui-button variant="outline" type="button" @click="emit('go-to', Step.Login)">Отменить</ui-button>
  </form>
</template>
