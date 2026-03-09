<script lang="ts" setup>
import { PasswordInput } from "@ark-ui/vue/password-input";

defineProps<{
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
}>();

defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <PasswordInput.Root class="password" :disabled="disabled">
    <PasswordInput.Control class="password__control">
      <PasswordInput.Input
        class="password__input"
        :value="modelValue"
        :placeholder="placeholder"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
      <PasswordInput.VisibilityTrigger class="password__trigger">
        <PasswordInput.Indicator class="password__indicator">
          <Icon name="my-icon-eye-visible" mode="svg" :size="16" />
          <template #fallback>
            <Icon name="my-icon-eye-invisible" mode="svg" :size="16"/>
          </template>
        </PasswordInput.Indicator>
      </PasswordInput.VisibilityTrigger>
    </PasswordInput.Control>
  </PasswordInput.Root>
</template>

<style scoped>
.password {
  width: 100%;
}

.password[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.password__control {
  position: relative;
  display: flex;
  align-items: center;
}

.password__input {
  width: 100%;
  font-family: var(--font-base);
  font-size: 14px;
  padding: 16px;
  padding-right: 44px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  outline: none;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.password__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.password__input[data-invalid] {
  border-color: var(--color-error);
}

.password__input[data-invalid]:focus {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 15%, transparent);
}

.password__input[data-disabled] {
  background-color: var(--color-neutral-lm);
  color: var(--color-neutral-ld);
  cursor: not-allowed;
}

.password__trigger {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--color-neutral-ld);
  cursor: pointer;
  transition: color var(--transition-base);
}

.password__trigger:hover {
  color: var(--color-neutral-dd);
}

.password__trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.password__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
