<script setup lang="ts">
import Chart from "chart.js/auto";
import type { AvgTimeInStage } from "~/api/generated/api";
import { formatStageLabel } from "~/utils/formatStageLabel";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  items: AvgTimeInStage[];
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const chartData = computed(() => ({
  labels: props.items.map((item) =>
    formatStageLabel(item.stage, item.label_ru),
  ),
  datasets: [
    {
      label: t("dashboard.charts.timeInStage"),
      data: props.items.map((item) =>
        Number(Number(item.avg_days || 0).toFixed(1)),
      ),
      backgroundColor: "rgba(247, 149, 120, 0.42)",
      borderColor: "rgba(247, 149, 120, 0.88)",
      borderWidth: 1,
      borderRadius: 8,
      maxBarThickness: 26,
    },
  ],
}));

const chartOptions = {
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
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
        label: (context: { parsed: { x: number } }) =>
          ` ${context.parsed.x} ${t("dashboard.charts.days")}`,
      },
    },
  },
  scales: {
    x: {
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
    y: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: "#71727a",
        font: {
          family: "StyreneALC, sans-serif",
          size: 11,
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
  () => props.items,
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
  <div class="time-in-stage-chart">
    <h3 class="time-in-stage-chart__title">
      {{ t("dashboard.charts.timeInStage") }}
    </h3>
    <div class="time-in-stage-chart__container">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.time-in-stage-chart {
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eceef5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-in-stage-chart__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3036;
}

.time-in-stage-chart__container {
  position: relative;
  height: 280px;
  width: 100%;
}

.time-in-stage-chart__container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
