<script setup lang="ts">
import Chart from "chart.js/auto";
import { formatStageLabel } from "~/utils/formatStageLabel";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface FunnelItem {
  stage: string;
  label_ru: string;
  count: number;
}

interface Props {
  data: FunnelItem[];
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const palette = [
  "rgba(108, 156, 255, 0.58)",
  "rgba(133, 175, 255, 0.54)",
  "rgba(159, 193, 255, 0.5)",
  "rgba(184, 209, 255, 0.45)",
  "rgba(208, 226, 255, 0.4)",
];

const chartData = computed(() => ({
  labels: props.data.map((item) => formatStageLabel(item.stage, item.label_ru)),
  datasets: [
    {
      label: t("dashboard.leadsCount"),
      data: props.data.map((item) => item.count),
      backgroundColor: props.data.map(
        (_, idx) => palette[idx % palette.length],
      ),
      borderColor: "rgba(108, 156, 255, 0.95)",
      borderWidth: 1,
      borderRadius: 10,
      maxBarThickness: 38,
    },
  ],
}));

const chartOptions = {
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
        label: (context: { parsed: { y: number } }) =>
          ` ${context.parsed.y} ${t("dashboard.leadsShort")}`,
      },
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
          size: 11,
        },
        maxRotation: 35,
        minRotation: 0,
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
  () => props.data,
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
  <div class="funnel-chart">
    <h3 class="funnel-chart__title">Воронка лидов</h3>
    <div class="funnel-chart__container">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.funnel-chart {
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eceef5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.funnel-chart__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3036;
}

.funnel-chart__container {
  position: relative;
  height: 280px;
  width: 100%;
}

.funnel-chart__container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
