<script lang="ts" setup>
import type { StageColumn, TenantLeadStage } from '~/api/generated/api';
const { columns } = defineProps<{
  columns: StageColumn[];
}>()
const { $apiClient } = useNuxtApp()
const workspaceId = inject('workspaceId') as string

const handleMove = (cardId: string, from: TenantLeadStage, to: TenantLeadStage) => {
  $apiClient.api.moveLeadApiV1LeadsTenantLeadIdMovePost(cardId, { tenant_id: workspaceId }, { to_stage: to })
}

</script>
<template>
  <section class="board">
    <workspace-pipeline-column v-for="column in columns" :key="column.stage_code" :column @move="handleMove"/>
  </section>
</template>
<style lang="css" scoped>
.board{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px
}
</style>