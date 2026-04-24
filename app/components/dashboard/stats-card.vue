<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const props = withDefaults(defineProps<Props>(), {
  change: undefined,
  changeLabel: '',
  icon: undefined,
  trend: 'neutral',
});

const trendClass = computed(() => {
  if (props.trend === 'up') return 'stats-card__change--positive';
  if (props.trend === 'down') return 'stats-card__change--negative';
  return 'stats-card__change--neutral';
});
</script>

<template>
  <div class="stats-card">
    <div class="stats-card__header">
      <span v-if="icon" class="stats-card__icon">
        <Icon :name="icon" mode="svg" :size="20" />
      </span>
      <span class="stats-card__title">{{ title }}</span>
    </div>
    <div class="stats-card__body">
      <span class="stats-card__value">{{ value }}</span>
      <div v-if="change !== undefined" class="stats-card__change" :class="trendClass">
        <Icon 
          :name="trend === 'up' ? 'my-icon-chevron-up' : trend === 'down' ? 'my-icon-chevron-down' : 'my-icon-minus'" 
          mode="svg" 
          :size="14" 
        />
        <span>{{ Math.abs(change) }}%</span>
        <span v-if="changeLabel" class="stats-card__change-label">{{ changeLabel }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow var(--transition-base);
}

.stats-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stats-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-highlight-l);
  color: var(--color-primary);
}

.stats-card__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dl);
}

.stats-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-card__value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  line-height: 1.2;
}

.stats-card__change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.stats-card__change--positive {
  color: var(--color-success);
}

.stats-card__change--negative {
  color: var(--color-error);
}

.stats-card__change--neutral {
  color: var(--color-neutral-dl);
}

.stats-card__change-label {
  color: var(--color-neutral-dl);
  font-weight: 400;
}
</style>
