<script lang="ts" setup>
withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' },
)
</script>

<template>
  <div class="info-section" :class="`info-section--${size}`" role="note">
    <div class="info-section__icon">
      <Icon name="my-icon-info" mode="svg" :size="24" color="var(--color-primary)" />
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
  padding: 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-base),serif;
  text-align: left;
  background-color: var(--color-highlight-l);
  color: var(--color-neutral-dm);
}

.info-section--md {
  font-size: 11px;
  line-height: 14px;
  font-weight: 400;
}

.info-section--sm {
  font-size: 10px;
  line-height: 13px;
  font-weight: 300;
}

.info-section__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.info-section__text {
  margin: 0;
}
</style>