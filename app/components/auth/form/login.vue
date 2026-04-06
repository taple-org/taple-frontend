<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'
import { useLoginForm } from '~/composables/auth/useLoginForm';
import type { LoginActionsType } from "~/interfaces/auth/modal";

const emit = defineEmits<{ 'navigate': [actions: LoginActionsType] }>()
const authStore = useAuthStore();

const { r$ } = useLoginForm();
const handleSubmit = async () => {
  const values = await r$.$validate()
  if(!values.valid) return;
  // const ok = await authStore.login(values.data);
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
    <ui-form-field
        v-model="r$.$value.password"
        type="password"
        placeholder="Введите пароль"
        :error="r$.password.$errors[0]"
    />
    <div class="inline">
      <ui-form-field
          v-model="r$.$value.rememberMe"
          type="checkbox"
          :error="r$.rememberMe.$errors[0]"
          label="Запомнить меня"
      />
      <span @click.prevent="() => {
        emit('navigate', 'recovery')
      }" class="forget-password">Забыли пароль?</span>
    </div>
    <ui-button
        type="submit"
    >Войти</ui-button>
    
    <span :class="styles.formText">Впервые на нашем сайте?</span>
    <ui-button variant="outline"
               @click="emit('navigate', 'register')"
               type="button"
    >Зарегистрироваться</ui-button>
    <ui-info-section size="sm">
      Я пользователь информационной системы «Taple», продолжая работу на портале подтверждаю свое согласие, что несу ответственность за все осуществленные действия в соответствии с законодательством Республики Казахстан
    </ui-info-section>
  </form>
</template>
<style scoped lang="css">
.forget-password{
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  font-family: var(--font-base), sans-serif;
  color: var(--color-highlight-d);
}
.inline{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>