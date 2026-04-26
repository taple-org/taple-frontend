<script setup lang="ts">
import type { PeriodActivity, TenantStatsResponse } from "~/api/generated/api";
import DashboardStatsCard from "~/components/dashboard/stats-card.vue";
import DashboardFunnelChart from "~/components/dashboard/funnel-chart.vue";
import DashboardActivityChart from "~/components/dashboard/activity-chart.vue";
import DashboardMemberPerformanceChart from "~/components/dashboard/member-performance-chart.vue";
import DashboardTasksDonutChart from "~/components/dashboard/tasks-donut-chart.vue";
import DashboardConversionChart from "~/components/dashboard/conversion-chart.vue";
import DashboardTimeInStageChart from "~/components/dashboard/time-in-stage-chart.vue";
import DashboardMembersDistributionCard from "~/components/dashboard/members-distribution-card.vue";
import { extractApiClientError } from "~/utils/extractApiClientError";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useSeoMeta({
  title: t("dashboard.statistics.metaTitle"),
  description: t("dashboard.statistics.metaDescription"),
  robots: "noindex, nofollow",
});

const route = useRoute();
const workspaceId = computed(() => String(route.params.workspaceId || ""));
const { $apiClient } = useNuxtApp();

const stats = ref<TenantStatsResponse | null>(null);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const lastUpdatedAt = ref<Date | null>(null);

const fallbackPeriod: PeriodActivity = {
  new_leads: 0,
  notes_added: 0,
  stage_changes: 0,
};

const period7Days = computed(() => stats.value?.last_7_days || fallbackPeriod);
const period30Days = computed(
  () => stats.value?.last_30_days || fallbackPeriod,
);
const conversions = computed(() => stats.value?.conversions || []);
const avgTimeInStage = computed(() => stats.value?.avg_time_in_stage || []);

const statsCards = computed(() => {
  if (!stats.value) return [];

  return [
    {
      title: t("dashboard.stats.totalLeads"),
      value: stats.value.total_leads,
      icon: "my-icon-users",
      trend: "neutral" as const,
    },
    {
      title: t("dashboard.stats.openTasks"),
      value: stats.value.tasks?.open || 0,
      icon: "my-icon-outline-clipboard-list",
      trend:
        (stats.value.tasks?.open || 0) > 0
          ? ("down" as const)
          : ("up" as const),
    },
    {
      title: t("dashboard.stats.completedTasks"),
      value: stats.value.tasks?.completed || 0,
      icon: "my-icon-check",
      trend: "up" as const,
    },
    {
      title: t("dashboard.stats.avgFitScore"),
      value:
        typeof stats.value.avg_fit_score === "number"
          ? String(Math.round(stats.value.avg_fit_score * 100)) + "%"
          : "—",
      icon: "my-icon-star-filled",
      trend: "neutral" as const,
    },
    {
      title: t("dashboard.stats.avgPriorityScore"),
      value:
        typeof stats.value.avg_priority_score === "number"
          ? stats.value.avg_priority_score.toFixed(2)
          : "—",
      icon: "my-icon-outline-chart-square-bar",
      trend: "neutral" as const,
    },
  ];
});

const formattedUpdatedAt = computed(() => {
  if (!lastUpdatedAt.value) return "";
  const dateStr = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(lastUpdatedAt.value);
  return t("dashboard.statistics.updatedAt", { date: dateStr });
});

const hasMemberPerformance = computed(
  () => (stats.value?.member_performance?.length || 0) > 0,
);
const hasMembersDistribution = computed(
  () => (stats.value?.members?.length || 0) > 0,
);

async function fetchStats() {
  try {
    isLoading.value = true;
    errorMessage.value = null;

    const response =
      await $apiClient.api.getTenantStatsApiV1TenantsTenantIdStatsGet(
        workspaceId.value,
      );

    stats.value = response.data.result;
    lastUpdatedAt.value = new Date();
  } catch (error) {
    const apiError = extractApiClientError(error);
    errorMessage.value =
      apiError?.message || t("dashboard.statistics.errorMessage");
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchStats);
</script>

<template>
  <ui-container :padding="[28, 15, 38]">
    <div class="dashboard-page">
      <header class="dashboard-page__hero">
        <div class="dashboard-page__hero-copy">
          <h1 class="dashboard-page__title">
            {{ t("dashboard.statistics.title") }}
          </h1>
        </div>

        <div class="dashboard-page__hero-actions">
          <span v-if="formattedUpdatedAt" class="dashboard-page__updated-at">
            {{ formattedUpdatedAt }}
          </span>
          <ui-button
            variant="outline"
            icon-left="my-icon-refresh"
            :disabled="isLoading"
            @click="fetchStats"
          >
            {{ t("dashboard.statistics.refresh") }}
          </ui-button>
        </div>
      </header>

      <section v-if="errorMessage" class="dashboard-page__error">
        <div class="dashboard-page__error-icon">
          <Icon
            name="my-icon-outline-exclamation-circle"
            mode="svg"
            :size="18"
          />
        </div>
        <div class="dashboard-page__error-copy">
          <h2>{{ t("dashboard.statistics.errorTitle") }}</h2>
          <p>{{ errorMessage }}</p>
        </div>
        <ui-button variant="primary" @click="fetchStats">{{
          t("dashboard.statistics.retry")
        }}</ui-button>
      </section>

      <section v-else-if="isLoading" class="dashboard-page__skeleton">
        <div
          class="dashboard-page__skeleton-grid dashboard-page__skeleton-grid--stats"
        >
          <div
            v-for="item in 5"
            :key="'stats-skeleton-' + item"
            class="dashboard-page__skeleton-card"
          />
        </div>
        <div
          class="dashboard-page__skeleton-grid dashboard-page__skeleton-grid--charts"
        >
          <div class="dashboard-page__skeleton-chart" />
          <div class="dashboard-page__skeleton-chart" />
        </div>
      </section>

      <template v-else-if="stats">
        <section class="dashboard-page__stats-grid">
          <DashboardStatsCard
            v-for="card in statsCards"
            :key="card.title"
            :title="card.title"
            :value="card.value"
            :icon="card.icon"
            :trend="card.trend"
          />
        </section>

        <section class="dashboard-page__grid dashboard-page__grid--two">
          <DashboardFunnelChart :data="stats.funnel || []" />
          <DashboardActivityChart
            :period7-days="period7Days"
            :period30-days="period30Days"
          />
        </section>

        <section class="dashboard-page__grid dashboard-page__grid--two">
          <DashboardTasksDonutChart :tasks="stats.tasks" />
          <DashboardTimeInStageChart
            v-if="avgTimeInStage.length"
            :items="avgTimeInStage"
          />
        </section>

        <section v-if="conversions.length" class="dashboard-page__grid">
          <DashboardConversionChart :conversions="conversions" />
        </section>

        <section
          v-if="hasMemberPerformance || hasMembersDistribution"
          class="dashboard-page__grid dashboard-page__grid--two"
        >
          <DashboardMemberPerformanceChart
            v-if="hasMemberPerformance"
            :members="stats.member_performance || []"
          />
          <DashboardMembersDistributionCard
            v-if="hasMembersDistribution"
            :members="stats.members || []"
            :total-leads="stats.total_leads"
          />
        </section>
      </template>
    </div>
  </ui-container>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-page__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #eceef5;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
}

.dashboard-page__hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 760px;
}

.dashboard-page__title {
  margin: 0;
  color: #2f3036;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.dashboard-page__description {
  margin: 0;
  color: #71727a;
  font-size: 14px;
  line-height: 1.6;
}

.dashboard-page__description code {
  font-size: 12px;
  color: #4b6fb9;
  background: #eef4ff;
  padding: 2px 6px;
  border-radius: 8px;
}

.dashboard-page__hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.dashboard-page__updated-at {
  font-size: 12px;
  color: #8f9098;
}

.dashboard-page__error {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  border-radius: 16px;
  border: 1px solid #f6c7cc;
  background: #fff7f8;
  color: #bf4b58;
  padding: 16px;
}

.dashboard-page__error-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffe6e9;
}

.dashboard-page__error-copy h2 {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 600;
}

.dashboard-page__error-copy p {
  margin: 0;
  color: #d05b67;
  font-size: 13px;
}

.dashboard-page__stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.dashboard-page__grid {
  display: grid;
  gap: 14px;
}

.dashboard-page__grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dashboard-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dashboard-page__skeleton-grid {
  display: grid;
  gap: 12px;
}

.dashboard-page__skeleton-grid--stats {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.dashboard-page__skeleton-grid--charts {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dashboard-page__skeleton-card,
.dashboard-page__skeleton-chart {
  border-radius: 16px;
  background: linear-gradient(90deg, #f3f5fb 25%, #ebedf4 50%, #f3f5fb 75%);
  background-size: 200% 100%;
  animation: dashboard-shimmer 1.6s infinite;
}

.dashboard-page__skeleton-card {
  height: 114px;
}

.dashboard-page__skeleton-chart {
  height: 300px;
}

@keyframes dashboard-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1100px) {
  .dashboard-page__grid--two,
  .dashboard-page__skeleton-grid--charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .dashboard-page__hero {
    flex-direction: column;
  }

  .dashboard-page__hero-actions {
    align-items: flex-start;
  }

  .dashboard-page__title {
    font-size: 20px;
  }

  .dashboard-page__error {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
