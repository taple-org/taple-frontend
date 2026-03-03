<script lang="ts" setup>
import { Field } from '@ark-ui/vue/field'
import TextField from './fields/TextField.vue'
import CheckboxField from './fields/CheckboxField.vue'

type TextProps     = { type: 'text' | 'email' | 'password'; modelValue: string; placeholder?: string }
type SelectProps   = { type: 'select'; modelValue: string; options: { label: string; value: string }[] }
type CheckboxProps = { type: 'checkbox'; modelValue: boolean }

// Пропсы только для обёртки Field, не для дочернего компонента
type FieldWrapperProps = {
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

type FieldProps = (TextProps | SelectProps | CheckboxProps) & FieldWrapperProps

// Типы у которых label внутри, а не сверху
const INLINE_LABEL_TYPES = ['checkbox'] as const

const componentMap: Record<string, Component> = {
  text:     TextField,
  email:    TextField,
  password: TextField,
  checkbox: CheckboxField,
}

const props = defineProps<FieldProps>()
const emit = defineEmits<{ 'update:modelValue': [value: string | number | boolean] }>()

const inputProps = computed(() => {
  const { label, hint, error, required, ...rest } = props
  // Кастим в одном месте — дальше всё типизировано
  return rest as TextProps | SelectProps | CheckboxProps
})

const showTopLabel = computed(() =>
  props.label && !INLINE_LABEL_TYPES.includes(props.type as typeof INLINE_LABEL_TYPES[number])
)
</script>

<template>
  <Field.Root
    class="field"
    :disabled="props.disabled"
    :required="props.required"
    :invalid="!!props.error"
  >
    <Field.Label v-if="showTopLabel" class="field__label">
      {{ props.label }}
      <span v-if="props.required" class="field__required" aria-hidden="true">*</span>
    </Field.Label>

    <component
      :is="componentMap[props.type]"
      v-bind="inputProps"
      :label="INLINE_LABEL_TYPES.includes(props.type as any) ? props.label : undefined"
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