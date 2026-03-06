import { z } from 'zod'

export type SignUpForm = {
  email: string
  password: string
  confirmPassword: string
  agree: boolean
}

export const signUpForm = ref<SignUpForm>({
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

export const signUpSchema = computed(() =>
  inferSchema(signUpForm,
    z.object({
      email: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' }))
        .check(z.email({ error: 'Некорректный email' })),

      password: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' }))
        .check(z.minLength(6, { error: 'Минимум 6 символов' })),

      confirmPassword: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' })),

      agree: z.boolean()
        .check(z.refine(val => val === true, { error: 'Необходимо принять условия' }))

    }).superRefine(({ password, confirmPassword }, ctx) => {
      if (password && confirmPassword && password !== confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],  
          message: 'Пароли не совпадают'
        })
      }
    })
  )
)
