import { signUpForm, signUpSchema } from "~/features/auth/schemas/sign-up.schema"
export const useSignUpForm = () => useRegleSchema(signUpForm, signUpSchema)