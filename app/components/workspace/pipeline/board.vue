<script lang="ts" setup>
import type { StageColumn, TenantLeadStage } from '~/api/generated/api';
const { columns } = defineProps<{
  columns: StageColumn[];
}>()
const { $apiClient } = useNuxtApp()
const handleMove = (cardId: string, fromStage: TenantLeadStage, toStage: TenantLeadStage) => {
  $apiClient.api.moveLeadApiV1LeadsTenantLeadIdMovePost(cardId, { tenant_id: cardId }, { to_stage: toStage })
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