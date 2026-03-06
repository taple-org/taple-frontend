import { loginForm, loginSchema } from "~/features/auth/schemas/login.schema"
export const useLoginForm = () => useRegleSchema(loginForm, loginSchema)
