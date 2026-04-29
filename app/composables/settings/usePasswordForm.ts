import { sameAs } from "@regle/rules";
import type {RegleExternalErrorTree} from "@regle/core";
import { createPasswordRules } from "~/rules/password";

export interface IPasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const usePasswordForm = () => {
    const { t } = useI18n();
    const state = reactive<IPasswordFormState>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const externalErrors = ref<RegleExternalErrorTree<IPasswordFormState>>({})
    const passwordRules = createPasswordRules(t);


    const {r$} = useRegle(state, {
        currentPassword: {
            ...passwordRules
        },
        newPassword: {
            ...passwordRules
        },
        confirmPassword: {
            ...passwordRules,
            sameAs: withMessage(sameAs(() => state.newPassword), t("validation.passwordsMismatch")),
        },
    }, {
        id: 'password-form',
        externalErrors,
    });

    return {r$, state, externalErrors};
};
