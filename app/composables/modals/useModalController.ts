import { ref } from 'vue';
import type { Ref } from 'vue';

enum Direction {
    Forward = 'forward',
    Back = 'back',
}

export const useModalController = <StepType extends string>(
    defaultStep: StepType,
    priority: Record<StepType, number>
) => {
    const isOpen = ref(false);
    const current = ref(defaultStep) as Ref<StepType>;
    const from = ref(defaultStep) as Ref<StepType>;
    const direction = ref<Direction>(Direction.Forward);

    function open(step: StepType = defaultStep) {
        current.value = step;
        isOpen.value = true;
    }

    function to(step: StepType) {
        from.value = current.value;
        current.value = step;
        direction.value =
            priority[step] > priority[from.value]
                ? Direction.Forward
                : Direction.Back;
    }

    function close() {
        isOpen.value = false;
    }

    return { isOpen, current, from, direction, open, to, close };
};