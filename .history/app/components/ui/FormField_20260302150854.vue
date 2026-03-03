<script lang="ts" setup>
import { Field } from "@ark-ui/vue"
import TextField from "./fields/TextField.vue"

type TextProps = {
  type: "text" | "email" | "password"
  modelValue: string
  placeholder?: string
}
type SelectProps = {
  type: "select"
  modelValue: string
  options: { label: string; value: string }[]
}

type FieldProps = (TextProps | SelectProps) & {
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = defineProps<FieldProps>()
const emit = defineEmits<{ "update:modelValue": [value: string | number] }>()

const componentMap = {
  text: TextField,
  email: TextField,
  password: TextField,
} as const
</script>

<template>
  <Field.Root
    class="field"
    :disabled="disabled"
    :required="required"
    :invalid="!!error"
  >
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

    <Field.HelperText v-if="hint && !error" class="field__hint">
      {{ hint }}
    </Field.HelperText>

    <Field.ErrorText v-if="error" class="field__error">
      {{ error }}
    </Field.ErrorText>
  </Field.Root>
</template>

<style scoped lang="scss">
@use "~/assets/css/global" as global;
@use "sass:map";

$primary: map.get(global.$colors, primary);
$neutral-lm: map.get(global.$colors, neutral-lm);
$neutral-ld: map.get(global.$colors, neutral-ld);
$error: map.get(global.$colors, error);
$label: #1A1A2E;

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-family: "StyreneALC", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: $label;
  }

  &__required {
    color: $error;
    margin-left: 2px;
  }

  &__hint {
    font-size: 11px;
    color: $neutral-ld;
  }

  &__error {
    font-size: 11px;
    color: $error;
  }
}
</style>