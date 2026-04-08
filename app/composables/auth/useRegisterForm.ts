import type {RegleExternalErrorTree} from "@regle/core";
import {required, sameAs, checked} from "@regle/rules";

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
    const state = reactive<IRegisterFormState>(initialValues);
    const externalErrors = ref<RegleExternalErrorTree<IRegisterFormState>>({})


    const {r$} = useRegle(
        state,
        {
            first_name: {required: withMessage(required, "Обязательное поле")},
            last_name: {required: withMessage(required, "Обязательное поле")},
            email: {required: withMessage(required, "Обязательное поле")},
            password: {required: withMessage(required, "Обязательное поле")},
            password_confirm: {
                required: withMessage(required, "Обязательное поле"),
                sameAs: sameAs(() => state.password),
            },
            agree: {checked: withMessage(checked, "Обязательное поле")},
            $self: {
                passwordMatch: withMessage(
                    (value) =>
                        (value as IRegisterFormState).password ===
                        (value as IRegisterFormState).password_confirm,
                    "Пароли не совпадают",
                ),
            },
        },
        {id: "register", externalErrors},
    );

    return {r$, externalErrors};
};
