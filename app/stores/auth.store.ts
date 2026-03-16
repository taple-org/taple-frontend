import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
    const notification = useNotification()
    const router = useRouter()
    const { $api } = useNuxtApp()

    const user = ref<User | null>(null)
    const session = ref<Session | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const pendingEmail = ref<string>('')

    const isAuthenticated = computed(() => !!session.value)

    function setSession(s: Session | null) {
        session.value = s
        user.value = s?.user ?? null
    }
    function setPendingEmail(email: string) {
        pendingEmail.value = email
    }
    function resetPendingEmail() {
        pendingEmail.value = ''
    }

    function withLoading<T extends unknown[]>(fn: (...args: T) => Promise<void>) {
        return async (...args: T): Promise<boolean> => {
            isLoading.value = true
            error.value = null
            try {
                await fn(...args)
                return true
            } catch (e: any) {
                error.value = e.message
                notification.error('Ошибка', e.message)
                return false
            } finally {
                isLoading.value = false
            }
        }
    }

    const login = withLoading(async ({email, password}: {email: string, password: string}) => {
        const { data, error: err } = await $api.auth.login(email, password)
        if (err) throw err
        setSession(data.session)
        notification.success('Авторизация', 'Вы успешно вошли в аккаунт')
        await router.push('/')
    })

    const register = withLoading(async ({email, password}: {email: string, password: string}) => {
        setPendingEmail(email)
        const { data, error: err } = await $api.auth.register(email, password)
        if (err) throw err
        notification.success('Код подтверждения отправлен на почту!')
    })

    const verifyOtp = withLoading(async (email: string, token: string) => {
        const { data, error: err } = await $api.auth.verifyOtp(email, token)
        if (err) throw err
        if (data.session) {
            setSession(data.session)
            notification.success('Email подтверждён!')
            await router.push('/')
        }
    })

    const resendOtp = withLoading(async (email: string) => {
        const { error: err } = await $api.auth.resendOtp(email)
        if (err) throw err
        notification.success('Код отправлен повторно!')
    })

    const initSession = withLoading(async () => {
        const { data, error: err } = await $api.auth.getSession()
        if (err) throw err
        setSession(data.session)
    })

    const signOut = withLoading(async () => {
        const { error: err } = await $api.auth.signOut()
        if (err) throw err
        setSession(null)
    })
    const forgotPassword = withLoading(async ({ email } : { email: string }) => {
        const { error: err } = await $api.auth.forgotPassword(email)
        if (err) throw err
        notification.info('Сброс пароля', 'Вам в почту скоро должно прийти сообщения по сбросу пароля')
    })
    const resetPassword = withLoading(async ({ password } : { password: string }) => {
        const { error: err } = await $api.auth.resetPassword(password)
        if(err) throw err

        notification.success('Успешно сбросили пароль')
    })

    return {
        user,
        session,
        isLoading,
        error,
        pendingEmail,

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
        resetPassword
    }
})