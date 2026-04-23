<script setup lang="ts">
import type { MerchantListItem, TenantMerchantMonitoringStatus } from "~/api/generated/api";
import type { MonitoringColumn } from "./model";

const emit = defineEmits<{
  changed: [];
}>();

const { columns, workspaceId } = defineProps<{
  columns: MonitoringColumn[];
  workspaceId: string;
}>();

const { $apiClient } = useNuxtApp();
const notification = useNotification();

const activeCard = ref<MerchantListItem | null>(null);
const isPending = ref(false);

async function handleMove(status: TenantMerchantMonitoringStatus) {
  if (!activeCard.value || isPending.value || activeCard.value.monitoring_status === status) {
    clearDrag();
    return;
  }

  isPending.value = true;
  try {
    await $apiClient.api.updateMerchantApiV1LeadsTenantLeadIdMerchantPatch(
      activeCard.value.tenant_lead_id,
      { tenant_id: workspaceId },
      { monitoring_status: status },
    );
    emit("changed");
  } catch {
    notification.error("Ошибка", "Не удалось обновить статус мониторинга");
  } finally {
    isPending.value = false;
    clearDrag();
  }
}

function startDrag(card: MerchantListItem) {
  activeCard.value = card;
}

function clearDrag() {
  activeCard.value = null;
}
</script>

<template>
  <section class="board">
    <workspace-monitoring-column
      v-for="column in columns"
      :key="column.status"
      :column="column"
      :active-lead-id="activeCard?.tenant_lead_id"
      @drag-start="startDrag"
      @drag-end="clearDrag"
      @move="handleMove"
    />
  </section>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
</style>
