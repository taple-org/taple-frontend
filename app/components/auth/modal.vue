<script lang="ts" setup>
import config from "~/configs/auth.config";
import type {
  AuthModalStepType,
  ActionsOf,
  ActionFn,
} from "~/interfaces/auth/modal";
import { useAuthModalController } from "~/composables/modals/useAuthModalController";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { to, close } = useAuthModalController();
const { isOpen, current, direction, from } = storeToRefs(
  useAuthModalController(),
);

const titles = computed<Record<AuthModalStepType, string>>(() => ({
  login: t("auth.loginTitle"),
  register: t("auth.registerTitle"),
  recovery: t("auth.recoveryTitle"),
  "new-password": t("auth.newPasswordTitle"),
  "confirm-code": t("auth.confirmCodeTitle"),
}));

const descriptions = computed<Record<AuthModalStepType, string>>(() => ({
  login: t("auth.loginDescription"),
  register: t("auth.registerDescription"),
  recovery: t("auth.recoveryDescription"),
  "new-password": t("auth.newPasswordDescription"),
  "confirm-code": t("auth.confirmCodeDescription"),
}));

function onNavigate<T extends AuthModalStepType>(
  step: T,
  action: ActionsOf<T>,
): void;
function onNavigate(step: AuthModalStepType, action: string) {
  const fn = (config[step].actions as Record<string, ActionFn>)[action];
  fn?.({ to, close }, { from: from.value });
}
</script>

<template>
  <ui-modal
    v-model:open="isOpen"
    :title="titles[current]"
    :description="descriptions[current]"
  >
    <Transition :name="`auth-modal-slide-${direction}`" mode="out-in">
      <component
        :is="config[current].component"
        :key="current"
        @navigate="
          (action: ActionsOf<typeof current>) => onNavigate(current, action)
        "
      />
    </Transition>
  </ui-modal>
</template>

<style>
.auth-modal-slide-forward-enter-from {
  transform: translateX(40px);
  opacity: 0;
}

.auth-modal-slide-forward-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

.auth-modal-slide-back-enter-from {
  transform: translateX(-40px);
  opacity: 0;
}

.auth-modal-slide-back-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

.auth-modal-slide-forward-enter-active,
.auth-modal-slide-forward-leave-active,
.auth-modal-slide-back-enter-active,
.auth-modal-slide-back-leave-active {
  transition: all 0.24s ease;
}
</style>
