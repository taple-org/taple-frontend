import { useSteps } from "@ark-ui/vue/steps";
import config, { type Keys } from "~/configs/workspace.modal.config";
import { useWorkspaceForm } from "./useWorkspaceFormScope";

type WorkspaceMakeFlowStatus = "idle" | "loading" | "success" | "error";

export const useWorkspaceMakeFlow = defineStore("workspace-make-flow", () => {
  const isOpen = ref(false);
  const status = ref<WorkspaceMakeFlowStatus>("idle");

  const items = Object.entries(config);
  const steps = useSteps({ count: items.length });
  const currentKey = computed(() => items[steps.value.value]?.[0]! as Keys);
  const current = computed(() => config[currentKey.value]);

  const { toNext, handleSubmit } = useWorkspaceForm({
    current: currentKey,
    next: steps.value.goToNextStep,
    beforeSubmit: () => {
      status.value = 'loading'
    },
    catchError: () => {
      status.value = 'error'
    },
    resolve: () => {
      status.value = 'success'
      
    }
  });

  watch(isOpen, (open) => {
    if (!open) {
      setTimeout(() => {
        steps.value.setStep(0);
        status.value = "idle";
      }, 300);
    }
  });

  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }

  return {status, isOpen, open, close, steps, toNext, handleSubmit, current, items };
});
