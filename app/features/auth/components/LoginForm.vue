<script lang="ts" setup>
import type { AuthStep } from '~/features/auth/composables/useAuthDialog';

const emit = defineEmits<{ 'go-to': [step: AuthStep] }>()

const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({
    email: '',
    password: '',
    rememberMe: false,
    otp: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showOtpInput = ref(false)
const useOtpLogin = ref(false)

const handleLogin = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })
        if (error) throw error
        router.push('/')
    } catch (error: any) {
        errorMessage.value = error.message || 'Ошибка входа'
    } finally {
        isLoading.value = false
    }
}

const handleSendOtp = async () => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
        const { error } = await supabase.auth.signInWithOtp({
            email: form.email,
            options: {
                shouldCreateUser: false
            }
        })
        if (error) throw error
        showOtpInput.value = true
        successMessage.value = 'OTP код отправлен на ваш email'
    } catch (error: any) {
        errorMessage.value = error.message || 'Ошибка отправки OTP'
    } finally {
        isLoading.value = false
    }
}

const handleVerifyOtp = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const { error } = await supabase.auth.verifyOtp({
            email: form.email,
            token: form.otp,
            type: 'email'
        })
        if (error) throw error
        router.push('/')
    } catch (error: any) {
        errorMessage.value = error.message || 'Неверный OTP код'
    } finally {
        isLoading.value = false
    }
}

const handleRegister = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        })
        if (error) throw error
        alert("Регистрация успешна! Проверьте email (если включено подтверждение) или выполните вход.")
    } catch (error: any) {
        errorMessage.value = error.message || 'Ошибка регистрации'
    } finally {
        isLoading.value = false
    }
}

const toggleLoginMethod = () => {
    useOtpLogin.value = !useOtpLogin.value
    showOtpInput.value = false
    errorMessage.value = ''
    successMessage.value = ''
    form.otp = ''
}
</script>
<template>
    <form class="login-form" @submit.prevent="useOtpLogin ? (showOtpInput ? handleVerifyOtp() : handleSendOtp()) : handleLogin()">
        <ui-form-field
        type="text" 
        v-model="form.email" 
        placeholder="Введите email" 
        required
        />
        
        <ui-form-field 
        v-if="!useOtpLogin"
        type="password" 
        v-model="form.password" 
        placeholder="Введите пароль" 
        required
        />

        <ui-form-field 
        v-if="useOtpLogin && showOtpInput"
        type="text" 
        v-model="form.otp" 
        placeholder="Введите OTP код из email" 
        required
        />

        <div class="inline" v-if="!useOtpLogin">
            <ui-form-field 
            type="checkbox"
            v-model="form.rememberMe"
            label="Запомнить меня"
            />
            <nuxt-link to="" @click.prevent="emit('go-to', 'forgot-password')" class="forget-password">Забыли пароль?</nuxt-link>
        </div>

        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <ui-button type="submit" :disabled="isLoading">
            {{ useOtpLogin ? (showOtpInput ? 'Подтвердить OTP' : 'Отправить OTP') : 'Войти' }}
        </ui-button>

        <nuxt-link to="" @click.prevent="toggleLoginMethod" class="toggle-method">
            {{ useOtpLogin ? 'Войти с паролем' : 'Войти с OTP кодом' }}
        </nuxt-link>

        <nuxt-link to="#" class="to-tutorial">Впервые на нашем сайте?</nuxt-link>
        <ui-button type="button" variant="outline" @click="handleRegister" :disabled="isLoading">Зарегистрироваться</ui-button>
        <ui-info-section size="sm">
            Я пользователь информационной системы «Taple», продолжая работу на портале подтверждаю свое согласие, что несу ответственность за все осуществленные действия в соответствии с законодательством Республики Казахстан
        </ui-info-section>
    </form>
</template>
<style lang="css">
.login-form{
    width: 420px;
    display: flex;
    flex-direction: column;
    gap: 10px;

}
.to-tutorial{
    font-family: 'StyreneALC';
    font-size: 12px;
    font-weight: 300;
    text-align: center;
    color: var(--color-neutral-dd);

}
.forget-password{
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    font-family: var(--font-base);
    color: var(--color-highlight-d);
}
.inline{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.error-message {
    color: red;
    font-size: 14px;
    text-align: center;
    margin: 5px 0;
}

.success-message {
    color: green;
    font-size: 14px;
    text-align: center;
    margin: 5px 0;
}

.toggle-method {
    font-family: 'StyreneALC';
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: var(--color-highlight-d);
    cursor: pointer;
    text-decoration: underline;
}
</style>