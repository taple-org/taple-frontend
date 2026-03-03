<script lang="ts" setup>
import { Field } from "@ark-ui/vue"

defineProps<{
  type: "text" | "email" | "password"
  modelValue: string
  disabled?: boolean
  placeholder?: string
}>()

defineEmits<{ "update:modelValue": [value: string] }>()
</script>

<template>
  <Field.Input
    class="field-input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped lang="scss">
@use "~/assets/css/global" as global;
@use "sass:map";
@use "sass:color";

$primary: map.get(global.$colors, primary);
$neutral-lm: map.get(global.$colors, neutral-lm);
$neutral-ld: map.get(global.$colors, neutral-ld);
$error: map.get(global.$colors, error);
$transition: 180ms ease;

.field-input {
  font-family: "StyreneALC", sans-serif;
  font-size: 14px;
  padding: 16px;

  border: 1px solid $neutral-lm;
  border-radius: 12px;
  outline: none;
  transition: border-color $transition, box-shadow $transition;

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 3px color.adjust($primary, $alpha: -0.85);
  }

  &[data-invalid] {
    border-color: $error;
    &:focus {
      box-shadow: 0 0 0 3px color.adjust($error, $alpha: -0.85);
    }
  }

  &[data-disabled] {
    background-color: $neutral-lm;
    color: $neutral-ld;
    cursor: not-allowed;
  }
}
</style>