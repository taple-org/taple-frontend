import { required, email, minLength } from "@regle/rules";

export interface IContactFormState {
  name: string;
  email: string;
  message: string;
}

export const useContactForm = () => {
  const state = reactive<IContactFormState>({ name: "", email: "", message: "" });

  const { r$ } = useRegle(state, {
    name: {
      required: withMessage(required, "Обязательное поле"),
      minLength: withMessage(minLength(2), "Минимум 2 символа"),
    },
    email: {
      required: withMessage(required, "Обязательное поле"),
      email: withMessage(email, "Некорректный email"),
    },
    message: {
      required: withMessage(required, "Обязательное поле"),
      minLength: withMessage(minLength(10), "Минимум 10 символов"),
    },
  });

  return { r$ };
};
