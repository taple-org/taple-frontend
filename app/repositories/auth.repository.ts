import { build, post, get } from '~/repositories/repository.helpers'
import type {
    LoginResult,
    SignUpResult,
    VerifyEmailResult,
    ForgotPasswordResult,
    ForgotPasswordVerifyResult,
    ForgotPasswordResetResult,
    ChangePasswordResult,
    MeResult,
    RefreshTokenResult,
} from '~/types/api.types'

export function buildAuthRepository(fetcher: typeof $fetch) {
    return build(fetcher, {
        login: post<LoginResult, { email: string; password: string }>(
            '/api/v1/auth/login',
        ),
        signUp: post<SignUpResult, { email: string; password: string }>(
            '/api/v1/auth/sign-up',
        ),
        verifyEmail: post<VerifyEmailResult, { email: string; otp_code: string }>(
            '/api/v1/auth/verify-email',
        ),
        // У вас не было указано эндпоинта отправки повторного кода, поставил "/api/v1/auth/resend-otp" 
        // (Обязательно проверьте с бэкендерами)
        resendOtp: post<SignUpResult, { email: string }>(
            '/api/v1/auth/resend-otp',
        ),
        forgotPassword: post<ForgotPasswordResult, { email: string }>(
            '/api/v1/auth/forgot-password',
        ),
        forgotPasswordVerify: post<ForgotPasswordVerifyResult, { email: string; otp_code: string }>(
            '/api/v1/auth/forgot-password/verify',
        ),
        forgotPasswordReset: post<ForgotPasswordResetResult, { password: string; reset_token: string }>(
            '/api/v1/auth/forgot-password/reset',
        ),
        changePassword: post<ChangePasswordResult, { old_password: string; new_password: string }>(
            '/api/v1/auth/change-password',
        ),
        refreshToken: post<RefreshTokenResult, { refresh_token: string }>(
            '/api/v1/auth/refresh',
        ),
        me: get<MeResult>(
            '/api/v1/auth/me',
        ),
        // Эндпоинта логаута тоже не было в списке, временно оставляю как /api/v1/auth/logout
        logout: post<void, Record<string, never>>(
            '/api/v1/auth/logout',
        ),
    })
}
