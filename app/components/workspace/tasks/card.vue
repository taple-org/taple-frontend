<script setup lang="ts">
import type { TaskBoardItem } from "~/api/generated/api";
import { formatTaskDueAt, getTaskTone, getTaskTypeLabel } from "./model";

const emit = defineEmits<{
  open: [task: TaskBoardItem];
  dragStart: [task: TaskBoardItem];
  dragEnd: [];
}>();

const { task, dragging } = defineProps<{
  task: TaskBoardItem;
  dragging?: boolean;
}>();

const tone = computed(() => getTaskTone(task));
const assignee = computed(
  () => task.assigned_to_full_name || task.assigned_to_email || "Не назначено",
);

function handleDragStart(event: DragEvent) {
  event.dataTransfer?.setData("text/plain", task.id);
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
  emit("dragStart", task);
}
</script>

<template>
  <article
    class="task-card"
    :class="[`task-card--${tone}`, { 'task-card--dragging': dragging }]"
    draggable="true"
    @click="emit('open', task)"
    @dragstart="handleDragStart"
    @dragend="emit('dragEnd')"
  >
    <div class="task-card__top">
      <div class="task-card__meta">
        <span class="task-card__lead">{{ task.lead_name }}</span>
        <span class="task-card__due">{{ formatTaskDueAt(task.due_at) }}</span>
      </div>
      <ui-badge class="task-card__type" size="sm">
        {{ getTaskTypeLabel(task.task_type) }}
      </ui-badge>
    </div>

    <div class="task-card__body">
      <h4 class="task-card__title">{{ task.title }}</h4>
      <p v-if="task.description" class="task-card__description">
        {{ task.description }}
      </p>
    </div>

    <div class="task-card__footer">
      <span class="task-card__assignee">{{ assignee }}</span>
      <span v-if="task.is_system_task" class="task-card__system">system</span>
    </div>
  </article>
</template>

<style scoped>
.task-card {
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
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.task-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(31, 32, 36, 0.08);
}

.task-card:active {
  cursor: grabbing;
}

.task-card--dragging {
  opacity: 0.45;
}

.task-card--danger {
  border-color: color-mix(in srgb, var(--color-error) 30%, transparent);
}

.task-card--warning {
  border-color: color-mix(in srgb, var(--color-warning) 30%, transparent);
}

.task-card--success {
  border-color: color-mix(in srgb, var(--color-success) 30%, transparent);
}

.task-card__top,
.task-card__footer,
.task-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.task-card__meta {
  flex-direction: column;
  align-items: flex-start;
}

.task-card__lead {
  color: var(--color-neutral-dd);
  font-size: 11px;
  font-weight: 700;
}

.task-card__due {
  color: var(--color-neutral-dl);
  font-size: 10px;
  font-weight: 400;
}

.task-card__type {
  flex-shrink: 0;
  font-weight: 500;
}

.task-card__title {
  margin: 0;
  color: var(--color-neutral-dd);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
}

.task-card__description {
  margin: 0;
  color: var(--color-neutral-dm);
  font-size: 12px;
  line-height: 1.5;
}

.task-card__assignee,
.task-card__system {
  color: var(--color-neutral-dl);
  font-size: 11px;
}

.task-card__system {
  text-transform: uppercase;
}
</style>
