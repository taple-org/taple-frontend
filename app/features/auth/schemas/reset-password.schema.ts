import { z } from 'zod'

export type ResetPasswordForm = {
  password: string
  confirmPassword: string
}

export const resetPasswordForm = ref<ResetPasswordForm>({
  password: '',
  confirmPassword: '',
})

export const resetPasswordSchema = computed(() =>
  inferSchema(resetPasswordForm,
    z.object({
        password: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' }))
        .check(z.minLength(6, { error: 'Минимум 6 символов' })),
        confirmPassword: z.string()
        .check(z.minLength(1, { error: 'Обязательное поле' })),
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
