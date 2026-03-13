<script lang="ts" setup>
import {AuthFormLogin, AuthFormNewPassword, AuthFormPasswordRecovery, AuthFormRegister} from "#components";
import {AuthFormOtpForm} from "#components";

const { to } = useAuthDialog()
const { isOpen, current, direction } = storeToRefs(useAuthDialog())


const forms: Record<Step, { title: string; description: string; component: Component }> = {
  [Step.Login]: {
    title: 'Вход',
    description: 'Добро пожаловать в Taple.kz',
    component: AuthFormLogin
  },
  [Step.Register]: {
    title: 'Регистрация',
    description: 'Введите данный для регистрации',
    component: AuthFormRegister
  },
  [Step.Recovercy]: {
    title: 'Восстановление пароля',
    description: 'Укажите вашу электронную почту',
    component: AuthFormPasswordRecovery
  },
  [Step.NewPassword]: {
    title: 'Создание нового пароля',
    description: 'Придумайте ваш новый пароль',
    component: AuthFormNewPassword
  },
  [Step.OTP]: {
    title: 'Подтверждение email',
    description: 'Введите 8-значный код подтверждения отправленный на ваш адрес электронной почты',
    component: AuthFormOtpForm
  },

}

</script>

<template>
  <ui-dialog v-model:open="isOpen" v-bind="forms[current]">
    <Transition :name="`slide-${direction}`" mode="out-in">
      <component
          :is="forms[current].component"
          :key="current"
          @go-to="to"
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
  transition: all 0.24s ease;
}
</style>