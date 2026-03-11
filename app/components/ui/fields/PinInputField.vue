<script lang="ts" setup>
import { PinInput } from "@ark-ui/vue/pin-input";

const {
  count = 6,
  otp = true,
  placeholder = "",
} = defineProps<{
  count?: number;
  otp?: boolean;
  placeholder?: string;
}>();

const model = defineModel<string[]>({ default: () => [] });

const emit = defineEmits<{
  valueComplete: [details: { value: string[]; valueAsString: string }];
}>();
</script>

<template>
  <PinInput.Root
    :otp="otp"
    :count="count"
    :placeholder="placeholder"
    class="pin-input"
    v-model="model"
    @value-complete="emit('valueComplete', $event)"
  >
    <PinInput.Control class="pin-input__control">
      <PinInput.Input
        v-for="id in count"
        :key="id - 1"
        :index="id - 1"
        class="pin-input__input"
      />
    </PinInput.Control>
    <PinInput.HiddenInput />
  </PinInput.Root>
</template>

<style scoped>
.pin-input__control {
  display: inline-flex;
  gap: 8px;
  justify-content: center;
}

.pin-input__input {
  width: 48px;
  height: 48px;
  text-align: center;
  font-family: var(--font-base);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--color-neutral-dd);
  background-color: var(--color-neutral-lm);
  border: 1.5px solid transparent;
  border-radius: var(--radius-md);
  outline: none;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.pin-input__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.pin-input__input[data-invalid] {
  border-color: var(--color-error);
}
</style>
