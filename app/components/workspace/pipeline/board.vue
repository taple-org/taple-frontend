<script lang="ts" setup>
import type { PipelineCardItem, StageColumn, TenantLeadStage } from "~/api/generated/api";
import type { PipelineBoardActionId } from "./model";
import { useI18n } from "vue-i18n";

const emit = defineEmits<{
  changed: [];
}>();

const { columns, workspaceId } = defineProps<{
  columns: StageColumn[];
  workspaceId: string;
}>();

const { $apiClient } = useNuxtApp();
const notification = useNotification();
const { t } = useI18n();

const activeCard = ref<PipelineCardItem | null>(null);
const isPending = ref(false);

async function handleMove(toStage: TenantLeadStage) {
  if (!activeCard.value || isPending.value || activeCard.value.stage_code === toStage) {
    clearDrag();
    return;
  }

  isPending.value = true;
  try {
    await $apiClient.api.moveLeadApiV1LeadsTenantLeadIdMovePost(
      activeCard.value.tenant_lead_id,
      { tenant_id: workspaceId },
      { to_stage: toStage },
    );
    emit("changed");
  } catch {
    notification.error(t("common.error"), t("leads.moveLeadError"));
  } finally {
    isPending.value = false;
    clearDrag();
  }
}

function startDrag(card: PipelineCardItem) {
  activeCard.value = card;
}

function clearDrag() {
  activeCard.value = null;
}

function handleAction(actionId: PipelineBoardActionId) {
  return handleMove(actionId);
}
</script>
<template>
  <div>
    <section class="board">
      <workspace-pipeline-column
        v-for="column in columns"
        :key="column.stage_code"
        :column="column"
        :active-lead-id="activeCard?.tenant_lead_id"
        @drag-start="startDrag"
        @drag-end="clearDrag"
        @move="handleMove"
      />
    </section>

    <workspace-pipeline-action-bar
      :open="!!activeCard"
      :pending="isPending"
      @action="handleAction"
    />
  </div>
</template>
<style lang="css" scoped>
.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
</style>
