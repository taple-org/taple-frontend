<script lang="ts" setup>
import type { StageColumn, TenantLeadStage, PipelineCardItem } from '~/api/generated/api';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue';
import { dropOrSwap, animations } from '@formkit/drag-and-drop';

const emit = defineEmits<{ move: [cardId: string, fromStage: TenantLeadStage, toStage: TenantLeadStage] }>()
const { column } = defineProps<{
    column: StageColumn
}>()
const isOver = ref(false)

const [columnRef, cards] = useDragAndDrop<PipelineCardItem>(column.cards, {
  group: 'pipeline',
  sortable: true,
  plugins: [dropOrSwap(), animations()],
  draggable: (el) => el.classList.contains('pipeline-card'),
  onTransfer(dragState) {
    isOver.value = false
    const movedCard = dragState.draggedNodes[0]?.data.value as PipelineCardItem;
    const toStage = dragState.targetParent.el.dataset.stage as unknown as TenantLeadStage;
    emit('move', movedCard.tenant_lead_id, column.stage_code, toStage);
  },
})
const handleDragLeave = (e: DragEvent) => {
  if (columnRef.value?.contains(e.relatedTarget as Node)) return
  isOver.value = false
}
watch(() => column.cards, (newCards) => {
  cards.value = [...newCards]
}, { deep: true })


</script>
<template>
    <article class="column">
        <header class="header">
            <div class="content">
                <h3 class="column__title">{{ column.stage_name_ru }}</h3>
                <span class="column__lead-count">{{ column.total_count }}</span>
            </div>
            <ui-separator :thickness="5" color="#00C3D0" class="separator" />
        </header>
        <div ref="columnRef"
             class="cards"
             :class="{ 'cards--over': isOver }"
             :data-stage="column.stage_code"
             @dragover.prevent="isOver = true"
             @dragleave="handleDragLeave"
             @drop="isOver = false"
        >
            <workspace-pipeline-card v-for="card in cards" :key="card.tenant_lead_id" :card />
        </div>
    </article>
</template>

<style lang="css" scoped>
.column {
    height: 100%;
}
.header {
    display: flex;
    margin-bottom: 5px;
    padding: 8px;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    border-radius: 16px;
    background: var(--color-neutral-ll, #F8F9FE);

}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
}

.column__title {
    color: var(--color-neutral-dd, #1F2024);
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.column__lead-count {
    color: var(--color-neutral-dl, #71727A);
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.12px;
}

.separator {
    border-radius: 12px;
}

.cards {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
}

.cards--over {
  border: 3px solid var(--color-primary);
  border-radius: 14px;

}
</style>
<style lang="css">
.sortable-ghost {
  opacity: 0.4;
  border: 2px dashed #00C3D0;
  border-radius: 16px;
}
.sortable-drag {
  opacity: 0.9;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: rotate(2deg);
}
</style>