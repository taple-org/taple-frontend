import { required, minLength, sameAs } from "@regle/rules";

export interface IPasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const usePasswordForm = () => {
  const state = reactive<IPasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { r$ } = useRegle(state, {
    currentPassword: {
      required: withMessage(required, "Обязательное поле"),
    },
    newPassword: {
      required: withMessage(required, "Обязательное поле"),
      minLength: withMessage(minLength(8), "Минимум 8 символов"),
    },
    confirmPassword: {
      required: withMessage(required, "Обязательное поле"),
      sameAs: withMessage(sameAs(() => state.newPassword), "Пароли не совпадают"),
    },
  });

  return { r$, state };
};
