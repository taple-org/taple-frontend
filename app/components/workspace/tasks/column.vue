<script setup lang="ts">
import { TaskBucket, type TaskBoardColumn, type TaskBoardItem } from "~/api/generated/api";

const emit = defineEmits<{
  open: [task: TaskBoardItem];
  dragStart: [task: TaskBoardItem, event: DragEvent];
  dragEnd: [];
  move: [bucket: TaskBucket];
}>();

const { column, activeTaskId } = defineProps<{
  column: TaskBoardColumn;
  activeTaskId?: string | null;
}>();

const isOver = ref(false);
const isDropEnabled = computed(() => column.bucket !== TaskBucket.Overdue);

function handleDrop() {
  if (!isDropEnabled.value || !activeTaskId) return;
  emit("move", column.bucket);
  isOver.value = false;
}
</script>

<template>
  <section class="task-column">
    <header class="task-column__header">
      <div>
        <h3 class="task-column__title">{{ column.label_ru }}</h3>
        <p class="task-column__count">{{ column.count }} задач</p>
      </div>
    </header>

    <div
      class="task-column__body"
      :class="{ 'task-column__body--over': isOver && isDropEnabled }"
      @dragover.prevent="isOver = !!activeTaskId"
      @dragleave="isOver = false"
      @drop.prevent="handleDrop"
    >
      <workspace-tasks-card
        v-for="task in column.tasks"
        :key="task.id"
        :task="task"
        :dragging="task.id === activeTaskId"
        @open="emit('open', $event)"
        @drag-start="emit('dragStart', task, $event)"
        @drag-end="emit('dragEnd')"
      />

      <div v-if="!column.tasks.length" class="task-column__empty">
        Здесь пока пусто
      </div>
    </div>
  </section>
</template>

<style scoped>
.task-column {
  display: flex;
  flex-direction: column;
  min-width: 280px;
  min-height: 520px;
}

.task-column__header {
  padding: 12px 14px;
  border-radius: 18px;
  background: var(--color-neutral-ll);
  box-shadow: inset 0 0 0 1px rgba(31, 32, 36, 0.04);
}

.task-column__title {
  margin: 0 0 4px;
  color: var(--color-neutral-dd);
  font-size: 15px;
  font-weight: 700;
}

.task-column__count {
  margin: 0;
  color: var(--color-neutral-dl);
  font-size: 11px;
}

.task-column__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding: 6px;
  border-radius: 18px;
  background: rgba(248, 249, 254, 0.48);
  border: 1px solid transparent;
  transition: border-color 180ms ease, background-color 180ms ease;
}

.task-column__body--over {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, white);
}

.task-column__empty {
  display: grid;
  place-items: center;
  min-height: 120px;
  color: var(--color-neutral-dl);
  font-size: 12px;
  border: 1px dashed var(--color-neutral-lm);
  border-radius: 16px;
}
</style>
