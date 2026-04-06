/** Общая обёртка ответа API */

export type ApiErrorFields = Record<string, Record<string, string>>

export type ApiError = {
    message: Record<string, string>
    type: string
    fields?: ApiErrorFields
}

export type ApiPagination = {
    page: number
    per_page: number
    total: number
    total_pages: number
}

export type ApiMeta = {
    code: number
    issue_date: string
    error?: ApiError
    pagination?: ApiPagination
}

export type ApiResponse<T = unknown> = {
    meta: ApiMeta
    result: T
}

/** Auth-специфичные типы */

export type AuthTokens = {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
}

export type AuthUser = {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
}

/** POST /api/v1/auth/login */
export type LoginResult = {
    user: AuthUser
    tokens: AuthTokens
}

/** POST /api/v1/auth/sign-up */
export type SignUpResult = {
    email: string
    otp_code?: string
}

/** POST /api/v1/auth/verify-email */
export type VerifyEmailResult = {
    user: AuthUser
    tokens: AuthTokens
}

/** POST /api/v1/auth/forgot-password — запрос OTP на почту */
export type ForgotPasswordResult = {
    email: string
}

/** POST /api/v1/auth/forgot-password/verify — подтверждение OTP, получение reset-токена */
export type ForgotPasswordVerifyResult = {
    reset_token: string
}

/** POST /api/v1/auth/forgot-password/reset — установка нового пароля */
export type ForgotPasswordResetResult = {
    success: boolean
}

/** POST /api/v1/auth/change-password — смена пароля авторизованным пользователем */
export type ChangePasswordResult = {
    success: boolean
}

/** POST /api/v1/auth/refresh */
export type RefreshTokenResult = {
    tokens: AuthTokens
}

/** GET /api/v1/auth/me */
export type MeResult = AuthUser
