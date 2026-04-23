<script lang="ts" setup>
import type { PipelineResponse } from "~/api/generated/api";
import { normalizePipelineColumns } from "~/components/workspace/pipeline/model";
import { useWorkspacePipelineFilter } from "~/composables/workspace/useWorkspacePipelineFilter";

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: "Воронка — Taple",
  description: "Управление воронкой продаж и этапами обработки лидов в Taple.",
  robots: "noindex, nofollow",
})

const route = useRoute();
const workspaceId = route.params.workspaceId as string;
const { form, state, apply, reset } = useWorkspacePipelineFilter()

const search        = computed(() => state.search        || undefined)
const category_code = computed(() => state.category_code || undefined)
const responsible_id = computed(() => state.responsible_id || undefined)

const { data: pipeline, pending, error, refresh } = useAsyncData(
    `pipeline-${workspaceId}`,
    (nuxtApp) => nuxtApp.$apiClient.api
        .getPipelineApiV1LeadsPipelineGet({
          tenant_id: workspaceId,
          search: search.value,
          category_code: category_code.value,
          responsible_member_id: responsible_id.value,
        })
        .then(pl => pl.data.result),
    { server: false, default: () => ({ columns: [], total_leads: 0 }) as PipelineResponse }
)

watch(state, () => refresh())

watch(error, (err) => {
  if (err) throw createError({ fatal: true, status: err.status, statusText: err.statusText })
}, { immediate: true })

const columns = computed(() => normalizePipelineColumns(pipeline.value?.columns ?? []));
const totalLeads = computed(() => pipeline.value?.total_leads ?? 0);
provide('workspaceId', workspaceId);
</script>
<template>
  <ui-container :padding="[30, 15]">
    <section class="pipeline-page__hero">
      <div class="pipeline-page__actions">
        <div class="pipeline-page__stat">
          <strong>{{ totalLeads }}</strong>
          <span>лидов в воронке</span>
        </div>
      </div>
    </section>

    <workspace-pipeline-filters
        v-model:search="form.$value.search"
        v-model:category_code="form.$value.category_code"
        v-model:responsible_id="form.$value.responsible_id"
        @search="apply"
        @reset="reset"
    />
    <div v-if="pending" class="pipeline-page__state">Загружаем воронку...</div>
    <client-only v-else>
      <workspace-pipeline-board
        :columns="columns"
        :workspace-id="workspaceId"
        @changed="refresh"
      />
    </client-only>
  </ui-container>
</template>

<style scoped>
.pipeline-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 4px;
}

.pipeline-page__actions {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.pipeline-page__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 12px 14px;
  border-radius: 16px;
  background: var(--color-neutral-ll);
}

.pipeline-page__stat strong {
  color: var(--color-neutral-dd);
  font-size: 20px;
  line-height: 1;
}

.pipeline-page__stat span,
.pipeline-page__state {
  color: var(--color-neutral-dl);
  font-size: 12px;
}

.pipeline-page__state {
  padding: 24px 0;
}

@media (max-width: 640px) {
  .pipeline-page__stat {
    align-items: flex-start;
  }
}
</style>
