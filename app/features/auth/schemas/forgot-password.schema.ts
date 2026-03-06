import * as z from "zod";

export type ForgotPasswordForm = {
  email: string;
}

export const forgotPasswordForm = ref<ForgotPasswordForm>({ email: ''  })

export const forgotPasswordSchema = computed(() => inferSchema(forgotPasswordForm, z.object({
  email: z.string()
    .check(z.minLength(1, { error: 'Обязательное поле' }))
    .check(z.email({ error: 'Некорректный email' })),
})))


