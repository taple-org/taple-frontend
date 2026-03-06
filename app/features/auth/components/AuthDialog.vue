<script lang="ts" setup>
import { useAuthDialog } from '~/features/auth';
import LoginForm from "~/features/auth/components/LoginForm.vue";
import SignUpForm from "~/features/auth/components/SignUpForm.vue";

const { goTo } = useAuthDialog()
const { isOpen, currentStep, direction } = storeToRefs(useAuthDialog())

const titles = {
  login: 'Вход',
  signup: 'Регистрация',
  otp: 'Подтверждение',
  'forgot-password': 'Восстановление пароля'
}
</script>

<template>
  <ui-dialog v-model:open="isOpen" :title="titles[currentStep]">
    <Transition :name="`slide-${direction}`" mode="out-in">
      <LoginForm    v-if="currentStep === 'login'"    :key="'login'"    @go-to="goTo" />
      <SignUpForm   v-else-if="currentStep === 'signup'"  :key="'signup'"   @go-to="goTo" />
      <!-- <OtpForm     v-else-if="currentStep === 'otp'"    :key="'otp'"     @go-to="goTo" /> -->
    </Transition>
  </ui-dialog>
</template>

<style>
.slide-forward-enter-from { transform: translateX(40px); opacity: 0; }
.slide-forward-leave-to   { transform: translateX(-40px); opacity: 0; }

.slide-back-enter-from { transform: translateX(-40px); opacity: 0; }
.slide-back-leave-to   { transform: translateX(40px); opacity: 0; }

.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.12s ease;
}
</style>