import { TokenKey, RefreshTokenKey } from '~/constants/api.constants'
import type { AuthUser } from '~/types/api.types'
import { ApiException } from '~/repositories/repository.helpers'
import type { RegleExternalErrorTree } from '@regle/core'

export const useAuthStore = defineStore('auth', () => {
    const notification = useNotification()
    const router = useRouter()
    const { $api } = useNuxtApp()

    const user = ref<AuthUser | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    
    const pendingEmail = ref<string>('')
    const otpType = ref<'signup' | 'recovery' | null>(null)
    const resetToken = ref<string>('')

    const isAuthenticated = computed(() => !!user.value)

    function setAuth(authUser: AuthUser | null, accessToken?: string) {
        user.value = authUser
        if (import.meta.client) {
            if (accessToken) {
                localStorage.setItem(TokenKey, accessToken)
            } else if (!authUser) {
                localStorage.removeItem(TokenKey)
            }
        }
    }

    function clearAuth() {
        user.value = null
        if (import.meta.client) {
            localStorage.removeItem(TokenKey)
            localStorage.removeItem(RefreshTokenKey)
        }
    }

    function setPendingEmail(email: string) {
        pendingEmail.value = email
    }
    function resetPendingEmail() {
        pendingEmail.value = ''
        otpType.value = null
    }

    function withLoading<T extends unknown[]>(
        fn: (...args: T) => Promise<void>,
        externalErrors?: Ref<RegleExternalErrorTree<any>>
    ) {
        return async (...args: T): Promise<boolean> => {
            isLoading.value = true
            error.value = null
            if (externalErrors) externalErrors.value = {}
            try {
                await fn(...args)
                return true
            } catch (e: unknown) {
                if (e instanceof ApiException) {
                    error.value = e.message
                    if (externalErrors && e.fieldErrors) {
                        externalErrors.value = e.fieldErrors as RegleExternalErrorTree<any>
                    }
                    notification.error('Ошибка', e.message)
                } else if (e instanceof Error) {
                    error.value = e.message
                    notification.error('Ошибка', e.message)
                } else {
                    error.value = 'Неизвестная ошибка'
                    notification.error('Ошибка', 'Неизвестная ошибка')
                }
                return false
            } finally {
                isLoading.value = false
            }
        }
    }

    const login = async ({ email, password }: { email: string; password: string }) => {
        const result = await $api.auth.login({ body: { email, password } })
        setAuth(result.user, result.tokens.access_token)
        if (import.meta.client && result.tokens.refresh_token) {
            localStorage.setItem(RefreshTokenKey, result.tokens.refresh_token)
        }
        notification.success('Авторизация', 'Вы успешно вошли в аккаунт')
        await router.push('/')
    }

    const register = async ({ email, password }: { email: string; password: string }) => {
        setPendingEmail(email)
        otpType.value = 'signup'
        await $api.auth.signUp({ body: { email, password } })
        notification.success('Код подтверждения отправлен на почту!')
    }

    const verifyOtp = withLoading(async (email: string, token: string) => {
        if (otpType.value === 'signup') {
            const result = await $api.auth.verifyEmail({ body: { email, otp_code: token } })
            setAuth(result.user, result.tokens.access_token)
            if (import.meta.client && result.tokens.refresh_token) {
                localStorage.setItem(RefreshTokenKey, result.tokens.refresh_token)
            }
            notification.success('Email подтверждён!')
            await router.push('/')
            resetPendingEmail()
        } 
        else if (otpType.value === 'recovery') {
            const result = await $api.auth.forgotPasswordVerify({ body: { email, otp_code: token } })
            resetToken.value = result.reset_token
            // Переход на страницу "Новый пароль" выполнится компонентом (success изнутри confirm-code)
        }
    })

    const resendOtp = withLoading(async (email: string) => {
        // Предположим, что для отправки кода ещё раз вы используете тот же эндпоинт отправки.
        // Или если у бэкенда нет resendOtp, то присылайте запрос снова на \register или \forgot-password
        if (otpType.value === 'signup') {
            await $api.auth.resendOtp({ body: { email } })
        } else if (otpType.value === 'recovery') {
            await $api.auth.forgotPassword({ body: { email } })
        }
        notification.success('Код отправлен повторно!')
    })

    const initSession = withLoading(async () => {
        if (import.meta.client) {
            const token = localStorage.getItem(TokenKey)
            if (!token) return
        }
        const me = await $api.auth.me({})
        setAuth(me)
    })

    const signOut = withLoading(async () => {
        try {
            await $api.auth.logout({})
        } finally {
            clearAuth()
        }
    })

    const forgotPassword = async ({ email }: { email: string }) => {
        setPendingEmail(email)
        otpType.value = 'recovery'
        await $api.auth.forgotPassword({ body: { email } })
        notification.success('Код для восстановления пароля отправлен на почту!')
    }

    const resetPassword = async ({ password }: { password: string }) => {
        await $api.auth.forgotPasswordReset({ body: { password, reset_token: resetToken.value } })
        notification.success('Успешно сбросили пароль')
        resetPendingEmail()
    }

    return {
        user,
        isLoading,
        error,
        pendingEmail,
        otpType,

        isAuthenticated,

        setPendingEmail,
        resetPendingEmail,
        login,
        register,
        verifyOtp,
        resendOtp,
        initSession,
        signOut,
        forgotPassword,
        resetPassword,
        withLoading,
    }
})