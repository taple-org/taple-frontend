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
  labels: props.members.map((m) => m.full_name.split(" ")[0]),
  datasets: [
    {
      label: "Задачи",
      data: props.members.map((m) => m.tasks_completed || 0),
      backgroundColor: "rgba(0, 111, 253, 0.8)",
      borderColor: "rgba(0, 111, 253, 1)",
      borderWidth: 1,
      borderRadius: 4,
    },
    {
      label: "Заметки",
      data: props.members.map((m) => m.notes_added || 0),
      backgroundColor: "rgba(58, 192, 160, 0.8)",
      borderColor: "rgba(58, 192, 160, 1)",
      borderWidth: 1,
      borderRadius: 4,
    },
    {
      label: "Смены этапов",
      data: props.members.map((m) => m.stage_changes || 0),
      backgroundColor: "rgba(232, 99, 57, 0.8)",
      borderColor: "rgba(232, 99, 57, 1)",
      borderWidth: 1,
      borderRadius: 4,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      align: "end" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "rectRounded",
        padding: 12,
        font: {
          family: "StyreneALC, sans-serif",
          size: 12,
        },
        color: "var(--color-neutral-dm)",
      },
    },
    tooltip: {
      backgroundColor: "var(--color-neutral-dd)",
      titleColor: "var(--color-white)",
      bodyColor: "var(--color-white)",
      borderColor: "var(--color-neutral-dm)",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        title: (items: any[]) => {
          const idx = items[0].dataIndex;
          return props.members[idx]?.full_name || "";
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
  () => props.members,
  (newMembers) => {
    if (chartInstance) {
      chartInstance.data.labels = newMembers.map(
        (m) => m.full_name.split(" ")[0],
      );
      if (chartInstance.data.datasets[0]) {
        chartInstance.data.datasets[0].data = newMembers.map(
          (m) => m.tasks_completed || 0,
        );
      }
      if (chartInstance.data.datasets[1]) {
        chartInstance.data.datasets[1].data = newMembers.map(
          (m) => m.notes_added || 0,
        );
      }
      if (chartInstance.data.datasets[2]) {
        chartInstance.data.datasets[2].data = newMembers.map(
          (m) => m.stage_changes || 0,
        );
      }
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
  <div class="member-performance-chart">
    <h3 class="member-performance-chart__title">Эффективность команды</h3>
    <div class="member-performance-chart__container">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.member-performance-chart {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-performance-chart__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin: 0;
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
