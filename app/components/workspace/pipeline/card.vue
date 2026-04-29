<script lang="ts" setup>
import type { PipelineCardItem } from '~/api/generated/api';
import { useI18n } from "vue-i18n";
import {
  formatPipelineDate,
  getPipelineCardTone,
  getResponsibleLabel,
  getTaskBadgeItems,
} from "./model";
import {getLocalizedField, type LocalizedRecord} from "~/utils/localized";

const emit = defineEmits<{
  dragStart: [card: PipelineCardItem];
  dragEnd: [];
}>();

const { card, dragging } = defineProps<{
  card: PipelineCardItem;
  dragging?: boolean;
}>();
const { t, locale } = useI18n();

const createdAt = computed(() => formatPipelineDate(card.created_at, locale.value));
const responsible = computed(() => getResponsibleLabel(card.responsible_member, t));
const taskBadges = computed(() => getTaskBadgeItems(card.task_badge, t));
const tone = computed(() => getPipelineCardTone(card));
const categoryLabel = computed(() =>
  getLocalizedField(card as unknown as LocalizedRecord, "business_category_name", locale.value),
);

function handleDragStart(event: DragEvent) {
  event.dataTransfer?.setData("text/plain", card.tenant_lead_id);
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
  emit("dragStart", card);
}

</script>
<template>
  <article
    class="card pipeline-card"
    :class="[`card--${tone}`, { 'card--dragging': dragging }]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="emit('dragEnd')"
  >
    <div class="card__head">
      <div class="card__title-wrap">
        <h4 class="title">{{ card.lead_name }}</h4>
        <span class="category">{{ categoryLabel }}</span>
      </div>
      <span v-if="createdAt" class="date">{{ createdAt }}</span>
    </div>

    <p v-if="card.address_short" class="address">{{ card.address_short }}</p>

    <div class="tags">
      <ui-badge size="sm">{{ categoryLabel }}</ui-badge>
      <ui-badge v-if="card.branch_count" size="sm">
        {{ t("pipeline.branchCount", { count: card.branch_count }) }}
      </ui-badge>
    </div>

    <div class="task-tags">
      <workspace-pipeline-card-task-badge
        v-for="badge in taskBadges"
        :key="badge.label"
        :variant="badge.tone"
      >
        {{ badge.label }}
      </workspace-pipeline-card-task-badge>
    </div>

    <div class="card__footer">
      <span class="responsible">{{ responsible }}</span>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid transparent;
  background: var(--color-neutral-ll, #F8F9FE);
  cursor: grab;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(31, 32, 36, 0.08);
}

.card:active {
  cursor: grabbing;
}

.card--dragging {
  opacity: 0.45;
}

.card--danger {
  border-color: color-mix(in srgb, var(--color-error) 28%, transparent);
}

.card--warning {
  border-color: color-mix(in srgb, var(--color-warning) 28%, transparent);
}

.card--success {
  border-color: color-mix(in srgb, var(--color-success) 28%, transparent);
}

.card__head,
.card__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.card__title-wrap {
  min-width: 0;
}

.title {
  color: var(--color-neutral-dd, #1F2024);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
  margin: 0 0 4px;
}

.category {
  color: var(--color-neutral-dl, #71727A);
  font-size: 11px;
  line-height: 1.4;
}

.date,
.address,
.responsible {
  color: var(--color-neutral-dl, #71727A);
  font-size: 11px;
  line-height: 1.4;
}

.date {
  white-space: nowrap;
}

.address {
  margin: 0;
}

.tags,
.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.responsible {
  font-weight: 600;
}
</style>
