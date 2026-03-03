<script lang="ts" setup>
const { variant = "fill", disabled } = defineProps<{
  variant?: "fill" | "outline"
  disabled?: boolean
}>()

const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, { 'btn--disabled': disabled }]"
    :disabled="disabled"
    :aria-disabled="disabled"
    @click="(e) => !disabled && emit('click', e)"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  font-family: var(--font-base);
  font-weight: 700;
  font-size: 14px;
  padding-block: 12px;
  padding-inline: 16px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base),
    color var(--transition-base);
}

.btn--fill {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

.btn--fill:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--color-primary) 85%, white);
  border-color: color-mix(in srgb, var(--color-primary) 85%, white);
}

.btn--outline {
  background-color: var(--color-secondary);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn--outline:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

.btn--disabled {
  background-color: var(--color-neutral-lm);
  border-color: var(--color-neutral-lm);
  color: var(--color-neutral-ld);
  cursor: not-allowed;
}
</style>