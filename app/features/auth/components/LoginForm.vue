<script lang="ts" setup>
import type { AuthStep } from '~/features/auth/composables/useAuthDialog';

const emit = defineEmits<{ 'go-to': [step: AuthStep] }>()

const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({
    email: '',
    password: '',
    rememberMe: false
})

const isLoading = ref(false)
const errorMessage = ref('')

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
</script>
<template>
    <form class="login-form" @submit.prevent="handleLogin">
        <ui-form-field
        type="text" 
        v-model="form.email" 
        placeholder="Введите email" 
        required
        />
        <ui-form-field 
        type="password" 
        v-model="form.password" 
        placeholder="Введите пароль" 
        required
        />
        <div class="inline">
            <ui-form-field 
            type="checkbox"
            v-model="form.rememberMe"
            label="Запомнить меня"
            />
            <nuxt-link to="" @click.prevent="emit('go-to', 'forgot-password')" class="forget-password">Забыли пароль?</nuxt-link>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <ui-button type="submit" :disabled="isLoading">Войти</ui-button>
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
</style>