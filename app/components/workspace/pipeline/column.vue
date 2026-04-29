<script lang="ts" setup>
import type { PipelineCardItem, StageColumn, TenantLeadStage } from "~/api/generated/api";
import { useI18n } from "vue-i18n";
import { getPipelineStageLabel } from "./model";

const emit = defineEmits<{
  dragStart: [card: PipelineCardItem];
  dragEnd: [];
  move: [stage: TenantLeadStage];
}>();

const { column, activeLeadId } = defineProps<{
  column: StageColumn;
  activeLeadId?: string | null;
}>();
const { t } = useI18n();
const columnTitle = computed(() => getPipelineStageLabel(column.stage_code, t));

const isOver = ref(false);

function handleDrop() {
  if (!activeLeadId) return;
  emit("move", column.stage_code);
  isOver.value = false;
}

function handleCardDragStart(card: PipelineCardItem) {
  emit("dragStart", card);
}
</script>

<template>
  <article class="column">
    <header class="header">
      <div class="content">
        <h3 class="column__title">{{ columnTitle }}</h3>
        <span class="column__lead-count">{{ column.total_count }}</span>
      </div>
    </header>
    <div
      class="cards"
      :class="{ 'cards--over': isOver && !!activeLeadId }"
      @dragover.prevent="isOver = !!activeLeadId"
      @dragleave="isOver = false"
      @drop.prevent="handleDrop"
    >
      <workspace-pipeline-card
        v-for="card in column.cards"
        :key="card.tenant_lead_id"
        :card="card"
        :dragging="card.tenant_lead_id === activeLeadId"
        @drag-start="handleCardDragStart"
        @drag-end="emit('dragEnd')"
      />

      <div v-if="!column.cards.length" class="cards__empty">
        {{ t("common.emptyHere") }}
      </div>
    </div>
  </article>
</template>

<style lang="css" scoped>
.column {
  display: flex;
  flex-direction: column;
  min-height: 520px;
}

.header {
  display: flex;
  margin-bottom: 8px;
  padding: 12px 14px;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  border-radius: 18px;
  background: var(--color-neutral-ll, #F8F9FE);
  box-shadow: inset 0 0 0 1px rgba(31, 32, 36, 0.04);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}

.column__title {
  color: var(--color-neutral-dd, #1F2024);
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px;
}

.column__lead-count {
  color: var(--color-neutral-dl, #71727A);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.12px;
}

.cards {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  border-radius: 18px;
  border: 1px solid transparent;
  padding: 6px;
  background: rgba(248, 249, 254, 0.48);
  transition:
    border-color 180ms ease,
    background-color 180ms ease;
}

.cards--over {
  border-color: var(--color-primary, #00C3D0);
  background: color-mix(in srgb, var(--color-primary, #00C3D0) 8%, white);
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
