import { useSteps } from "@ark-ui/vue/steps";
import config, { type Keys } from "~/configs/workspace.modal.config";
import { resetWorkspaceFormState } from "./useWorkspaceFormScope";

export type WorkspaceMakeFlowStatus = "idle" | "loading" | "success" | "error";
interface UseWorkspaceMakeFlowProps {
  handleResolve?: () => void | Promise<void>;
}
export const useWorkspaceMakeFlow = defineStore("workspace-make-flow", ({}) => {
  const isOpen = ref(false);
  const status = ref<WorkspaceMakeFlowStatus>("idle");

  const items = Object.entries(config);
  const steps = useSteps({ count: items.length });
  const currentKey = computed(() => items[steps.value.value]?.[0]! as Keys);
  const current = computed(() => config[currentKey.value]);
  const onResolve = ref<(() => void) | null>(null);

  watch(isOpen, (open) => {
    if (!open) {
      setTimeout(() => {
        steps.value.setStep(0);
        status.value = "idle";
        resetWorkspaceFormState();
      }, 300);
    }
  });

  function open(props? : UseWorkspaceMakeFlowProps) {
    isOpen.value = true;
    onResolve.value = props?.handleResolve ?? null
  }
  function close() {
    isOpen.value = false;
  }

  function onSubmitStart() {
    status.value = "loading";
  }

  function onSubmitError() {
    status.value = "error";
  }

  function onSubmitSuccess() {
    status.value = "success";
    onResolve.value && onResolve.value();
  }

  return {
    status,
    isOpen,
    open,
    close,
    steps,
    current,
    currentKey,
    items,
    onSubmitStart,
    onSubmitError,
    onSubmitSuccess,
  };
});
