import { required, minLength, sameAs, string } from "@regle/rules";
import type {RegleExternalErrorTree} from "@regle/core";
import {password} from "~/rules/password";

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
    const externalErrors = ref<RegleExternalErrorTree<IPasswordFormState>>({})


    const {r$} = useRegle(state, {
        currentPassword: {
            ...password
        },
        newPassword: {
            ...password
        },
        confirmPassword: {
            ...password,
            sameAs: withMessage(sameAs(() => state.newPassword), "Пароли не совпадают"),
        },
    }, {
        id: 'password-form',
        externalErrors,
    });

    return {r$, state, externalErrors};
};
