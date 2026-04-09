<script lang="ts" setup>
import type { PipelineCardItem } from '~/api/generated/api';

const { card } = defineProps<{
    card: PipelineCardItem
}>()
const data = computed(() => new Date(card.created_at).toLocaleDateString('ru-RU'))
const tags = ['Торговый экваринг', 'Какой-то тег']
</script>
<template>
    <article class="card pipeline-card">
        <div class="card__left">
            <h4 class="title">{{ card.lead_name }}</h4>
            <span class="category">{{ card.business_category_name_ru }}</span>
            <ul class="tags">
                <li v-for="tag in tags" :key="tag">
                    <ui-badge class="tag" size="sm">{{ tag }}</ui-badge>
                </li>
            </ul>
        </div>
        <div class="card__right">
            <div class="data">{{ data }}</div>
            <div v-if="card.task_badge">{{ card.task_badge }}</div>
            <div v-else class="task-badge task-badge__warning">нет задач</div>

        </div>
    </article>
</template>

<style scoped>
.card {
    display: flex;
    padding: 8px;
    align-items: stretch;
    gap: 5px;
    border-radius: 16px;
    background: var(--color-neutral-ll, #F8F9FE);
}

.title {
    color: var(---color-neutral-dd, #1F2024);
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-bottom: 4px;
}

.category {
    color: var(---color-neutral-dl, #71727A);
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.1px;
    padding-bottom: 4px;
}

.data {
    color: var(---color-neutral-dl, #71727A);
    text-align: right;
    font-size: 8px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding-bottom: auto;
}

.task-badge {
    text-align: right;
    font-size: 8px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.task-badge__warning {
    color: var(--Support-Warning-Medium, #FFB37C);
}

.card__right,
.card__left {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
}

.tags {
    display: flex;
    gap: 5px;
}

.tag {
    font-weight: 400;
}
</style>