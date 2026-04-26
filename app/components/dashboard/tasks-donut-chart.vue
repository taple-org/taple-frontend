<script setup lang="ts">
import Chart from "chart.js/auto";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
  labels: [t("tasks.open"), t("tasks.completed"), t("tasks.overdue")],
  datasets: [
    {
      data: [props.tasks.open, props.tasks.completed, props.tasks.overdue],
      backgroundColor: [
        "rgba(108, 156, 255, 0.52)",
        "rgba(58, 192, 160, 0.5)",
        "rgba(247, 149, 120, 0.46)",
      ],
      borderColor: ["#6c9cff", "#3ac0a0", "#f79578"],
      borderWidth: 1,
      hoverOffset: 4,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 14,
        font: {
          family: "StyreneALC, sans-serif",
          size: 12,
        },
        color: "#494a50",
      },
    },
    tooltip: {
      backgroundColor: "#1f2024",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#494a50",
      borderWidth: 1,
      cornerRadius: 10,
      padding: 12,
      callbacks: {
        label: (context: {
          label: string;
          parsed: number;
          dataset: { data: number[] };
        }) => {
          const label = context.label || "";
          const value = context.parsed;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return ` ${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

onMounted(() => {
  if (!canvasRef.value) return;
  chartInstance = new Chart(canvasRef.value, {
    type: "doughnut",
    data: chartData.value,
    options: chartOptions as never,
  });
});

watch(
  () => props.tasks,
  (newTasks) => {
    if (!chartInstance || !chartInstance.data.datasets[0]) return;
    chartInstance.data.datasets[0].data = [
      newTasks.open,
      newTasks.completed,
      newTasks.overdue,
    ];
    chartInstance.update();
  },
  { deep: true },
);

onUnmounted(() => {
  chartInstance?.destroy();
});
</script>

<template>
  <div class="tasks-donut-chart">
    <h3 class="tasks-donut-chart__title">
      {{ t("dashboard.charts.tasksTitle") }}
    </h3>
    <div class="tasks-donut-chart__container">
      <canvas ref="canvasRef" />
    </div>
    <div class="tasks-donut-chart__stats">
      <div class="tasks-donut-chart__stat">
        <span
          class="tasks-donut-chart__stat-dot"
          style="background: rgba(108, 156, 255, 0.52)"
        />
        <span class="tasks-donut-chart__stat-label">{{
          t("dashboard.charts.open")
        }}</span>
        <span class="tasks-donut-chart__stat-value">{{ tasks.open }}</span>
      </div>
      <div class="tasks-donut-chart__stat">
        <span
          class="tasks-donut-chart__stat-dot"
          style="background: rgba(58, 192, 160, 0.5)"
        />
        <span class="tasks-donut-chart__stat-label">{{
          t("dashboard.charts.completed")
        }}</span>
        <span class="tasks-donut-chart__stat-value">{{ tasks.completed }}</span>
      </div>
      <div class="tasks-donut-chart__stat">
        <span
          class="tasks-donut-chart__stat-dot"
          style="background: rgba(247, 149, 120, 0.46)"
        />
        <span class="tasks-donut-chart__stat-label">{{
          t("dashboard.charts.overdue")
        }}</span>
        <span class="tasks-donut-chart__stat-value">{{ tasks.overdue }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tasks-donut-chart {
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eceef5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tasks-donut-chart__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3036;
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
  color: #8f9098;
  flex: 1;
}

.tasks-donut-chart__stat-value {
  font-weight: 600;
  color: #2f3036;
}
</style>
