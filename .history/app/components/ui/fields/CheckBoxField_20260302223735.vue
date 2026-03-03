<script lang="ts" setup>
import { Checkbox } from '@ark-ui/vue/checkbox'
import { CheckIcon, MinusIcon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
}>()


console.log(props.label)
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <Checkbox.Root
    class="checkbox"
    :checked="modelValue"
    :disabled="disabled"
    @checked-change="$emit('update:modelValue', $event.checked as boolean)"
  >
    <Checkbox.Control class="checkbox__control">
      <Checkbox.Indicator class="checkbox__indicator">
        <MinusIcon :size="12" data-state="indeterminate" />
        <CheckIcon :size="12" data-state="checked" />
      </Checkbox.Indicator>
    </Checkbox.Control>

    <Checkbox.Label v-if="label" class="checkbox__label">
      {{ label }}
    </Checkbox.Label>

    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>

<style>
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.checkbox[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkbox__control {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid var(--color-neutral-lm);
  background-color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.checkbox:not([data-disabled]):hover .checkbox__control {
  border-color: var(--color-primary);
}

.checkbox[data-state='checked'] .checkbox__control {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox[data-state='indeterminate'] .checkbox__control {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox:focus-within .checkbox__control {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
  border-color: var(--color-primary);
}

.checkbox__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
}

.checkbox__indicator [data-state] {
  display: none;
}

.checkbox[data-state='checked'] .checkbox__indicator [data-state='checked'] {
  display: flex;
}

.checkbox[data-state='indeterminate'] .checkbox__indicator [data-state='indeterminate'] {
  display: flex;
}

.checkbox__label {
  font-family: var(--font-base);
  font-size: 10px;
  font-weight: 500;
  color: var(--color-label);
  line-height: 1.4;
  user-select: none;
}
</style>