import {minLength, regex, required} from "@regle/rules";

export const password = {
    required: withMessage(required, "Обязательное поле"),
    minLength: withMessage(minLength(8), 'Длина должна быть больше 8'),
    uppercase: withMessage(regex(/[A-Z]/), 'Должно содержать хотя бы одну букву верхнего регистра'),
    lowercase: withMessage(regex(/[a-z]/), 'Должно содержать хотя бы одну букву нижнего регистра'),
    digit: withMessage(regex(/\d/), 'Должно содержать хотя бы одну цифру'),
} as const;