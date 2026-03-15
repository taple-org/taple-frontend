<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'
import type {RegisterActionsType} from "~/interfaces/auth/auth.modal.interfaces";

const emit = defineEmits<{ 'navigate': [actions: RegisterActionsType] }>()
const { r$ } = useRegisterForm()
const authStore = useAuthStore();


const handleSubmit = async (e: Event) => {
  const values = await r$.$validate()
  if(!values.valid) return;
  const ok = await authStore.register(values.data);
  if(ok) emit("navigate", 'success');

}

</script>
<template>
  <form :class="styles.form" @submit.prevent="handleSubmit">
    <ui-form-field
        v-model="r$.$value.email"
        type="text"
        :error="r$.email.$errors[0]"
        placeholder="Введите email"
    />
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
    <ui-form-field
        v-model="r$.$value.agree"
        type="checkbox"
        :error="r$.agree.$errors[0]"
        label="Я ознакомился(лась) с условиями сервиса и полностью согласен(а) с ними."
    />
    <ui-button type="submit" >Продолжить</ui-button>
    <span :class="styles.formText">У вас уже есть учетная запись?</span>
    <ui-button variant="outline" type="button" @click.prevent="emit('navigate', 'login')">Войти</ui-button>
  </form>
</template>
<style scoped lang="css">
.error-message {
  color: var(--color-error, #ef4444);
  font-size: 14px;
  padding: 8px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
  text-align: center;
}
</style>
