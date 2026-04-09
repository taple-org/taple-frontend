<script lang="ts" setup>
import type { StageColumn, TenantLeadStage, PipelineCardItem } from '~/api/generated/api';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue';

const emit = defineEmits<{ move: [cardId: string, fromStage: TenantLeadStage, toStage: TenantLeadStage] }>()
const { column } = defineProps<{
    column: StageColumn
}>()


const [columnRef, cards] = useDragAndDrop<PipelineCardItem>(column.cards, {
    group: 'pipeline',
    sortable: true,
    draggable: (el) => el.classList.contains('pipeline-card'),
    onTransfer(dragState) {
        const movedCard = dragState.draggedNodes[0]?.data as unknown as PipelineCardItem;
        const toStage = dragState.targetParent.el.dataset.stage as unknown as TenantLeadStage;

        emit('move', movedCard.tenant_lead_id, column.stage_code, toStage);
    },
})



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
        <div ref="columnRef" class="cards" :data-stage="column.stage_code">
            <workspace-pipeline-card v-for="card in cards" :key="card.tenant_lead_id" :card />
        </div>
    </article>
</template>

<style lang="css" scoped>
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
}
</style>