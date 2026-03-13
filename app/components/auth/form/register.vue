<script lang="ts" setup>
import styles from '~/components/auth/form/index.module.css'

const emit = defineEmits<{ 'go-to': [step: Step] }>()
const { close } = useAuthDialog()
const { r$ } = useRegisterForm()
const otpStore = useOtpAuth()
const { isLoading, error } = storeToRefs(otpStore)
const { registerWithOtp } = otpStore

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  const values = await r$.$validate()
  if(!values.valid) return;
  
  // Register user and send OTP
  const { success } = await registerWithOtp(values.data.email, values.data.password)
  
  if (success) {
    // Navigate to OTP verification step
    emit('go-to', Step.OTP)
  }
}

</script>
<template>
  <form :class="styles.form" @submit="handleSubmit">
    <ui-form-field
        type="text"
        v-model="r$.$value.email"
        :error="r$.email.$errors[0]"
        placeholder="Введите email"
    />
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
    <ui-form-field
        type="checkbox"
        v-model="r$.$value.agree"
        :error="r$.agree.$errors[0]"
        label="Я ознакомился(лась) с условиями сервиса и полностью согласен(а) с ними."
    />
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <ui-button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Регистрация...' : 'Продолжить' }}
    </ui-button>
    <span :class="styles.formText">У вас уже есть учетная запись?</span>
    <ui-button variant="outline" type="button" @click.prevent="emit('go-to', Step.Login)">Войти</ui-button>
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
