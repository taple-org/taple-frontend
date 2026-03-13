import * as z from 'zod'
import type {RegisterForm, LoginForm, NewPasswordForm, RecoveryPasswordForm, OtpRequestForm} from "~/interfaces/auth.interfaces";

const passwordRegister = {
    password: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' }))
        .check(z.minLength(6, { error: 'Минимум 6 символов' })),
    confirmPassword: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' })),
}

export const LoginFormState = ref<LoginForm>({ email: '', password: '', rememberMe: false })
export const RecoveryPasswordFormState = ref<RecoveryPasswordForm>({ email: ''  })
export const NewPasswordFormState = ref<NewPasswordForm>({ password: '', confirmPassword: '' })
export const RegisterFormState = ref<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
})

export const OtpRequestFormState = ref<OtpRequestForm>({ email: '' })


export const loginSchema = computed(() => inferSchema(LoginFormState, z.object({
    email: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' }))
        .check(z.email({ error: 'Некорректный email' })),
    password: z.string('Обязательное поле')
        .check(z.minLength(6, { error: 'Минимум 6 символов' })),
    rememberMe: z.boolean()
})))


export const recoveryPasswordSchema = computed(() => inferSchema(RecoveryPasswordFormState, z.object({
    email: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' }))
        .check(z.email({ error: 'Некорректный email' })),
})))

export const newPasswordSchema = computed(() =>
    inferSchema(NewPasswordFormState,
        z.object({
            ...passwordRegister
        }).superRefine(({ password, confirmPassword }, ctx) => {
            passwordMatch(password, confirmPassword, ctx)
        })
    )
)

export const registerSchema = computed(() =>
    inferSchema(RegisterFormState,
        z.object({
            email: z.string()
                .check(z.minLength(1, { error: 'Обязательное поле' }))
                .check(z.email({ error: 'Некорректный email' })),
            ...passwordRegister,
            agree: z.boolean()
                .check(z.refine(val => val === true, { error: 'Необходимо принять условия' }))
        }).superRefine(({ password, confirmPassword }, ctx) => {
            passwordMatch(password, confirmPassword, ctx)
        })
    )
)

export const otpRequestSchema = computed(() => inferSchema(OtpRequestFormState, z.object({
    email: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' }))
        .check(z.email({ error: 'Некорректный email' })),
})))
