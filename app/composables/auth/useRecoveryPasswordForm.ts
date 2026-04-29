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
  const { t } = useI18n();
  const state = reactive<IRecoveryPasswordForm>(initialValues);
  const externalErrors = ref<RegleExternalErrorTree<IRecoveryPasswordForm>>({})
  
  const { r$ } = useRegle(
    state,
    {
      email: {
        required: withMessage(required, t("validation.required")),
        email: withMessage(email, t("validation.invalidEmail")),
      },
    },
    { id: "recovery-password", externalErrors },
  );

  return { r$, externalErrors };
};
