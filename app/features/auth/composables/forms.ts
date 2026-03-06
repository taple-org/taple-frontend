import { loginForm, loginSchema } from "~/features/auth/schemas/login.schema"
import { signUpForm, signUpSchema } from "~/features/auth/schemas/sign-up.schema"
import { forgotPasswordForm, forgotPasswordSchema } from '~/features/auth/schemas/forgot-password.schema'
import { resetPasswordForm, resetPasswordSchema } from "~/features/auth/schemas/reset-password.schema"



export const useSignUpForm = () => useRegleSchema(signUpForm, signUpSchema)
export const useLoginForm = () => useRegleSchema(loginForm, loginSchema)
export const useForgotPasswordForm = () => useRegleSchema(forgotPasswordForm, forgotPasswordSchema)
export const useResetPasswordForm = () => useRegleSchema(resetPasswordForm, resetPasswordSchema)