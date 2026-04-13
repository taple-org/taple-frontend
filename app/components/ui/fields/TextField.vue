<script lang="ts" setup>
import { Field } from "@ark-ui/vue"
import type { Component } from 'vue'

defineProps<{
  type: "text" | "email" | "password"
  disabled?: boolean
  placeholder?: string
  iconLeft?: string
  iconRight?: string
}>()

const modelValue = defineModel<string>()
</script>

<template>
  <div class="field-input-wrapper">
    <Icon :name="iconLeft" v-if="iconLeft" class="field-input-icon field-input-icon--left" />
    <Field.Input
        class="field-input"
        :class="{
        'field-input--icon-left': iconLeft,
        'field-input--icon-right': iconRight,
      }"
        :type="type"
        :placeholder="placeholder"
        v-model="modelValue"
    />
    <Icon :name="iconRight" v-if="iconRight" class="field-input-icon field-input-icon--right" />
  </div>
</template>

<style scoped>
.field-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input {
  font-family: var(--font-base), sans-serif;
  font-size: 14px;
  padding: 16px;
  width: 100%;
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  outline: none;
  background-color: var(--color-neutral-ll);
  transition:
      border-color var(--transition-base),
      box-shadow var(--transition-base);
  color: var(--color-neutral-dd);

}

.field-input--icon-left  { padding-left: 44px; }
.field-input--icon-right { padding-right: 44px; }

.field-input::placeholder { color: var(--color-neutral-dl); }

.field-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.field-input[data-invalid] { border-color: var(--color-error); }
.field-input[data-invalid]:focus {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 15%, transparent);
}

.field-input[data-disabled] {
  background-color: var(--color-neutral-lm);
  color: var(--color-neutral-ld);
  cursor: not-allowed;
}

.field-input-icon {
  position: absolute;
  width: 18px;
  height: 18px;
  color: var(--color-neutral-dd);
  pointer-events: none;
  flex-shrink: 0;
}

.field-input-icon--left  { left: 14px; }
.field-input-icon--right { right: 14px; }
</style>