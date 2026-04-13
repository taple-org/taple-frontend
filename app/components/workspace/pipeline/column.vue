<script lang="ts" setup>
import type { StageColumn, TenantLeadStage, PipelineCardItem } from '~/api/generated/api'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { dropOrSwap, animations } from '@formkit/drag-and-drop'
import {usePipelineDrag} from "~/composables/workspace/usePipelineDrag";

const emit = defineEmits<{
  move: [cardId: string, fromStage: TenantLeadStage, toStage: TenantLeadStage]
}>()
const { column } = defineProps<{ column: StageColumn }>()

const { activeDrag, startDrag, clearDrag } = usePipelineDrag()
const isOver = ref(false)

const [columnRef, cards] = useDragAndDrop<PipelineCardItem>(column.cards, {
  group: 'pipeline',
  sortable: true,
  plugins: [dropOrSwap(), animations()],
  draggable: (el) => el.classList.contains('pipeline-card'),

  onDragstart(dragState) {
    const card = dragState.draggedNodes[0]?.data.value as PipelineCardItem
    if (card) startDrag(card.tenant_lead_id, column.stage_code)
  },

  onTransfer() {
    isOver.value = false
  },
})

const knownIds = ref(new Set(column.cards.map(c => c.tenant_lead_id)))

watch(cards, (newCards) => {
  if (!activeDrag.value) return

  const { cardId, fromStage } = activeDrag.value

  const arrived = newCards.find(c => c.tenant_lead_id === cardId)
  if (arrived && !knownIds.value.has(cardId) && fromStage !== column.stage_code) {
    emit('move', cardId, fromStage, column.stage_code)
    clearDrag()
  }

  knownIds.value = new Set(newCards.map(c => c.tenant_lead_id))
})

watch(() => column.cards, (newCards) => {
  cards.value = [...newCards]
  knownIds.value = new Set(newCards.map(c => c.tenant_lead_id))
}, { deep: true })

const handleDragLeave = (e: DragEvent) => {
  if (!(e.target as HTMLElement).isSameNode(columnRef.value!)) return
  isOver.value = false
}
onMounted(() => document.addEventListener('dragend', () => { isOver.value = false }))
onUnmounted(() => document.removeEventListener('dragend', () => { isOver.value = false }))

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
    <div
        ref="columnRef"
        class="cards"
        :class="{ 'cards--over': isOver }"
        :data-stage="column.stage_code"
        @dragenter="isOver = true"
        @dragleave="handleDragLeave"
        @dragover.prevent
        @drop="isOver = false"
    >
      <workspace-pipeline-card
          v-for="card in cards"
          :key="card.tenant_lead_id"
          :card
      />
    </div>
  </article>
</template>

<style lang="css" scoped>
.column { height: 100%; }

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
  font-weight: 700;
}

.column__lead-count {
  color: var(--color-neutral-dl, #71727A);
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.12px;
}

.separator { border-radius: 12px; }

.cards {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 14px;
  border: 2px solid transparent;
  padding: 4px;
  transition:
      border-color 0.25s ease,
      background 0.25s ease,
      box-shadow 0.25s ease;
}


.cards--over {
  border-color: var(--color-primary, #00C3D0);
  background: color-mix(in srgb, var(--color-primary, #00C3D0) 8%, transparent);
}
</style>

<style lang="css">
.sortable-ghost {
  opacity: 0.35;
  border: 2px dashed #00C3D0 !important;
  border-radius: 16px;
  background: color-mix(in srgb, #00C3D0 8%, transparent) !important;
}
.sortable-drag {
  opacity: 0.95;
  box-shadow: 0 12px 32px rgba(0, 195, 208, 0.3), 0 4px 12px rgba(0,0,0,0.15);
  transform: rotate(1.5deg) scale(1.02);
}
</style>