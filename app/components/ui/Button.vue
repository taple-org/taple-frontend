<script lang="ts" setup>
type ButtonProps = {
  variant?: "primary" | "outline" | "error" | "ghost" | "warning";
  disabled?: boolean
  iconLeft?: string
  iconRight?: string
}

const { variant = "primary", disabled, iconLeft, iconRight } = defineProps<ButtonProps>()

defineOptions({
  inheritAttrs: true,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
      class="btn"
      :class="[
      `btn--${variant}`,
      {
        'btn--disabled': disabled,
        'btn--with-icon-left': iconLeft,
        'btn--with-icon-right': iconRight,
      },
    ]"
      :disabled="disabled"
      :aria-disabled="disabled"
      @click="(e) => !disabled && emit('click', e)"
  >
    <Icon
        v-if="iconLeft"
        :name="iconLeft"
        class="btn__icon btn__icon--left"
    />

    <span class="btn__content">
      <slot />
    </span>

    <Icon
        v-if="iconRight"
        :name="iconRight"
        class="btn__icon btn__icon--right"
    />
  </button>
</template>

<style scoped>
.btn {
  font-family: var(--font-base), sans-serif;
  font-weight: 700;
  font-size: 14px;
  padding-block: 12px;
  padding-inline: 16px;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
      background-color var(--transition-base),
      border-color var(--transition-base),
      color var(--transition-base);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn__content {
  line-height: 1;
}

.btn__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

.btn--primary:hover:not(:disabled) {
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

.btn--error {
  background-color: var(--color-secondary);
  border-color: var(--color-error);
  color: var(--color-error);
}

.btn--error:hover:not(:disabled) {
  background-color: var(--color-error);
  color: var(--color-secondary);
}

.btn--ghost {
  background: transparent;
  border-color: transparent;
  color: var(--color-neutral-dm);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--color-neutral-ll);
}

.btn--warning {
  border-color: var(--color-warning);
  color: var(--color-warning) ;
  background-color: var(--color-secondary);
}

.btn--warning:hover {
  background-color: var(--color-warning-l);
  color: var(--color-warning) ;
}

.btn--disabled {
  background-color: var(--color-neutral-lm);
  border-color: var(--color-neutral-lm);
  color: var(--color-neutral-ld);
  cursor: not-allowed;
}
</style>