<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'
import type {NewPasswordActionsType} from "~/interfaces/auth/auth.modal.interfaces";
const emit = defineEmits<{ 'navigate': [actions: NewPasswordActionsType] }>()

const { r$ } = useNewPasswordForm();

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  const values = await r$.$validate()
  if(!values.valid) return;
  emit('navigate', 'success');
}
</script>
<template>
  <form :class="styles.form" @submit="handleSubmit">
    <ui-form-field
        type="password"
        v-model="r$.$value.password"
        :error="r$.password.$errors[0]"
        placeholder="Введите пароль"
    />
    <ui-form-field
        type="password"
        v-model="r$.$value.confirmPassword"
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