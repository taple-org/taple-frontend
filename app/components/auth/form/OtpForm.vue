<script lang="ts" setup>
import { Step } from '~/composables/useAuth'

const { close, to } = useAuthDialog()
const otpStore = useOtpAuth()
const { isLoading, error, email } = storeToRefs(otpStore)
const { verifyOtp, resendOtp } = otpStore

const otp = ref<string[]>([])
const countdown = ref(30)
const isResending = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdown.value = 30
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else if (timer) {
      clearInterval(timer)
    }
  }, 1000)
}

async function handleComplete(details: { value: string[]; valueAsString: string }) {
  if (!email.value) {
    console.error('Email not found')
    return
  }

  await verifyOtp(email.value, details.valueAsString)
}

async function handleResend() {
  if (countdown.value > 0 || !email.value) return
  
  isResending.value = true
  const { success } = await resendOtp(email.value)
  isResending.value = false
  
  if (success) {
    startCountdown()
  }
}

onMounted(() => {
  startCountdown()
  // If no email is set, go back to register form
  if (!email.value) {
    to(Step.Register)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <form class="otp-form" @submit.prevent>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <ui-fields-pin-input-field
      v-model="otp"
      :count="8"
      :disabled="isLoading"
      @value-complete="handleComplete"
    />

    <p v-if="countdown > 0" class="otp-form__timer">
      Отправить код снова через <strong>{{ countdown }}</strong> секунд
    </p>
    <button 
      v-else 
      class="otp-form-refresh" 
      type="button"
      :disabled="isResending"
      @click="handleResend"
    >
      {{ isResending ? 'Отправка...' : 'Отправить код снова' }}
    </button>

    <ui-button 
      variant="outline" 
      type="button" 
      :disabled="isLoading"
      @click="close()"
    >
      {{ isLoading ? 'Проверка...' : 'Закрыть' }}
    </ui-button>
  </form>
</template>

<style lang="css">
.otp-form {
  max-width: 424px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.error-message {
  color: var(--color-error, #ef4444);
  font-size: 14px;
  padding: 8px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
  width: 100%;
}

.otp-form-refresh {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  color: var(--color-primary);
  background: none;
  border: none;
  padding: 8px;
  text-decoration: underline;
}

.otp-form-refresh:hover:not(:disabled) {
  opacity: 0.8;
}

.otp-form-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
