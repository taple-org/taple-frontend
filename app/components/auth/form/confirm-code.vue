<script lang="ts" setup>
import { useOTP } from "~/composables/useOTP";
import type {ConfirmActionsType} from "~/interfaces/auth/modal";
import styles from '~/components/auth/form/index.module.css'
const emit = defineEmits<{ "navigate": [actions: ConfirmActionsType] }>();
const authStore = useAuthStore();

const {resend, verify, countdown, otp} = useOTP(
    60,
    async ({valueAsString}) => {
      const ok = await authStore.verifyOtp(authStore.pendingEmail, valueAsString)
      if (ok) emit('navigate', 'success')
    },
    () => authStore.resendOtp(authStore.pendingEmail)
);

</script>

<template>
  <form :class="styles.form" class="otp-form" @submit.prevent>
    <ui-fields-pin-input-field
      v-model="otp"
      :count="8"
      @value-complete="verify"
      :disabled="authStore.isLoading"
    />

    <p v-if="countdown > 0" class="otp-form__timer">
      <strong>{{ countdown }}</strong> секунд
    </p>
    <span v-else class="otp-form-refresh" @click.prevent="resend">Отправить код снова</span>
    <ui-button variant="outline"
               type="button"
               @click="emit('navigate', 'close')"
               :disabled="authStore.isLoading"
    >
      Закрыть
    </ui-button>
  </form>
</template>

<style lang="css">
.otp-form {
  align-items: center;
  text-align: center;
}
.otp-form-refresh {
  font-size: 10px;
  font-weight: 400;
  line-height: 20px;
  cursor: pointer;
  color: var(--color-primary);
}
.otp-form__timer {
  font-size: 16px;
  font-weight: 300;
  line-height: 34px;
  color: var(--color-black);
  letter-spacing: 0.38px;
}

.otp-form__timer strong {
  font-weight: 700;
}
</style>
