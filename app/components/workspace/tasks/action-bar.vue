<script setup lang="ts">
import type { TaskBoardItem } from "~/api/generated/api";
import { TASK_ACTION_SECTIONS, type TaskBoardActionId } from "./model";

const emit = defineEmits<{
  action: [actionId: TaskBoardActionId];
}>();

const { open, taskTitle, pending } = defineProps<{
  open: boolean;
  taskTitle?: string;
  pending?: boolean;
}>();

const activeActionId = ref<TaskBoardActionId | null>(null);

function handleDragEnter(actionId: TaskBoardActionId, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  activeActionId.value = actionId;
}

function handleDragOver(actionId: TaskBoardActionId, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
  activeActionId.value = actionId;
}

function handleDragLeave(actionId: TaskBoardActionId, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();

  const relatedTarget = event.relatedTarget as Node | null;
  const currentTarget = event.currentTarget as Node | null;
  if (relatedTarget && currentTarget?.contains(relatedTarget)) return;

  if (activeActionId.value === actionId) {
    activeActionId.value = null;
  }
}

function handleDrop(actionId: TaskBoardActionId, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  activeActionId.value = null;
  emit("action", actionId);
}
</script>

<template>
  <Transition name="task-bar">
    <aside v-if="open" class="task-bar">
      <div class="task-bar__sections">
        <section
          v-for="section in TASK_ACTION_SECTIONS"
          :key="section.id"
          class="task-bar__section"
        >
          <header class="task-bar__section-header">
            <strong>{{ section.title }}</strong>
            <span>{{ section.description }}</span>
          </header>

          <div class="task-bar__actions">
            <div
              v-for="action in section.actions"
              :key="action.id"
              class="task-bar__action"
              :class="[
                `task-bar__action--${action.tone}`,
                { 'task-bar__action--active': activeActionId === action.id, 'task-bar__action--pending': pending },
              ]"
              @dragenter="handleDragEnter(action.id, $event)"
              @dragover="handleDragOver(action.id, $event)"
              @dragleave="handleDragLeave(action.id, $event)"
              @drop="handleDrop(action.id, $event)"
            >
              {{ action.label }}
            </div>
          </div>
        </section>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.task-bar {
  position: sticky;
  bottom: 16px;
  z-index: 20;
  display: grid;
  gap: 14px;
  margin-top: 18px;
  padding: 16px;
  border-radius: 24px;
  background: rgba(31, 32, 36, 0.92);
  color: var(--color-white);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
}

.task-bar__sections {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.task-bar__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-bar__section-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.task-bar__section-header strong {
  font-size: 13px;
}

.task-bar__section-header span {
  font-size: 11px;
  opacity: 0.7;
}

.task-bar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.task-bar__action {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-weight: 700;
  transition: transform 150ms ease, background-color 150ms ease, border-color 150ms ease;
}

.task-bar__action--active {
  transform: translateY(-1px);
}

.task-bar__action--success.task-bar__action--active {
  background: rgba(58, 192, 160, 0.24);
  border-color: rgba(58, 192, 160, 0.7);
}

.task-bar__action--danger.task-bar__action--active {
  background: rgba(255, 97, 109, 0.24);
  border-color: rgba(255, 97, 109, 0.72);
}

.task-bar__action--warning.task-bar__action--active,
.task-bar__action--default.task-bar__action--active {
  background: rgba(0, 111, 253, 0.24);
  border-color: rgba(0, 111, 253, 0.72);
}

.task-bar__action--pending {
  opacity: 0.6;
}

.task-bar-enter-active,
.task-bar-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.task-bar-enter-from,
.task-bar-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 900px) {
  .task-bar__sections {
    grid-template-columns: 1fr;
  }
}
</style>
