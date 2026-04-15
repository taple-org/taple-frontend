import { required, minLength } from "@regle/rules";

export interface IProfileFormState {
  firstName: string;
  lastName: string;
  language: string;
}

export const useProfileForm = () => {
  const state = reactive<IProfileFormState>({
    firstName: '',
    lastName: '',
    language: 'ru',
  });

  const { r$ } = useRegle(state, {
    firstName: {
      required: withMessage(required, "Обязательное поле"),
      minLength: withMessage(minLength(2), "Минимум 2 символа"),
    },
    lastName: {
      required: withMessage(required, "Обязательное поле"),
      minLength: withMessage(minLength(2), "Минимум 2 символа"),
    },
  });

  return { r$, state };
};
