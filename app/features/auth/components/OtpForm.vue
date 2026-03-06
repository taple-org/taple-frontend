<script lang="ts" setup>
import type { AuthStep } from "~/features/auth/composables/useAuthDialog";

const emit = defineEmits<{ "go-to": [step: AuthStep] }>();

const otp = ref<string[]>([]);
const countdown = ref(60);
let timer: ReturnType<typeof setInterval> | null = null;

function startCountdown() {
  countdown.value = 60;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else if (timer) {
      clearInterval(timer);
    }
  }, 1000);
}

function handleComplete(details: { value: string[]; valueAsString: string }) {
  console.log("OTP complete:", details.valueAsString);
}

onMounted(startCountdown);
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <form class="otp-form" @submit.prevent>
    <p class="otp-form__subtitle">
      Введите 6-значный код подтверждения отправленный на ваш адрес электронной
      почты
    </p>

    <ui-fields-pin-input-field
      v-model="otp"
      :count="6"
      @value-complete="handleComplete"
    />

    <p v-if="countdown > 0" class="otp-form__timer">
      <strong>{{ countdown }}</strong> секунд
    </p>
    <nuxt-link v-else href="" @click.prevent="startCountdown"
      >Отправить код снова</nuxt-link
    >

    <ui-button variant="outline" type="button" @click="emit('go-to', 'login')">
      Закрыть
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

.otp-form__subtitle {
  font-weight: 300;
  font-size: 13px;
  line-height: 14px;
  color: var(--color-black);
}

.otp-form__timer {
  font-size: 16px;
  font-weight: 300;
  color: var(--color-black);
  letter-spacing: 0.38px;
}

.otp-form__timer strong {
  font-weight: 700;
}
</style>
