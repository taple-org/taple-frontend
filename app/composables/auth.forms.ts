import {
    loginSchema, registerSchema, newPasswordSchema, recoveryPasswordSchema,
    LoginFormState, RegisterFormState, RecoveryPasswordFormState, NewPasswordFormState
} from "~/schemas/auth.schemas";
import type { RegleExternalErrorTree } from '@regle/core'

export const useRegisterForm = (externalErrors?: Ref<RegleExternalErrorTree<typeof RegisterFormState.value>>) => 
    useRegleSchema(RegisterFormState, registerSchema, { externalErrors })

export const useLoginForm = (externalErrors?: Ref<RegleExternalErrorTree<typeof LoginFormState.value>>) => 
    useRegleSchema(LoginFormState, loginSchema, { externalErrors })

export const useRecoveryPasswordForm = (externalErrors?: Ref<RegleExternalErrorTree<typeof RecoveryPasswordFormState.value>>) => 
    useRegleSchema(RecoveryPasswordFormState, recoveryPasswordSchema, { externalErrors })

export const useNewPasswordForm = (externalErrors?: Ref<RegleExternalErrorTree<typeof NewPasswordFormState.value>>) => 
    useRegleSchema(NewPasswordFormState, newPasswordSchema, { externalErrors })