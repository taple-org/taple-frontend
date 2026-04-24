<script setup lang="ts">
import Chart from 'chart.js/auto';

interface TasksStats {
  open: number;
  completed: number;
  overdue: number;
}

interface Props {
  tasks: TasksStats;
}

const props = defineProps<Props>();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const chartData = computed(() => ({
  labels: ['Открытые', 'Завершенные', 'Просроченные'],
  datasets: [{
    data: [props.tasks.open, props.tasks.completed, props.tasks.overdue],
    backgroundColor: [
      'rgba(0, 111, 253, 0.8)',
      'rgba(58, 192, 160, 0.8)',
      'rgba(255, 97, 109, 0.8)',
    ],
    borderColor: [
      'rgba(0, 111, 253, 1)',
      'rgba(58, 192, 160, 1)',
      'rgba(255, 97, 109, 1)',
    ],
    borderWidth: 2,
    hoverOffset: 4,
  }],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'bottom' as const,
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
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return ` ${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

onMounted(() => {
  if (canvasRef.value) {
    chartInstance = new Chart(canvasRef.value, {
      type: 'doughnut',
      data: chartData.value,
      options: chartOptions as any,
    });
  }
});

watch(() => props.tasks, (newTasks) => {
  if (chartInstance && chartInstance.data.datasets[0]) {
    chartInstance.data.datasets[0].data = [newTasks.open, newTasks.completed, newTasks.overdue];
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
  <div class="tasks-donut-chart">
    <h3 class="tasks-donut-chart__title">Задачи</h3>
    <div class="tasks-donut-chart__container">
      <canvas ref="canvasRef" />
    </div>
    <div class="tasks-donut-chart__stats">
      <div class="tasks-donut-chart__stat">
        <span class="tasks-donut-chart__stat-dot" style="background: rgba(0, 111, 253, 0.8)" />
        <span class="tasks-donut-chart__stat-label">Открытые</span>
        <span class="tasks-donut-chart__stat-value">{{ tasks.open }}</span>
      </div>
      <div class="tasks-donut-chart__stat">
        <span class="tasks-donut-chart__stat-dot" style="background: rgba(58, 192, 160, 0.8)" />
        <span class="tasks-donut-chart__stat-label">Завершенные</span>
        <span class="tasks-donut-chart__stat-value">{{ tasks.completed }}</span>
      </div>
      <div class="tasks-donut-chart__stat">
        <span class="tasks-donut-chart__stat-dot" style="background: rgba(255, 97, 109, 0.8)" />
        <span class="tasks-donut-chart__stat-label">Просроченные</span>
        <span class="tasks-donut-chart__stat-value">{{ tasks.overdue }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tasks-donut-chart {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tasks-donut-chart__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin: 0;
}

.tasks-donut-chart__container {
  position: relative;
  height: 220px;
  width: 100%;
}

.tasks-donut-chart__container canvas {
  width: 100% !important;
  height: 100% !important;
}

.tasks-donut-chart__stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tasks-donut-chart__stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.tasks-donut-chart__stat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tasks-donut-chart__stat-label {
  color: var(--color-neutral-dl);
  flex: 1;
}

.tasks-donut-chart__stat-value {
  font-weight: 600;
  color: var(--color-neutral-dd);
}
</style>
