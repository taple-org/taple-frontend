<script setup lang="ts">
import Chart from 'chart.js/auto';

interface ActivityData {
  labels: string[];
  newLeads: number[];
  notesAdded: number[];
  stageChanges: number[];
}

interface Props {
  data7Days: ActivityData;
  data30Days: ActivityData;
}

const props = defineProps<Props>();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
const period = ref<'7days' | '30days'>('7days');

const currentData = computed(() => {
  return period.value === '7days' ? props.data7Days : props.data30Days;
});

const chartData = computed(() => ({
  labels: currentData.value.labels,
  datasets: [
    {
      label: 'Новые лиды',
      data: currentData.value.newLeads,
      borderColor: 'rgba(0, 111, 253, 1)',
      backgroundColor: 'rgba(0, 111, 253, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(0, 111, 253, 1)',
      pointBorderColor: 'var(--color-white)',
      pointBorderWidth: 2,
    },
    {
      label: 'Заметки',
      data: currentData.value.notesAdded,
      borderColor: 'rgba(58, 192, 160, 1)',
      backgroundColor: 'rgba(58, 192, 160, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(58, 192, 160, 1)',
      pointBorderColor: 'var(--color-white)',
      pointBorderWidth: 2,
    },
    {
      label: 'Смены этапов',
      data: currentData.value.stageChanges,
      borderColor: 'rgba(232, 99, 57, 1)',
      backgroundColor: 'rgba(232, 99, 57, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(232, 99, 57, 1)',
      pointBorderColor: 'var(--color-white)',
      pointBorderWidth: 2,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 16,
        font: {
          family: 'StyreneALC, sans-serif',
          size: 12,
        },
        color: 'var(--color-neutral-dm)',
      },
    },
    tooltip: {
      backgroundColor: 'var(--color-neutral-dd)',
      titleColor: 'var(--color-white)',
      bodyColor: 'var(--color-white)',
      borderColor: 'var(--color-neutral-dm)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
      },
      ticks: {
        color: 'var(--color-neutral-dl)',
        font: {
          family: 'StyreneALC, sans-serif',
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: 'var(--color-neutral-dl)',
        font: {
          family: 'StyreneALC, sans-serif',
          size: 11,
        },
      },
    },
  },
};

onMounted(() => {
  if (canvasRef.value) {
    chartInstance = new Chart(canvasRef.value, {
      type: 'line',
      data: chartData.value,
      options: chartOptions as any,
    });
  }
});

watch(() => currentData.value, () => {
  if (chartInstance) {
    chartInstance.data = chartData.value;
    chartInstance.update();
  }
}, { deep: true });

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div class="activity-chart">
    <div class="activity-chart__header">
      <h3 class="activity-chart__title">Активность</h3>
      <div class="activity-chart__periods">
        <button
          :class="['activity-chart__period-btn', { 'activity-chart__period-btn--active': period === '7days' }]"
          @click="period = '7days'"
        >
          7 дней
        </button>
        <button
          :class="['activity-chart__period-btn', { 'activity-chart__period-btn--active': period === '30days' }]"
          @click="period = '30days'"
        >
          30 дней
        </button>
      </div>
    </div>
    <div class="activity-chart__container">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.activity-chart {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-chart__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.activity-chart__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin: 0;
}

.activity-chart__periods {
  display: flex;
  gap: 4px;
  background: var(--color-neutral-ll);
  padding: 4px;
  border-radius: 8px;
}

.activity-chart__period-btn {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  background: transparent;
  color: var(--color-neutral-dl);
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-base), sans-serif;
}

.activity-chart__period-btn:hover {
  color: var(--color-neutral-dm);
}

.activity-chart__period-btn--active {
  background: var(--color-white);
  color: var(--color-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-chart__container {
  position: relative;
  height: 280px;
  width: 100%;
}

.activity-chart__container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
