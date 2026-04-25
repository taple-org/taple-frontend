<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
}

const props = withDefaults(defineProps<Props>(), {
  change: undefined,
  changeLabel: "",
  icon: undefined,
  trend: "neutral",
});

const trendClass = computed(() => {
  if (props.trend === "up") return "stats-card__change--positive";
  if (props.trend === "down") return "stats-card__change--negative";
  return "stats-card__change--neutral";
});
</script>

<template>
  <div class="stats-card">
    <div class="stats-card__header">
      <span v-if="icon" class="stats-card__icon">
        <Icon :name="icon" mode="svg" :size="18" />
      </span>
      <span class="stats-card__title">{{ title }}</span>
    </div>
    <div class="stats-card__body">
      <span class="stats-card__value">{{ value }}</span>
      <div
        v-if="change !== undefined"
        class="stats-card__change"
        :class="trendClass"
      >
        <Icon
          :name="
            trend === 'up'
              ? 'my-icon-outline-trending-up'
              : trend === 'down'
                ? 'my-icon-outline-trending-down'
                : 'my-icon-minus'
          "
          mode="svg"
          :size="14"
        />
        <span>{{ Math.abs(change) }}%</span>
        <span v-if="changeLabel" class="stats-card__change-label">{{
          changeLabel
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eceef5;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    box-shadow var(--transition-base),
    transform var(--transition-base);
}

.stats-card:hover {
  box-shadow: 0 8px 24px rgba(56, 73, 112, 0.08);
  transform: translateY(-1px);
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
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #eef4ff;
  color: #6c9cff;
}

.stats-card__title {
  font-size: 13px;
  font-weight: 500;
  color: #8f9098;
}

.stats-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-card__value {
  font-size: 28px;
  font-weight: 600;
  color: #2f3036;
  line-height: 1.1;
}

.stats-card__change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stats-card__change--positive {
  color: #2ca385;
}

.stats-card__change--negative {
  color: #dd6b75;
}

.stats-card__change--neutral {
  color: #8f9098;
}

.stats-card__change-label {
  color: #8f9098;
  font-weight: 400;
}
</style>
