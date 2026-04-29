<script setup lang="ts">
import type { MerchantListItem } from "~/api/generated/api";
import { useI18n } from "vue-i18n";
import { formatMonitoringDate, getResponsibleLabel } from "./model";

const emit = defineEmits<{
  dragStart: [card: MerchantListItem];
  dragEnd: [];
}>();

const { card, dragging } = defineProps<{
  card: MerchantListItem;
  dragging?: boolean;
}>();
const { t, locale } = useI18n();

const dueAt = computed(() => formatMonitoringDate(card.monitoring_due_at, locale.value, t));
const responsible = computed(() => getResponsibleLabel(card.responsible_member, t));

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
    class="card"
    :class="{ 'card--dragging': dragging }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="emit('dragEnd')"
  >
    <div class="card__head">
      <h4 class="card__title">{{ card.lead_name }}</h4>
      <span class="card__date">{{ dueAt }}</span>
    </div>

    <p v-if="card.monitoring_comment" class="card__comment">
      {{ card.monitoring_comment }}
    </p>

    <div class="card__tags">
      <ui-badge size="sm">{{ t("monitoring.dueAt", { date: dueAt }) }}</ui-badge>
      <ui-badge size="sm">{{ responsible }}</ui-badge>
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
  background: var(--color-neutral-ll);
  cursor: grab;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease,
    border-color 160ms ease;
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

.card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.card__title {
  margin: 0;
  color: var(--color-neutral-dd);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.card__date,
.card__comment {
  color: var(--color-neutral-dl);
  font-size: 11px;
  line-height: 1.45;
}

.card__comment {
  margin: 0;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
