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
  const { t } = useI18n();
  const state = reactive<ILoginFormState>(initialValues);
  const externalErrors = ref<RegleExternalErrorTree<ILoginFormState>>({})

  const { r$ } = useRegle(
    state,
    {
      email: {
        required: withMessage(required, t("validation.required")),
        email: withMessage(email, t("validation.invalidEmail")),
      },
      password: {
        required: withMessage(required, t("validation.required")),
      },
    },
    { id: "login", externalErrors },
  );

  return { r$, externalErrors };
};
