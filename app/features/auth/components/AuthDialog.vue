<script lang="ts" setup>
import { useAuthDialog } from '~/features/auth';
import LoginForm from "./LoginForm.vue";
import SignUpForm from "./SignUpForm.vue";
import ForgotPasswordForm from './ForgotPasswordForm.vue';
import ResetPasswordForm from './ResetPasswordForm.vue';

import type { AuthStep } from '../composables/useAuthDialog';

const { goTo } = useAuthDialog()
const { isOpen, currentStep, direction } = storeToRefs(useAuthDialog())


const forms: Record<AuthStep, { title: string; description: string; component: Component }> = {
  'login': {
    title: 'Вход',
    description: 'Добро пожаловать в Taple.kz',
    component: LoginForm
  },
  'signup': {
    title: 'Регистрация',
    description: 'Введите данный для регистрации',
    component: SignUpForm
  },
  'forgot-password': {
    title: 'Восстановление пароля',
    description: 'Укажите вашу электронную почту',
    component: ForgotPasswordForm
  },
  'reset-password': {
    title: 'Создание нового пароля',
    description: 'Придумайте ваш новый пароль',
    component: ResetPasswordForm
  },

}

</script>

<template>
  <ui-dialog v-model:open="isOpen" v-bind="forms[currentStep]">
    <Transition :name="`slide-${direction}`" mode="out-in">
      <component
        :is="forms[currentStep].component"
        :key="currentStep"
        @go-to="goTo"
      />
    </Transition>
  </ui-dialog>
</template>

<style scoped>
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