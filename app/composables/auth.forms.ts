import {
    loginSchema, registerSchema, newPasswordSchema, recoveryPasswordSchema,
    LoginFormState, RegisterFormState, RecoveryPasswordFormState, NewPasswordFormState
} from "~/schemas/auth.schemas";

export const useRegisterForm = () => useRegleSchema(RegisterFormState, registerSchema)
export const useLoginForm = () => useRegleSchema(LoginFormState, loginSchema)
export const useRecoveryPasswordForm = () => useRegleSchema(RecoveryPasswordFormState, recoveryPasswordSchema)
export const useNewPasswordForm = () => useRegleSchema(NewPasswordFormState, newPasswordSchema)