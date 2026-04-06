import type { RegleExternalErrorTree } from "@regle/core";
import { required, email } from "@regle/rules";

export interface ILoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ILoginFormProps {
  initialValues?: ILoginFormState;
}

export const useLoginForm = ({
  initialValues = { email: "", password: "", rememberMe: false },
}: ILoginFormProps = {}) => {
  const state = reactive<ILoginFormState>(initialValues);
  const externalErrors = ref<RegleExternalErrorTree<ILoginFormState>>({})

  const { r$ } = useRegle(
    state,
    {
      email: {
        required: withMessage(required, "Обязательное поле"),
        email: withMessage(email, "Некорректный email"),
      },
      password: {
        required: withMessage(required, "Обязательное поле"),
      },
    },
    { id: "login", externalErrors },
  );

  return { r$, externalErrors };
};
