<script lang="ts" setup>
import config from "~/configs/auth.config"
import type { AuthModalStepType, ActionsOf, ActionFn } from "~/interfaces/auth/modal";
import { useAuthModalController } from "~/composables/modals/useAuthModalController";

const { to, close } = useAuthModalController()
const { isOpen, current, direction } = storeToRefs(useAuthModalController())

function onNavigate<T extends AuthModalStepType>(step: T, action: ActionsOf<T>): void;
function onNavigate(step: AuthModalStepType, action: string) {
  const fn = (config[step].actions as Record<string, ActionFn>)[action];
  fn?.({ to, close }, { from: step });
}

</script>

<template>
  <ui-modal v-model:open="isOpen" v-bind="config[current]">
    <Transition :name="`slide-${direction}`" mode="out-in">
      <component :is="config[current].component" :key="current"
        @navigate="(action: ActionsOf<typeof current>) => onNavigate(current, action)" />
    </Transition>
  </ui-modal>
</template>

<style scoped>
.slide-forward-enter-from {
  transform: translateX(40px);
  opacity: 0;
}

.slide-forward-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

.slide-back-enter-from {
  transform: translateX(-40px);
  opacity: 0;
}

.slide-back-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.24s ease;
}
</style>