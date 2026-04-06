import { required, sameAs } from "@regle/rules";

export interface INewPasswordFormState {
  password: string;
  confirmPassword: string;
}
interface INewPasswordFormProps {
  initialValues?: INewPasswordFormState;
}

export const useNewPasswordForm = ({
  initialValues = { password: "", confirmPassword: "" },
}: INewPasswordFormProps = {}) => {
  const state = reactive<INewPasswordFormState>(initialValues);

  const { r$ } = useRegle(
    state,
    {
      password: { required: withMessage(required, "Обязательное поле") },
      confirmPassword: {
        required: withMessage(required, "Обязательное поле"),
        sameAs: sameAs(() => state.password),
      },
      $self: {
        passwordMatch: withMessage(
          (value) =>
            (value as INewPasswordFormState).password ===
            (value as INewPasswordFormState).confirmPassword,
          "Пароли не совпадают",
        ),
      },
    },
    { id: "new-password" },
  );

  return { r$ };
};
