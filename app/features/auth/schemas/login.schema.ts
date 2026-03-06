import * as z from "zod";

export type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const loginForm = ref<LoginForm>({ email: '', password: '', rememberMe: false })

export const loginSchema = computed(() => inferSchema(loginForm, z.object({
  email: z.string()
    .check(z.minLength(1, { error: 'Обязательное поле' }))
    .check(z.email({ error: 'Некорректный email' })),
  password: z.string('Обязательное поле')
    .check(z.minLength(6, { error: 'Минимум 6 символов' })),
  rememberMe: z.boolean()
})))


