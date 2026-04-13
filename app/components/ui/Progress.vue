<script lang="ts" setup>
import { Progress } from '@ark-ui/vue/progress'

type ProgressProps = {
  variant?: 'circular' | 'linear'
  value?: number | null
  min?: number
  max?: number
  label?: string
  showValue?: boolean
}

const {
  variant = 'linear',
  value = null,
  min = 0,
  max = 100,
  label,
  showValue = true,
} = defineProps<ProgressProps>()
</script>

<template>
  <Progress.Root
    class="progress-root"
    :value="value"
    :min="min"
    :max="max"
  >
    <!-- Linear -->
    <template v-if="variant === 'linear'">
      <div v-if="label || showValue" class="progress-header">
        <Progress.Label v-if="label" class="progress-label">
          {{ label }}
        </Progress.Label>
        <Progress.ValueText v-if="showValue" class="progress-value-text" />
      </div>
      <Progress.Track class="progress-track">
        <Progress.Range class="progress-range" />
      </Progress.Track>
    </template>

    <!-- Circular -->
    <template v-else>
      <div class="progress-circle-container">
        <Progress.Circle class="progress-circle">
          <Progress.CircleTrack class="progress-circle-track" />
          <Progress.CircleRange class="progress-circle-range" />
        </Progress.Circle>
        <Progress.ValueText v-if="showValue" class="progress-circle-value" />
      </div>
      <Progress.Label v-if="label" class="progress-label progress-label--center">
        {{ label }}
      </Progress.Label>
    </template>
  </Progress.Root>
</template>

<style scoped>
.progress-root {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  font-family: var(--font-base), sans-serif;
}

/* ── Header (linear) ── */
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

.progress-label--center {
  text-align: center;
}

.progress-value-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
}

/* ── Linear track ── */
.progress-track {
  width: 100%;
  height: 8px;
  background-color: var(--color-neutral-lm);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.progress-range {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: width var(--transition-base);
}

/* Indeterminate linear animation */
.progress-root[data-state="indeterminate"] .progress-range {
  width: 40% !important;
  animation: indeterminate-linear 1.4s ease-in-out infinite;
}

@keyframes indeterminate-linear {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

/* ── Circular ── */
.progress-circle-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
}

.progress-circle {
  --size: 64px;
  --thickness: 6px;
  width: var(--size);
  height: var(--size);
}

.progress-circle-track {
  stroke: var(--color-neutral-lm);
  stroke-width: var(--thickness);
  fill: none;
}

.progress-circle-range {
  stroke: var(--color-primary);
  stroke-width: var(--thickness);
  stroke-linecap: round;
  fill: none;
  transition: stroke-dashoffset var(--transition-base);
}

.progress-circle-value {
  position: absolute;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary);
}

/* Indeterminate circular animation */
.progress-root[data-state="indeterminate"] .progress-circle-range {
  animation: indeterminate-circular 1.4s linear infinite;
  transform-origin: center;
}

@keyframes indeterminate-circular {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>