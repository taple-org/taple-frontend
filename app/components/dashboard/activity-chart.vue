<script setup lang="ts">
import Chart from "chart.js/auto";
import type { PeriodActivity } from "~/api/generated/api";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  period7Days: PeriodActivity;
  period30Days: PeriodActivity;
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const labels = computed(() => [
  t("dashboard.newLeads"),
  t("dashboard.notes"),
  t("dashboard.stageChanges"),
]);

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: t("dashboard.last7Days"),
      data: [
        props.period7Days.new_leads,
        props.period7Days.notes_added,
        props.period7Days.stage_changes,
      ],
      backgroundColor: "rgba(108, 156, 255, 0.55)",
      borderColor: "rgba(108, 156, 255, 0.95)",
      borderWidth: 1,
      borderRadius: 10,
      maxBarThickness: 34,
    },
    {
      label: t("dashboard.last30Days"),
      data: [
        props.period30Days.new_leads,
        props.period30Days.notes_added,
        props.period30Days.stage_changes,
      ],
      backgroundColor: "rgba(58, 192, 160, 0.45)",
      borderColor: "rgba(58, 192, 160, 0.92)",
      borderWidth: 1,
      borderRadius: 10,
      maxBarThickness: 34,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: "top" as const,
      align: "start" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 14,
        boxHeight: 8,
        boxWidth: 8,
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
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(143, 144, 152, 0.12)",
        drawBorder: false,
      },
      ticks: {
        color: "#8f9098",
        font: {
          family: "StyreneALC, sans-serif",
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
        color: "#71727a",
        font: {
          family: "StyreneALC, sans-serif",
          size: 12,
        },
      },
    },
  },
};

onMounted(() => {
  if (!canvasRef.value) return;
  chartInstance = new Chart(canvasRef.value, {
    type: "bar",
    data: chartData.value,
    options: chartOptions as never,
  });
});

watch(
  () => [props.period7Days, props.period30Days],
  () => {
    if (!chartInstance) return;
    chartInstance.data = chartData.value;
    chartInstance.update();
  },
  { deep: true },
);

onUnmounted(() => {
  chartInstance?.destroy();
});
</script>

<template>
  <div class="activity-chart">
    <div class="activity-chart__header">
      <h3 class="activity-chart__title">
        {{ t("dashboard.charts.activityTitle") }}
      </h3>
      <p class="activity-chart__subtitle">
        {{ t("dashboard.charts.activitySubtitle") }}
      </p>
    </div>
    <div class="activity-chart__container">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.activity-chart {
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eceef5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.activity-chart__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-chart__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3036;
}

.activity-chart__subtitle {
  margin: 0;
  font-size: 12px;
  color: #8f9098;
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
