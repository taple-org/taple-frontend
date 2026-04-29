<script setup lang="ts">
import type { MerchantListItem } from "~/api/generated/api";
import { groupMonitoringColumns } from "~/components/workspace/monitoring/model";
import { useWorkspaceMonitoringFilter } from "~/composables/workspace/useWorkspaceMonitoringFilter";
import { useI18n } from "vue-i18n";

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n();

useSeoMeta({
  title: t("monitoring.pageTitle"),
  description: t("monitoring.pageDescription"),
  robots: "noindex, nofollow",
})

const route = useRoute();
const workspaceId = route.params.workspaceId as string;
const { form, state, apply, reset } = useWorkspaceMonitoringFilter();

const search = computed(() => state.search || undefined);
const category_code = computed(() => state.category_code || undefined);
const responsible_id = computed(() => state.responsible_id || undefined);

const { data: merchants, pending, error, refresh } = useAsyncData(
  `merchants-${workspaceId}`,
  (nuxtApp) =>
    nuxtApp.$apiClient.api
      .listMerchantsApiV1LeadsMerchantsGet({
        tenant_id: workspaceId,
        search: search.value,
        category_code: category_code.value,
        responsible_member_id: responsible_id.value,
      })
      .then((response) => response.data.result),
  { server: false, default: () => [] as MerchantListItem[] },
);

const showLoadingState = computed(() => import.meta.server || pending.value);

watch(state, () => refresh());

watch(error, (err) => {
  if (err) throw createError({ fatal: true, status: err.status, statusText: err.statusText });
}, { immediate: true });

const columns = computed(() => groupMonitoringColumns(merchants.value ?? [], t));
const totalCount = computed(() => merchants.value?.length ?? 0);

provide("workspaceId", workspaceId);
</script>
<template>
  <ui-container :padding="[30, 15]">
    <section class="monitoring-page__hero">
      <div class="monitoring-page__actions">
        <div class="monitoring-page__stat">
          <strong>{{ totalCount }}</strong>
          <span>{{ t("monitoring.totalCompanies", { count: totalCount }) }}</span>
        </div>
      </div>
    </section>

    <workspace-monitoring-filters
      v-model:search="form.$value.search"
      v-model:category_code="form.$value.category_code"
      v-model:responsible_id="form.$value.responsible_id"
      @apply="apply"
      @reset="reset"
    />
    <div v-if="showLoadingState" class="monitoring-page__state">{{ t("monitoring.loading") }}</div>
    <client-only v-else>
      <workspace-monitoring-board
        :columns="columns"
        :workspace-id="workspaceId"
        @changed="refresh"
      />
    </client-only>
  </ui-container>
</template>

<style scoped>
.monitoring-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 4px;
}

.monitoring-page__actions {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.monitoring-page__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 12px 14px;
  border-radius: 16px;
  background: var(--color-neutral-ll);
}

.monitoring-page__stat strong {
  color: var(--color-neutral-dd);
  font-size: 20px;
  line-height: 1;
}

.monitoring-page__stat span,
.monitoring-page__state {
  color: var(--color-neutral-dl);
  font-size: 12px;
}

.monitoring-page__state {
  padding: 24px 0;
}

@media (max-width: 640px) {
  .monitoring-page__stat {
    align-items: flex-start;
  }
}
</style>
