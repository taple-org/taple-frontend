import type { RegleExternalErrorTree } from "@regle/core";
import { required, email } from "@regle/rules";

export interface IRecoveryPasswordForm {
  email: string;
}
interface IRecoveryPasswordFormProps {
  initialValues?: IRecoveryPasswordForm;
}

export const useRecoveryPasswordForm = ({
  initialValues = { email: "" },
}: IRecoveryPasswordFormProps = {}) => {
  const state = reactive<IRecoveryPasswordForm>(initialValues);
  const externalErrors = ref<RegleExternalErrorTree<IRecoveryPasswordForm>>({})
  
  const { r$ } = useRegle(
    state,
    {
      email: {
        required: withMessage(required, "Обязательное поле"),
        email: withMessage(email, "Некорректный email"),
      },
    },
    { id: "recovery-password", externalErrors },
  );

  return { r$, externalErrors };
};
