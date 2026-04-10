<script lang="ts" setup>
import {useWorkspacePipelineFilter} from "~/composables/workspace/useWorkspacePipelineFilter";

definePageMeta({ title: "Pipeline", layout: 'dashboard' })

const route = useRoute();
const workspaceId = route.params.workspaceId as string;
const { form, state, apply, reset } = useWorkspacePipelineFilter()

const search        = computed(() => state.search        || undefined)
const category_code = computed(() => state.category_code || undefined)
const responsible_id = computed(() => state.responsible_id || undefined)

const { data: pipeline, error, refresh } = useAsyncData(
    `pipeline-${workspaceId}`,
    (nuxtApp) => nuxtApp.$apiClient.api
        .getPipelineApiV1LeadsPipelineGet({
          tenant_id: workspaceId,
          search: search.value,
          category_code: category_code.value,
          responsible_member_id: responsible_id.value,
        })
        .then(pl => pl.data.result.columns),
    { server: false }
)

watch(state, () => refresh())

watch(error, (err) => {
  if (err) throw createError({ fatal: true, status: err.status, statusText: err.statusText })
}, { immediate: true })

const columns = computed(() => pipeline.value ?? []);
provide('workspaceId', workspaceId);
</script>
<template>
  <ui-container>
    <workspace-pipeline-filters
        v-model:search="form.$value.search"
        v-model:category_code="form.$value.category_code"
        v-model:responsible_id="form.$value.responsible_id"
        @search="apply"
        @reset="reset"
    />
    <workspace-pipeline-board :columns />
  </ui-container>
</template>