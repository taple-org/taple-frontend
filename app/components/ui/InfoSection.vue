<script lang="ts" setup>
import { InfoIcon } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    variant?: 'info' | 'warning' | 'error' | 'success'
  }>(),
  { variant: 'info' },
)
</script>

<template>
  <div class="info-section" :class="`info-section--${variant}`" role="note">
    <div class="info-section__icon">
      <InfoIcon :size="24" />
    </div>
    <p class="info-section__text">
      <slot />
    </p>
  </div>
</template>

<style scoped>
.info-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-base);
  font-size: 13px;
  line-height: 1.5;
}

.info-section--info {
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-neutral-dd);
}

.info-section--info .info-section__icon {
  color: var(--color-primary);
  justify-content: center;
}

.info-section--warning {
  background-color: color-mix(in srgb, #f59e0b 10%, transparent);
  color: var(--color-neutral-dd);
}

.info-section--warning .info-section__icon {
  color: #f59e0b;
}

.info-section--error {
  background-color: color-mix(in srgb, var(--color-error) 10%, transparent);
  color: var(--color-neutral-dd);
}

.info-section--error .info-section__icon {
  color: var(--color-error);
}

.info-section--success {
  background-color: color-mix(in srgb, #22c55e 10%, transparent);
  color: var(--color-neutral-dd);
}

.info-section--success .info-section__icon {
  color: #22c55e;
}

.info-section__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.info-section__text {
  margin: 0;
  font-weight: 400;
}
</style>
