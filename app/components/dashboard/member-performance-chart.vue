<script setup lang="ts">
import Chart from "chart.js/auto";

interface MemberPerformance {
  member_id: string;
  full_name: string;
  tasks_completed?: number;
  notes_added?: number;
  stage_changes?: number;
  leads_won?: number;
  leads_lost?: number;
}

interface Props {
  members: MemberPerformance[];
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const chartData = computed(() => ({
  labels: props.members.map((member) => member.full_name.split(" ")[0]),
  datasets: [
    {
      label: "Задачи",
      data: props.members.map((member) => member.tasks_completed || 0),
      backgroundColor: "rgba(108, 156, 255, 0.54)",
      borderColor: "rgba(108, 156, 255, 0.95)",
      borderWidth: 1,
      borderRadius: 8,
    },
    {
      label: "Заметки",
      data: props.members.map((member) => member.notes_added || 0),
      backgroundColor: "rgba(58, 192, 160, 0.46)",
      borderColor: "rgba(58, 192, 160, 0.9)",
      borderWidth: 1,
      borderRadius: 8,
    },
    {
      label: "Смены этапов",
      data: props.members.map((member) => member.stage_changes || 0),
      backgroundColor: "rgba(247, 149, 120, 0.43)",
      borderColor: "rgba(247, 149, 120, 0.9)",
      borderWidth: 1,
      borderRadius: 8,
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
        pointStyle: "rectRounded",
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
      callbacks: {
        title: (items: Array<{ dataIndex: number }>) => {
          const index = items[0]?.dataIndex ?? 0;
          return props.members[index]?.full_name || "";
        },
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
  () => props.members,
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
  <div class="member-performance-chart">
    <h3 class="member-performance-chart__title">Эффективность команды</h3>
    <div class="member-performance-chart__container">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.member-performance-chart {
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eceef5;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-performance-chart__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3036;
}

.member-performance-chart__container {
  position: relative;
  height: 280px;
  width: 100%;
}

.member-performance-chart__container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
