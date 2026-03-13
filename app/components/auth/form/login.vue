<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'

const emit = defineEmits<{ 'go-to': [step: Step] }>()

const { close } = useAuthDialog()
const { r$ } = useLoginForm();
const {$api} = useNuxtApp()
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  const values = await r$.$validate()
  if(!values.valid) return;
  const { token } = $api.auth.login(values);

  close();

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
          label="Запомнить меня" />
      <nuxt-link to="" class="forget-password" @click.prevent="emit('go-to', Step.Recovercy)">Забыли пароль?</nuxt-link>
    </div>
    <ui-button type="submit">Войти</ui-button>
    
    <span :class="styles.formText">Впервые на нашем сайте?</span>
    <ui-button variant="outline" type="button" @click="emit('go-to', Step.Register)">Зарегистрироваться</ui-button>
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