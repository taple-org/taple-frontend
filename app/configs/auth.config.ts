import {
    AuthFormConfirmCode,
    AuthFormLogin,
    AuthFormNewPassword,
    AuthFormPasswordRecovery,
    AuthFormRegister
} from "#components";
import type {
    AuthModalConfig,
} from "~/interfaces/auth/modal";

const config: AuthModalConfig = {
    "login": {
        title: '',
        description: '',
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
        title: '',
        description: '',
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
        title: '',
        description: '',
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
        title: '',
        description: '',
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
        title: '',
        description: '',
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
                    case "register": {
                        to("login");
                        break;
                    }
                    default: {
                        close()
                    }
                }
            },
            close: ({close}) => {
                close()
            }
        }
    },
} ;

export default config;



