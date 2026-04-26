<script setup lang="ts">
import Chart from "chart.js/auto";
import type { StageConversionItem } from "~/api/generated/api";
import { formatStageLabel } from "~/utils/formatStageLabel";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  conversions: StageConversionItem[];
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const toRatePercent = (value?: number | null) => {
  if (!value) return 0;
  if (value <= 1) return Math.round(value * 100);
  return Math.round(value);
};

const chartData = computed(() => ({
  labels: props.conversions.map(
    (item) =>
      `${formatStageLabel(item.from_stage)} -> ${formatStageLabel(item.to_stage)}`,
  ),
  datasets: [
    {
      type: "bar" as const,
      label: t("dashboard.transitionsCount"),
      data: props.conversions.map((item) => item.count),
      backgroundColor: "rgba(108, 156, 255, 0.46)",
      borderColor: "rgba(108, 156, 255, 0.92)",
      borderWidth: 1,
      borderRadius: 8,
      yAxisID: "y",
      order: 2,
      maxBarThickness: 34,
    },
    {
      type: "line" as const,
      label: t("dashboard.conversionPercent"),
      data: props.conversions.map((item) => toRatePercent(item.rate)),
      borderColor: "rgba(58, 192, 160, 0.9)",
      backgroundColor: "rgba(58, 192, 160, 0.2)",
      yAxisID: "y1",
      tension: 0.35,
      pointRadius: 3,
      pointHoverRadius: 4,
      order: 1,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      align: "start" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 12,
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
    y1: {
      beginAtZero: true,
      position: "right" as const,
      suggestedMax: 100,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: "#8f9098",
        callback: (value: string | number) => `${value}%`,
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: "#71727a",
        maxRotation: 30,
        minRotation: 0,
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
  () => props.conversions,
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
  <div class="conversion-chart">
    <h3 class="conversion-chart__title">
      {{ t("dashboard.charts.conversionTitle") }}
    </h3>
    <div class="conversion-chart__container">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.conversion-chart {
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eceef5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.conversion-chart__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3036;
}

.conversion-chart__container {
  position: relative;
  height: 300px;
  width: 100%;
}

.conversion-chart__container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
