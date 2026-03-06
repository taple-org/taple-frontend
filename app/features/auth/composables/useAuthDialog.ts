export type AuthStep = 'login' | 'signup' | 'otp' | 'forgot-password'

export const useAuthDialog = defineStore('authDialog', () => {
  const isOpen = ref(false)
  const currentStep = ref<AuthStep>('login')
  const direction = ref<'forward' | 'back'>('forward')

  const stepOrder: AuthStep[] = ['login', 'signup', 'otp', 'forgot-password']

  function open(step: AuthStep = 'login') {
    currentStep.value = step
    isOpen.value = true
  }

  function goTo(step: AuthStep) {
    const from = stepOrder.indexOf(currentStep.value)
    const to = stepOrder.indexOf(step)
    direction.value = to > from ? 'forward' : 'back'
    currentStep.value = step
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, currentStep, direction, open, goTo, close }
})