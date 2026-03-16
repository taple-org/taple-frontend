import {
    AuthFormConfirmCode,
    AuthFormLogin,
    AuthFormNewPassword,
    AuthFormPasswordRecovery,
    AuthFormRegister
} from "#components";
import type {
    AuthModalStepType,
    AuthModalsType,
} from "~/interfaces/auth/auth.modal.interfaces";

export const AuthModals: AuthModalsType = {
    "login": {
        title: 'Вход',
        description: 'Добро пожаловать в Taple.kz',
        component: AuthFormLogin,
        actions: {
            recovery: ({to}) => {
                to("recovery")
            },
            success: ({close}) => {
                close()
            },
            register: ({ to }) => {
                to('register')
            }
        }
    },
    "register": {
        title: 'Регистрация',
        description: 'Введите данный для регистрации',
        component: AuthFormRegister,
        actions: {
            success: ({to}) => {
                to("confirm-code")
            },
            login: ({to}) => {
                to("login")
            }
        }
    },
    "recovery": {
        title: 'Восстановление пароля',
        description: 'Укажите вашу электронную почту',
        component: AuthFormPasswordRecovery,
        actions: {
            success: ({to}) => {
                to("confirm-code")
            },
            cancel: ({to}) => {
                to("login")
            },
        } as const,
    },
    "new-password": {
        title: 'Создание нового пароля',
        description: 'Придумайте ваш новый пароль',
        component: AuthFormNewPassword,
        actions: {
            success: ({close}) => {
                close()
            },
            cancel: ({to}) => {
                to("login")
            }
        }
    },
    "confirm-code": {
        title: 'Подтверждение кода',
        description: 'Введите 6-значный код подтверждения отправленный на ваш адрес электронной почты',
        component: AuthFormConfirmCode,
        actions: {
            success: (
                {to, close},
                {from}
            ) => {
                switch (from) {
                    case "recovery": {
                        to("new-password");
                        break;
                    }
                    default: {
                        close();
                    }
                }
            },
            close: ({close}) => {
                close()
            }
        }
    },
};


export const AuthModalPriority: Record<AuthModalStepType, number> = {
    "login": 1,
    "register": 2,
    "recovery": 3,
    "new-password": 4,
    "confirm-code": 5,
}




