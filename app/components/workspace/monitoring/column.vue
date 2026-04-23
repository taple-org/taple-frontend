<script setup lang="ts">
import type { MerchantListItem, TenantMerchantMonitoringStatus } from "~/api/generated/api";
import type { MonitoringColumn } from "./model";

const emit = defineEmits<{
  dragStart: [card: MerchantListItem];
  dragEnd: [];
  move: [status: TenantMerchantMonitoringStatus];
}>();

const { column, activeLeadId } = defineProps<{
  column: MonitoringColumn;
  activeLeadId?: string | null;
}>();

const isOver = ref(false);

function handleDrop() {
  if (!activeLeadId) return;
  emit("move", column.status);
  isOver.value = false;
}
</script>

<template>
  <article class="column">
    <header class="header">
      <div class="content">
        <h3 class="column__title">{{ column.label }}</h3>
        <span class="column__count">{{ column.count }} компаний</span>
      </div>
    </header>

    <div
      class="cards"
      :class="{ 'cards--over': isOver && !!activeLeadId }"
      @dragover.prevent="isOver = !!activeLeadId"
      @dragleave="isOver = false"
      @drop.prevent="handleDrop"
    >
      <workspace-monitoring-card
        v-for="card in column.cards"
        :key="card.id"
        :card="card"
        :dragging="card.tenant_lead_id === activeLeadId"
        @drag-start="emit('dragStart', $event)"
        @drag-end="emit('dragEnd')"
      />

      <div v-if="!column.cards.length" class="cards__empty">
        Здесь пока пусто
      </div>
    </div>
  </article>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  min-height: 520px;
}

.header {
  margin-bottom: 8px;
  padding: 12px 14px;
  border-radius: 18px;
  background: var(--color-neutral-ll);
  box-shadow: inset 0 0 0 1px rgba(31, 32, 36, 0.04);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.column__title {
  margin: 0;
  color: var(--color-neutral-dd);
  font-size: 15px;
  font-weight: 700;
}

.column__count {
  color: var(--color-neutral-dl);
  font-size: 11px;
}

.cards {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid transparent;
  background: rgba(248, 249, 254, 0.48);
  transition: border-color 180ms ease, background-color 180ms ease;
}

.cards--over {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, white);
}

.cards__empty {
  display: grid;
  place-items: center;
  min-height: 120px;
  color: var(--color-neutral-dl);
  font-size: 12px;
  border: 1px dashed var(--color-neutral-lm);
  border-radius: 16px;
}
</style>
