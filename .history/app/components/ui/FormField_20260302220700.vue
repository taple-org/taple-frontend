<script lang="ts" setup>
import { Field } from "@ark-ui/vue"
import TextField from "./fields/TextField.vue"

type TextProps = { type: "text" | "email" | "password"; modelValue: string; placeholder?: string }
type CheckboxProps = {
  type: 'checkbox'
  modelValue: boolean
}
type FieldProps = (TextProps | CheckboxProps) & {
  label?: string; hint?: string; error?: string; disabled?: boolean; required?: boolean
}

const props = defineProps<FieldProps>()
const emit = defineEmits<{ "update:modelValue": [value: string | number] }>()

const componentMap = { text: TextField, email: TextField, password: TextField, check } as const
</script>

<template>
  <Field.Root class="field" :disabled="disabled" :required="required" :invalid="!!error">
    <Field.Label v-if="label" class="field__label">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
    </Field.Label>

    <component
      :is="componentMap[type]"
      v-bind="props"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <Field.HelperText v-if="hint && !error" class="field__hint">{{ hint }}</Field.HelperText>
    <Field.ErrorText v-if="error" class="field__error">{{ error }}</Field.ErrorText>
  </Field.Root>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-family: var(--font-base);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-neutral-dd);
}

.field__required {
  color: var(--color-error);
  margin-left: 2px;
}

.field__hint {
  font-size: 11px;
  color: var(--color-neutral-ld);
}

.field__error {
  font-size: 11px;
  color: var(--color-error);
}
</style>