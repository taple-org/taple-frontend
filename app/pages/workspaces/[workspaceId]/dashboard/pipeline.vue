<script lang="ts" setup>
definePageMeta({
  title: "Pipeline",
  layout: 'dashboard'
})

const route = useRoute();
const workspaceId = route.params.workspaceId as string;
const { $apiClient } = useNuxtApp();
const { data: pipeline, error } = useAsyncData(
  `pipeline-${workspaceId}`, 
  () =>  $apiClient.api.getPipelineApiV1LeadsPipelineGet({ tenant_id: workspaceId }),
  { server: false }
)


watch(error, (err) => {
  if (err) {
    throw createError({
      fatal: true,
      status: err.status,
      statusText: err.statusText
    })
  }
}, { immediate: true })
const columns = computed(() => pipeline.value?.data.result.columns ?? []);

</script>
<template>
  <ui-container>
    <workspace-pipeline-filters />
    <workspace-pipeline-board :columns />
  </ui-container>
</template>