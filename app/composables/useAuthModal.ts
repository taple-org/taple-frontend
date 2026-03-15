import type {AuthModalStepType} from "~/interfaces/auth/auth.modal.interfaces";
import {AuthModalPriority} from "~/constants/auth.constants";

enum Direction {
    Forward= 'forward',
    Back= 'back',
}

export const useAuthModal = defineStore('auth-modal', () => {
    const isOpen = ref(false)
    const current = ref<AuthModalStepType>("login")
    const direction = ref<Direction>(Direction.Forward)
    const from = ref<AuthModalStepType>("login")

    function open(step: AuthModalStepType = "login") {
        current.value = step
        isOpen.value = true
    }

    function to(to: AuthModalStepType) {
        from.value = current.value;
        current.value = to
        direction.value = AuthModalPriority[to] > AuthModalPriority[from.value]  ? Direction.Forward : Direction.Back;
    }

    function close() {
        isOpen.value = false
    }

    return { isOpen, current, direction, open, to, close, from }
})