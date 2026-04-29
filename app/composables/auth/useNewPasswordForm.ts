import type { RegleExternalErrorTree } from "@regle/core";
import { sameAs } from "@regle/rules";
import { createPasswordRules } from "~/rules/password";

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
  const { t } = useI18n();
  const state = reactive<INewPasswordFormState>(initialValues);
  const externalErrors = ref<RegleExternalErrorTree<INewPasswordFormState>>({})
  const passwordRules = createPasswordRules(t);

  const { r$ } = useRegle(
    state,
    {
      password: { ...passwordRules },
      confirmPassword: {
        ...passwordRules,
        sameAs: sameAs(() => state.password),
      },
      $self: {
        passwordMatch: withMessage(
          (value) =>
            (value as INewPasswordFormState).password ===
            (value as INewPasswordFormState).confirmPassword,
          t("validation.passwordsMismatch"),
        ),
      },
    },
    { id: "new-password", externalErrors },
  );

  return { r$, externalErrors };
};
