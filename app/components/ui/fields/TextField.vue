<script lang="ts" setup>
import { Field } from "@ark-ui/vue"

defineProps<{
  type: "text" | "email" | "password"
  disabled?: boolean
  placeholder?: string
}>()

const modalValue = defineModel<string>()
</script>

<template>
  <Field.Input
    class="field-input"
    :type="type"
    :placeholder="placeholder"
    v-model="modalValue"
  />
</template>

<style scoped>
.field-input {
  font-family: var(--font-base);
  font-size: 14px;
  padding: 16px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  outline: none;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);

  color: var(--color-neutral-dd);
}
.field-input::placeholder {
  color: var(--color-neutral-dl);
}

.field-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.field-input[data-invalid] {
  border-color: var(--color-error);
}

.field-input[data-invalid]:focus {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 15%, transparent);
}

.field-input[data-disabled] {
  background-color: var(--color-neutral-lm);
  color: var(--color-neutral-ld);
  cursor: not-allowed;
}
</style>