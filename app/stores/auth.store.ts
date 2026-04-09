import { TokenKey, RefreshTokenKey } from '~/constants/api.constants'
import type { AuthUser } from '~/types/api.types'
import type { RegleExternalErrorTree } from '@regle/core'

export const useAuthStore = defineStore('auth', () => {
    const notification = useNotification()
    const router = useRouter()
    const { $apiClient } = useNuxtApp()

    const user = ref<AuthUser | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const isHydrated = ref<boolean>(false)

    const pendingEmail = ref<string>('')
    const otpType = ref<'signup' | 'recovery' | null>(null)
    const resetToken = ref<string>('')

    const isAuthenticated = computed(() => !!user.value)
    function hydrated(){
        isHydrated.value = true;
    }

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


    function extractApiClientError(e: unknown): { message: string; fieldErrors?: Record<string, string[]> } | null {
        if (e === null || typeof e !== 'object' || e instanceof Error) return null
        const resp = e as Record<string, unknown>
        if (typeof resp.status !== 'number' || !('error' in resp)) return null

        const body = resp.error as Record<string, unknown> | null | undefined
        if (!body) return { message: 'Неизвестная ошибка' }

        const meta = body.meta as Record<string, unknown> | undefined
        if (meta?.error) {
            const apiError = meta.error as {
                message?: Record<string, string>
                type?: string
                fields?: Record<string, Record<string, string>>
            }
            const message = apiError.message?.ru ?? apiError.message?.en ?? apiError.type ?? 'Ошибка'
            const fieldErrors: Record<string, string[]> = {}
            if (apiError.fields) {
                for (const [field, msgs] of Object.entries(apiError.fields)) {
                    fieldErrors[field] = [msgs.ru ?? msgs.en ?? '']
                }
            }
            return { message, fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined }
        }

        if (Array.isArray(body.detail)) {
            const details = body.detail as Array<{ loc?: (string | number)[]; msg?: string }>
            const fieldErrors: Record<string, string[]> = {}
            for (const ve of details) {
                const field = ve.loc?.[ve.loc.length - 1]
                if (field && typeof field === 'string') {
                    if (!fieldErrors[field]) fieldErrors[field] = []
                    if (ve.msg) fieldErrors[field].push(ve.msg)
                }
            }
            const message = details[0]?.msg ?? 'Ошибка валидации'
            return { message, fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined }
        }

        return { message: 'Неизвестная ошибка' }
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
                const apiClientError = extractApiClientError(e)
                if (apiClientError) {
                    error.value = apiClientError.message
                    if (externalErrors && apiClientError.fieldErrors) {
                        externalErrors.value = apiClientError.fieldErrors as RegleExternalErrorTree<any>
                    }
                    notification.error('Ошибка', apiClientError.message)
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
        const tokenResp = await $apiClient.api.loginApiV1AuthLoginPost({ email, password })
        const tokens = tokenResp.data.result
        if (import.meta.client) {
            localStorage.setItem(TokenKey, tokens.access_token)
            if (tokens.refresh_token) {
                localStorage.setItem(RefreshTokenKey, tokens.refresh_token)
            }
        }
        const meResp = await $apiClient.api.meApiV1AuthMeGet()
        setAuth(meResp.data.result, tokens.access_token)
        notification.success('Авторизация', 'Вы успешно вошли в аккаунт')
        await router.push('/')
    }

    const register = async ({
        first_name,
        last_name,
        email,
        password,
        password_confirm,
    }: {
        first_name: string
        last_name: string
        email: string
        password: string
        password_confirm: string
    }) => {
        setPendingEmail(email)
        otpType.value = 'signup'
        await $apiClient.api.signUpApiV1AuthSignUpPost({ first_name, last_name, email, password, password_confirm })
        notification.success('Код подтверждения отправлен на почту!')
    }

    const verifyOtp = withLoading(async (email: string, token: string) => {
        if (otpType.value === 'signup') {
            await $apiClient.api.verifyEmailApiV1AuthVerifyEmailPost({ email, code: token })
            notification.success('Email подтверждён!')
            resetPendingEmail()
        } else if (otpType.value === 'recovery') {
            const result = await $apiClient.api.forgotPasswordVerifyApiV1AuthForgotPasswordVerifyPost({ email, code: token })
            resetToken.value = result.data.result.reset_token
        }
    })

    const resendOtp = withLoading(async (email: string) => {
        const purpose = otpType.value === 'signup' ? 'email_verification' : 'password_reset'
        await $apiClient.api.resendOtpApiV1AuthResendOtpPost({ email, purpose })
        notification.success('Код отправлен повторно!')
    })

    const initSession = withLoading(async () => {
        if (import.meta.client) {
            const token = localStorage.getItem(TokenKey)
            if (!token) return
        }
        const meResp = await $apiClient.api.meApiV1AuthMeGet()
        setAuth(meResp.data.result)
    })

    const signOut = withLoading(async () => {
        clearAuth()
    })

    const forgotPassword = async ({ email }: { email: string }) => {
        setPendingEmail(email)
        otpType.value = 'recovery'
        await $apiClient.api.forgotPasswordApiV1AuthForgotPasswordPost({ email })
        notification.success('Код для восстановления пароля отправлен на почту!')
    }

    const resetPassword = async ({ password, confirmPassword }: { password: string; confirmPassword: string }) => {
        await $apiClient.api.resetPasswordApiV1AuthForgotPasswordResetPost({
            reset_token: resetToken.value,
            new_password: password,
            new_password_confirm: confirmPassword,
        })
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
        isHydrated,
        hydrated,

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
