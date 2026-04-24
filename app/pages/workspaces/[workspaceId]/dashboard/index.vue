<script setup lang="ts">
import type { TenantStatsResponse } from "~/api/generated/api";
import DashboardStatsCard from "~/components/dashboard/stats-card.vue";
import DashboardFunnelChart from "~/components/dashboard/funnel-chart.vue";
import DashboardActivityChart from "~/components/dashboard/activity-chart.vue";
import DashboardMemberPerformanceChart from "~/components/dashboard/member-performance-chart.vue";
import DashboardTasksDonutChart from "~/components/dashboard/tasks-donut-chart.vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useSeoMeta({
  title: "Дэшборд рабочего пространства — Taple",
  description:
    "Обзор статистики и ключевых показателей рабочего пространства в Taple.",
  robots: "noindex, nofollow",
});

const route = useRoute();
const workspaceId = computed(() => route.params.workspaceId as string);
const { $apiClient } = useNuxtApp();

const stats = ref<TenantStatsResponse | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchStats() {
  try {
    isLoading.value = true;
    error.value = null;
    const response =
      await $apiClient.api.getTenantStatsApiV1TenantsTenantIdStatsGet(
        workspaceId.value,
      );
    stats.value = response.data.result;
  } catch (err) {
    console.error("Failed to fetch tenant stats:", err);
    error.value = "Не удалось загрузить статистику";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchStats();
});

const statsCards = computed(() => {
  if (!stats.value) return [];

  return [
    {
      title: "Всего лидов",
      value: stats.value.total_leads,
      icon: "my-icon-users",
      trend: "neutral" as const,
    },
    {
      title: "Открытые задачи",
      value: stats.value.tasks?.open || 0,
      icon: "my-icon-task",
      trend: stats.value.tasks?.open > 5 ? ("down" as const) : ("up" as const),
    },
    {
      title: "Завершенные задачи",
      value: stats.value.tasks?.completed || 0,
      icon: "my-icon-check",
      trend: "up" as const,
    },
    {
      title: "Средний Fit Score",
      value: stats.value.avg_fit_score
        ? `${Math.round(stats.value.avg_fit_score * 100)}%`
        : "—",
      icon: "my-icon-star",
      trend: "neutral" as const,
    },
  ];
});

const activity7Days = computed(() => {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  if (!stats.value?.last_7_days) {
    return {
      labels: days,
      newLeads: [0, 0, 0, 0, 0, 0, 0],
      notesAdded: [0, 0, 0, 0, 0, 0, 0],
      stageChanges: [0, 0, 0, 0, 0, 0, 0],
    };
  }
  return {
    labels: days,
    newLeads: [stats.value.last_7_days.new_leads, 0, 0, 0, 0, 0, 0],
    notesAdded: [stats.value.last_7_days.notes_added, 0, 0, 0, 0, 0, 0],
    stageChanges: [stats.value.last_7_days.stage_changes, 0, 0, 0, 0, 0, 0],
  };
});

const activity30Days = computed(() => {
  const weeks = ["Неделя 1", "Неделя 2", "Неделя 3", "Неделя 4"];
  if (!stats.value?.last_30_days) {
    return {
      labels: weeks,
      newLeads: [0, 0, 0, 0],
      notesAdded: [0, 0, 0, 0],
      stageChanges: [0, 0, 0, 0],
    };
  }
  return {
    labels: weeks,
    newLeads: [stats.value.last_30_days.new_leads, 0, 0, 0],
    notesAdded: [stats.value.last_30_days.notes_added, 0, 0, 0],
    stageChanges: [stats.value.last_30_days.stage_changes, 0, 0, 0],
  };
});
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <h1 class="dashboard__title">Статистика рабочего пространства</h1>
      <ui-button
        variant="outline"
        icon-left="my-icon-refresh"
        :loading="isLoading"
        @click="fetchStats"
      >
        Обновить
      </ui-button>
    </div>

    <div v-if="error" class="dashboard__error">
      <Icon name="my-icon-alert" mode="svg" :size="24" />
      <span>{{ error }}</span>
      <ui-button variant="primary" @click="fetchStats">Повторить</ui-button>
    </div>

    <div v-else-if="isLoading" class="dashboard__loading">
      <div class="dashboard__skeleton dashboard__skeleton--title" />
      <div class="dashboard__stats-grid">
        <div
          v-for="i in 4"
          :key="i"
          class="dashboard__skeleton dashboard__skeleton--card"
        />
      </div>
      <div class="dashboard__charts-grid">
        <div class="dashboard__skeleton dashboard__skeleton--chart" />
        <div class="dashboard__skeleton dashboard__skeleton--chart" />
      </div>
    </div>

    <template v-else-if="stats">
      <div class="dashboard__stats-grid">
        <DashboardStatsCard
          v-for="card in statsCards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :trend="card.trend"
        />
      </div>

      <div class="dashboard__charts-grid">
        <DashboardFunnelChart :data="stats.funnel || []" />
        <DashboardActivityChart
          :data7-days="activity7Days"
          :data30-days="activity30Days"
        />
      </div>

      <div v-if="stats.tasks" class="dashboard__tasks-section">
        <DashboardTasksDonutChart :tasks="stats.tasks" />
      </div>

      <div
        v-if="stats.member_performance && stats.member_performance.length > 0"
        class="dashboard__performance"
      >
        <DashboardMemberPerformanceChart :members="stats.member_performance" />
      </div>

      <div
        v-if="stats.members && stats.members.length > 0"
        class="dashboard__members"
      >
        <h2 class="dashboard__section-title">Распределение лидов</h2>
        <div class="dashboard__members-list">
          <div
            v-for="member in stats.members"
            :key="member.member_id"
            class="dashboard__member-item"
          >
            <div class="dashboard__member-info">
              <span class="dashboard__member-name">{{ member.full_name }}</span>
            </div>
            <div class="dashboard__member-bar">
              <div
                class="dashboard__member-progress"
                :style="{
                  width: `${Math.min(100, (member.leads_count / (stats.total_leads || 1)) * 100)}%`,
                }"
              />
            </div>
            <span class="dashboard__member-count">{{
              member.leads_count
            }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px 64px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin: 0;
}

.dashboard__error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: var(--color-error-l);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
}

.dashboard__loading {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard__skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-ll) 25%,
    var(--color-neutral-lm) 50%,
    var(--color-neutral-ll) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.dashboard__skeleton--title {
  height: 36px;
  width: 300px;
}

.dashboard__skeleton--card {
  height: 120px;
}

.dashboard__skeleton--chart {
  height: 340px;
}

.dashboard__stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.dashboard__charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

@media (max-width: 900px) {
  .dashboard__charts-grid {
    grid-template-columns: 1fr;
  }
}

.dashboard__performance {
  margin-top: 8px;
}

.dashboard__tasks-section {
  max-width: 400px;
}

.dashboard__members {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 24px;
}

.dashboard__section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin: 0 0 20px 0;
}

.dashboard__members-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard__member-item {
  display: grid;
  grid-template-columns: 150px 1fr 60px;
  align-items: center;
  gap: 16px;
}

@media (max-width: 600px) {
  .dashboard__member-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

.dashboard__member-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dm);
}

.dashboard__member-bar {
  height: 8px;
  background: var(--color-neutral-ll);
  border-radius: 4px;
  overflow: hidden;
}

.dashboard__member-progress {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width var(--transition-base);
}

.dashboard__member-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  text-align: right;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 24px 16px;
  }

  .dashboard__title {
    font-size: 22px;
  }

  .dashboard__stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .dashboard__stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
