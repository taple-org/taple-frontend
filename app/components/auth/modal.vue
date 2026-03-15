<script lang="ts" setup>
import { AuthModals } from "~/constants/auth.constants"
import type { AuthModalStepType, ActionsOf, ActionFn } from "~/interfaces/auth/auth.modal.interfaces";

const { to, close } = useAuthModal()
const { isOpen, current, direction, from } = storeToRefs(useAuthModal())

function onNavigate<T extends AuthModalStepType>(step: T, action: ActionsOf<T>): void;
function onNavigate(step: AuthModalStepType, action: string) {
  const fn = (AuthModals[step].actions as Record<string, ActionFn>)[action];
  fn?.({ to, close }, { from: step });
}

</script>

<template>
  <ui-dialog v-model:open="isOpen" v-bind="AuthModals[current]">
    <Transition :name="`slide-${direction}`" mode="out-in">
      <component
          :is="AuthModals[current].component"
          :key="current"
          @navigate="(action: ActionsOf<typeof current>) => onNavigate(current, action)"
      />
    </Transition>
  </ui-dialog>
</template>

<style scoped>
.slide-forward-enter-from { transform: translateX(40px); opacity: 0; }
.slide-forward-leave-to   { transform: translateX(-40px); opacity: 0; }

.slide-back-enter-from { transform: translateX(-40px); opacity: 0; }
.slide-back-leave-to   { transform: translateX(40px); opacity: 0; }

.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.24s ease;
}
</style>