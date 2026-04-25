<script setup lang="ts">
import Chart from "chart.js/auto";

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

const chartData = computed(() => {
  return {
    labels: props.data.map((item) => item.label_ru),
    datasets: [
      {
        label: "Количество",
        data: props.data.map((item) => item.count),
        backgroundColor: [
          "rgba(0, 111, 253, 0.8)",
          "rgba(0, 111, 253, 0.65)",
          "rgba(0, 111, 253, 0.5)",
          "rgba(0, 111, 253, 0.35)",
          "rgba(0, 111, 253, 0.2)",
        ],
        borderColor: "rgba(0, 111, 253, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "var(--color-neutral-dd)",
      titleColor: "var(--color-white)",
      bodyColor: "var(--color-white)",
      borderColor: "var(--color-neutral-dm)",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: (context: any) => {
          return ` ${context.parsed.y} лидов`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
        drawBorder: false,
      },
      ticks: {
        color: "var(--color-neutral-dl)",
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
        color: "var(--color-neutral-dl)",
        font: {
          family: "StyreneALC, sans-serif",
          size: 11,
        },
        maxRotation: 45,
        minRotation: 0,
      },
    },
  },
};

onMounted(() => {
  if (canvasRef.value) {
    chartInstance = new Chart(canvasRef.value, {
      type: "bar",
      data: chartData.value,
      options: chartOptions as any,
    });
  }
});

watch(
  () => props.data,
  (newData) => {
    if (chartInstance && chartInstance.data.datasets[0]) {
      chartInstance.data.labels = newData.map((item) => item.label_ru);
      chartInstance.data.datasets[0].data = newData.map((item) => item.count);
      chartInstance.update();
    }
  },
  { deep: true },
);

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
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
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.funnel-chart__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin: 0;
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
