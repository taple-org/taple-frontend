import type { RegleExternalErrorTree } from "@regle/core";
import { required, sameAs, checked } from "@regle/rules";

export type IRegisterFormState = {
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

interface IRegisterFormProps {
  initialValues?: IRegisterFormState;
 
}

export const useRegisterForm = ({
  initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  },
}: IRegisterFormProps = {}) => {
  const state = reactive<IRegisterFormState>(initialValues);
  const externalErrors = ref<RegleExternalErrorTree<IRegisterFormState>>({})


  const { r$ } = useRegle(
    state,
    {
      email: { required: withMessage(required, "Обязательное поле") },
      password: { required: withMessage(required, "Обязательное поле") },
      confirmPassword: {
        required: withMessage(required, "Обязательное поле"),
        sameAs: sameAs(() => state.password),
      },
      agree: { checked: withMessage(checked, "Обязательное поле") },
      $self: {
        passwordMatch: withMessage(
          (value) =>
            (value as IRegisterFormState).password ===
            (value as IRegisterFormState).confirmPassword,
          "Пароли не совпадают",
        ),
      },
    },
    { id: "register", externalErrors },
  );

  return { r$, externalErrors };
};
