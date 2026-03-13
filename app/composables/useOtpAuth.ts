import { supabase } from '~/lib/supabaseClient'
import type { AuthError } from '@supabase/supabase-js'

export const useOtpAuth = defineStore('otp-auth', () => {
  const router = useRouter()
  const notification = useNotification()
  const authStore = useAuthStore()
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const email = ref('')
  const password = ref('')

  // Register user and send OTP for email verification
  const registerWithOtp = async (userEmail: string, userPassword: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Sign up the user - Supabase will automatically send verification email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (signUpError) throw signUpError

      // Store email and password for later use
      email.value = userEmail
      password.value = userPassword
      
      notification.success('Код подтверждения отправлен на вашу почту!')
      
      return { success: true, data }
    } catch (err) {
      const authError = err as AuthError
      error.value = authError.message || 'Ошибка при регистрации'
      notification.error('Ошибка', error.value)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Verify OTP code sent to email
  const verifyOtp = async (userEmail: string, token: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: userEmail,
        token,
        type: 'email'
      })

      if (verifyError) throw verifyError

      if (data.session) {
        // Update auth store
        authStore.setSession(data.session)
        
        notification.success('Email подтвержден! Добро пожаловать!')
        
        // Redirect to main page
        await router.push('/')
        return { success: true, session: data.session }
      }
      
      return { success: false, error: 'Сессия не создана' }
    } catch (err) {
      const authError = err as AuthError
      error.value = authError.message || 'Неверный код подтверждения'
      notification.error('Ошибка', error.value)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Resend verification code
  const resendOtp = async (userEmail: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      })

      if (resendError) throw resendError
      
      notification.success('Код отправлен повторно!')
      
      return { success: true }
    } catch (err) {
      const authError = err as AuthError
      error.value = authError.message || 'Ошибка при отправке кода'
      notification.error('Ошибка', error.value)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    email,
    password,
    registerWithOtp,
    verifyOtp,
    resendOtp
  }
})
