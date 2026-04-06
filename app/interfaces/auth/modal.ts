const LoginActions = ['success', 'register', 'recovery'] as const;
const RegisterActions = ['success', 'login'] as const;
const RecoveryActions = ['success', 'cancel'] as const;
const NewPasswordActions = ['success', 'cancel'] as const;
const ConfirmActions = ['success', 'close'] as const;

export const StepActionsMap = {
    "login": LoginActions,
    "register": RegisterActions,
    "recovery": RecoveryActions,
    "new-password": NewPasswordActions,
    "confirm-code": ConfirmActions,
} as const;

export type AuthModalStepType = keyof typeof StepActionsMap;

type StepActionsMapType = typeof StepActionsMap;

export type ActionsOf<T extends keyof StepActionsMapType> = StepActionsMapType[T][number];
export type ActionsObject<T extends keyof StepActionsMapType> = Record<ActionsOf<T>, ActionFn>;

export type LoginActionsType = ActionsOf<"login">;
export type RegisterActionsType = ActionsOf<"register">;
export type RecoveryActionsType = ActionsOf<"recovery">;
export type NewPasswordActionsType = ActionsOf<"new-password">;
export type ConfirmActionsType = ActionsOf<"confirm-code">;


export type AuthModalNavigationMetadataType = {
    from: AuthModalStepType,
};
export type AuthDialogActions = {
    to: (step: AuthModalStepType) => void;
    close: () => void;
};
export type ActionFn = (
    actions: AuthDialogActions,
    metadata: AuthModalNavigationMetadataType
) => void;


export type AuthModalType<T extends keyof StepActionsMapType> = {
    title: string;
    description: string;
    component: Component;
    actions: ActionsObject<T>;
};
export type AuthModalConfig = {
    [K in keyof StepActionsMapType]: AuthModalType<K>;
};



