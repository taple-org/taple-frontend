export type LoginForm = {
    email: string;
    password: string;
    rememberMe: boolean;
};

export type RecoveryPasswordForm = {
    email: string;
};

export type PasswordRegister = {
    password: string;
    confirmPassword: string;
};

export type NewPasswordForm = {
} & PasswordRegister;

export type RegisterForm = {
    email: string;
    agree: boolean;
} & PasswordRegister;