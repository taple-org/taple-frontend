import { minLength, regex, required } from "@regle/rules";

export function createPasswordRules(t: (key: string, params?: Record<string, unknown>) => string) {
  return {
    required: withMessage(required, t("validation.required")),
    minLength: withMessage(minLength(8), t("validation.passwordMinLength", { count: 8 })),
    uppercase: withMessage(regex(/[A-Z]/), t("validation.passwordUppercase")),
    lowercase: withMessage(regex(/[a-z]/), t("validation.passwordLowercase")),
    digit: withMessage(regex(/\d/), t("validation.passwordDigit")),
  } as const;
}
