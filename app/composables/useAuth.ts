export enum Step{
    Login,
    Register,
    Recovercy,
    NewPassword,
    OTP
}

enum Direction {
    Forward= 'forward',
    Back= 'back',
}

export const useAuthDialog = defineStore('auth-dialog', () => {
    const isOpen = ref(false)
    const current = ref<Step>(Step.Login)
    const direction = ref<Direction>(Direction.Forward)


    function open(step: Step = Step.Login) {
        current.value = step
        isOpen.value = true
    }

    function to(to: Step) {
        const from = current.value;
        direction.value = to > from  ? Direction.Forward : Direction.Back;
        current.value = to
    }

    function close() {
        isOpen.value = false
    }

    return { isOpen, current, direction, open, to, close }
})