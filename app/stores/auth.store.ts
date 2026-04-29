import { TokenKey, RefreshTokenKey } from '~/constants/api.constants'
import type { AuthUser } from '~/types/api.types'
import type { RegleExternalErrorTree } from '@regle/core'

export const useAuthStore = defineStore('auth', () => {
    const notification = useNotification()
    const router = useRouter()
    const { $apiClient, $i18n } = useNuxtApp()
    const t = (key: string) => $i18n.t(key)
    const accessTokenCookie = useCookie<string | null>(TokenKey, {
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
    })
    const refreshTokenCookie = useCookie<string | null>(RefreshTokenKey, {
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
    })

    const user = ref<AuthUser | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const pendingEmail = ref<string>('')
    const otpType = ref<'signup' | 'recovery' | null>(null)
    const resetToken = ref<string>('')

    const isAuthenticated = computed(() => !!user.value)

    function setAuth(authUser: AuthUser | null, accessToken?: string) {
        user.value = authUser
        if (accessToken) {
            accessTokenCookie.value = accessToken
        } else if (!authUser) {
            accessTokenCookie.value = null
        }
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
        accessTokenCookie.value = null
        refreshTokenCookie.value = null
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
        if (!body) return { message: t('common.unknownError') }

        const meta = body.meta as Record<string, unknown> | undefined
        if (meta?.error) {
            const apiError = meta.error as {
                message?: Record<string, string>
                type?: string
                fields?: Record<string, Record<string, string>>
            }
            const message = apiError.message?.ru ?? apiError.message?.en ?? apiError.type ?? t('common.error')
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
            const message = details[0]?.msg ?? t('auth.validationError')
            return { message, fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined }
        }

        return { message: t('common.unknownError') }
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
                    notification.error(t('common.error'), apiClientError.message)
                } else if (e instanceof Error) {
                    error.value = e.message
                    notification.error(t('common.error'), e.message)
                } else {
                    error.value = t('common.unknownError')
                    notification.error(t('common.error'), t('common.unknownError'))
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
        accessTokenCookie.value = tokens.access_token
        refreshTokenCookie.value = tokens.refresh_token ?? null
        if (import.meta.client) {
            localStorage.setItem(TokenKey, tokens.access_token)
            if (tokens.refresh_token) {
                localStorage.setItem(RefreshTokenKey, tokens.refresh_token)
            }
        }
        const meResp = await $apiClient.api.meApiV1AuthMeGet()
        setAuth(meResp.data.result, tokens.access_token)
        notification.success(t('auth.loginSuccessTitle'), t('auth.loginSuccessDescription'))
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
        notification.success(t('common.success'), t('auth.verificationCodeSent'))
    }

    const verifyOtp = withLoading(async (email: string, token: string) => {
        if (otpType.value === 'signup') {
            await $apiClient.api.verifyEmailApiV1AuthVerifyEmailPost({ email, code: token })
            notification.success(t('common.success'), t('auth.emailVerified'))
            resetPendingEmail()
        } else if (otpType.value === 'recovery') {
            const result = await $apiClient.api.forgotPasswordVerifyApiV1AuthForgotPasswordVerifyPost({ email, code: token })
            resetToken.value = result.data.result.reset_token
        }
    })

    const resendOtp = withLoading(async (email: string) => {
        const purpose = otpType.value === 'signup' ? 'email_verification' : 'password_reset'
        await $apiClient.api.resendOtpApiV1AuthResendOtpPost({ email, purpose })
        notification.success(t('common.success'), t('auth.codeResent'))
    })

    const initSession = withLoading(async () => {
        const cookieToken = accessTokenCookie.value

        if (import.meta.client) {
            const token = localStorage.getItem(TokenKey) || cookieToken
            if (!token) return
            if (!localStorage.getItem(TokenKey) && token) {
                localStorage.setItem(TokenKey, token)
            }
        } else if (!cookieToken) {
            return
        }
        const meResp = await $apiClient.api.meApiV1AuthMeGet()
        setAuth(meResp.data.result)
    })

    const signOut = withLoading(async () => {
        clearAuth()
        navigateTo('/')
    })

    const forgotPassword = async ({ email }: { email: string }) => {
        setPendingEmail(email)
        otpType.value = 'recovery'
        await $apiClient.api.forgotPasswordApiV1AuthForgotPasswordPost({ email })
        notification.success(t('common.success'), t('auth.passwordResetCodeSent'))
    }

    const resetPassword = async ({ password, confirmPassword }: { password: string; confirmPassword: string }) => {
        await $apiClient.api.resetPasswordApiV1AuthForgotPasswordResetPost({
            reset_token: resetToken.value,
            new_password: password,
            new_password_confirm: confirmPassword,
        })
        notification.success(t('common.success'), t('auth.passwordResetSuccess'))
        resetPendingEmail()
    }

    return {
        user,
        isLoading,
        error,
        pendingEmail,
        otpType,

        isAuthenticated,
        clearAuth,
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
