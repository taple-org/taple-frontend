import * as z from "zod";
import type { PasswordRegister } from "~/interfaces/auth/form"

export function passwordMatch(password: string, confirmPassword: string, ctx:  z.core.$RefinementCtx<PasswordRegister>) {
    if (password && confirmPassword && password !== confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            path: ['confirmPassword'],
            message: 'Пароли не совпадают'
        })
    }
}
