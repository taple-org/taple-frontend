<script lang="ts" setup>
import { Field } from '@ark-ui/vue/field'
import { fieldRegistry } from './fields/registry'

type TextProps     = { type: 'text' | 'email' | 'password'; modelValue: string; placeholder?: string }
type CheckboxProps = { type: 'checkbox'; modelValue: boolean }

type FieldWrapperProps = {
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

type FieldProps = (TextProps | CheckboxProps) & FieldWrapperProps

const props = defineProps<FieldProps>()
const emit = defineEmits<{ 'update:modelValue': [value: string | number | boolean] }>()

const config = computed(() => fieldRegistry[props.type]!)

const inputProps = computed(() => {
  const { label, hint, error, required, ...rest } = props
  return rest as any
})
</script>

<template>
  <Field.Root
    class="field"
    :disabled="props.disabled"
    :required="props.required"
    :invalid="!!props.error"
  >
    <Field.Label v-if="props.label && !config.inlineLabel" class="field__label">
      {{ props.label }}
      <span v-if="props.required" class="field__required" aria-hidden="true">*</span>
    </Field.Label>

    <component
      :is="config.component"
      v-bind="inputProps"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <Field.HelperText v-if="props.hint && !props.error" class="field__hint">
      {{ props.hint }}
    </Field.HelperText>
    <Field.ErrorText v-if="props.error" class="field__error">
      {{ props.error }}
    </Field.ErrorText>
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