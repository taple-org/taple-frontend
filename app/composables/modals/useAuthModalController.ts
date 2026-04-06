import { useModalController } from "./useModalController";
import type {AuthModalStepType} from "~/interfaces/auth/modal";

export const AuthModalPriority: Record<AuthModalStepType, number> = {
    "login": 1,
    "register": 2,
    "recovery": 3,
    "new-password": 4,
    "confirm-code": 5,
}

export const useAuthModalController = defineStore('auth-modal', () => {
    return useModalController<AuthModalStepType>('login', AuthModalPriority);
})