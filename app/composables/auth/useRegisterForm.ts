import type {RegleExternalErrorTree} from "@regle/core";
import {required, sameAs, checked, email} from "@regle/rules";
import { createPasswordRules } from "~/rules/password";

export type IRegisterFormState = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirm: string;
    agree: boolean;
};

interface IRegisterFormProps {
    initialValues?: IRegisterFormState;

}

export const useRegisterForm = ({
                                    initialValues = {
                                        first_name: "",
                                        last_name: "",
                                        email: "",
                                        password: "",
                                        password_confirm: "",
                                        agree: false,
                                    },
                                }: IRegisterFormProps = {}) => {
    const { t } = useI18n();
    const state = reactive<IRegisterFormState>(initialValues);
    const externalErrors = ref<RegleExternalErrorTree<IRegisterFormState>>({})
    const passwordRules = createPasswordRules(t);


    const {r$} = useRegle(
        state,
        {
            first_name: {required: withMessage(required, t("validation.required"))},
            last_name: {required: withMessage(required, t("validation.required"))},
            email: {
                required: withMessage(required, t("validation.required")),
                email: withMessage(email, t("validation.invalidEmail")),
            },
            password: { ...passwordRules },
            password_confirm: {
                ...passwordRules,
                sameAs: sameAs(() => state.password),
            },
            agree: {checked: withMessage(checked, t("validation.required"))},
            $self: {
                passwordMatch: withMessage(
                    (value) =>
                        (value as IRegisterFormState).password ===
                        (value as IRegisterFormState).password_confirm,
                    t("validation.passwordsMismatch"),
                ),
            },
        },
        {id: "register", externalErrors},
    );

    return {r$, externalErrors};
};
