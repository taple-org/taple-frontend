<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'
const emit = defineEmits<{ 'go-to': [step: Step] }>()

const { r$ } = useNewPasswordForm();

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  const values = await r$.$validate()
  if(!values.valid) return;
  emit('go-to', Step.Login);
}
</script>
<template>
  <form :class="styles.form" @submit="handleSubmit">
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
    <ui-button variant="outline" type="button" @click="emit('go-to', Step.Login)">Отменa</ui-button>
  </form>
</template>