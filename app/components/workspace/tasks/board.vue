<script setup lang="ts">
import {
  TaskBucket,
  type CompleteTaskRequest,
  type RescheduleTaskRequest,
  type TaskBoardColumn,
  type TaskBoardItem,
} from "~/api/generated/api";
import {
  buildActionPayload,
  buildMovePayloadForBucket,
  type TaskBoardActionId,
  type TaskCompletePayload,
  type TaskUpdatePayload,
} from "./model";

const emit = defineEmits<{
  changed: [];
}>();

const { columns, workspaceId } = defineProps<{
  columns: TaskBoardColumn[];
  workspaceId: string;
}>();

const { $apiClient } = useNuxtApp();
const notification = useNotification();

const activeTask = ref<TaskBoardItem | null>(null);
const selectedTask = ref<TaskBoardItem | null>(null);
const isPending = ref(false);

async function handleMove(bucket: TaskBucket) {
  if (!activeTask.value || isPending.value || activeTask.value.bucket === bucket) {
    clearDrag();
    return;
  }

  if (bucket === TaskBucket.Overdue) {
    notification.warning("Недоступно", "Нельзя перетащить задачу в overdue вручную");
    clearDrag();
    return;
  }

  const task = activeTask.value;
  const payload = buildMovePayloadForBucket(bucket);
  if (!payload) {
    clearDrag();
    return;
  }

  isPending.value = true;
  try {
    if (bucket === TaskBucket.Done) {
      await $apiClient.api.completeTaskApiV1LeadsTenantLeadIdTasksTaskIdCompletePost(
        task.tenant_lead_id,
        task.id,
        { tenant_id: workspaceId },
        payload as CompleteTaskRequest,
      );
    } else {
      await $apiClient.api.rescheduleTaskApiV1LeadsTenantLeadIdTasksTaskIdReschedulePost(
        task.tenant_lead_id,
        task.id,
        { tenant_id: workspaceId },
        payload as RescheduleTaskRequest,
      );
    }

    emit("changed");
  } catch {
    notification.error("Ошибка", "Не удалось переместить задачу");
  } finally {
    isPending.value = false;
    clearDrag();
  }
}

async function handleAction(actionId: TaskBoardActionId) {
  if (!activeTask.value || isPending.value) return;

  if (actionId === "delete") {
    notification.info("Скоро", "Удаление еще не поддержано бэкендом");
    clearDrag();
    return;
  }

  const task = activeTask.value;
  const payload = buildActionPayload(actionId);
  if (!payload) {
    clearDrag();
    return;
  }

  isPending.value = true;
  try {
    if (actionId === "done") {
      await $apiClient.api.completeTaskApiV1LeadsTenantLeadIdTasksTaskIdCompletePost(
        task.tenant_lead_id,
        task.id,
        { tenant_id: workspaceId },
        payload as CompleteTaskRequest,
      );
    } else {
      await $apiClient.api.rescheduleTaskApiV1LeadsTenantLeadIdTasksTaskIdReschedulePost(
        task.tenant_lead_id,
        task.id,
        { tenant_id: workspaceId },
        payload as RescheduleTaskRequest,
      );
    }

    emit("changed");
  } catch {
    notification.error("Ошибка", "Не удалось выполнить действие над задачей");
  } finally {
    isPending.value = false;
    clearDrag();
  }
}

async function handleSave(payload: TaskUpdatePayload) {
  if (!selectedTask.value || isPending.value) return;

  isPending.value = true;
  try {
    await $apiClient.api.updateTaskApiV1LeadsTenantLeadIdTasksTaskIdPatch(
      selectedTask.value.tenant_lead_id,
      selectedTask.value.id,
      { tenant_id: workspaceId },
      payload,
    );
    selectedTask.value = null;
    emit("changed");
  } catch {
    notification.error("Ошибка", "Не удалось обновить задачу");
  } finally {
    isPending.value = false;
  }
}

async function handleComplete(payload: TaskCompletePayload) {
  if (!selectedTask.value || isPending.value) return;

  isPending.value = true;
  try {
    await $apiClient.api.completeTaskApiV1LeadsTenantLeadIdTasksTaskIdCompletePost(
      selectedTask.value.tenant_lead_id,
      selectedTask.value.id,
      { tenant_id: workspaceId },
      payload,
    );
    selectedTask.value = null;
    emit("changed");
  } catch {
    notification.error("Ошибка", "Не удалось завершить задачу");
  } finally {
    isPending.value = false;
  }
}

function startDrag(task: TaskBoardItem) {
  activeTask.value = task;
}

function clearDrag() {
  activeTask.value = null;
}
</script>

<template>
  <section class="tasks-board">
    <div class="tasks-board__lane">
      <workspace-tasks-column
        v-for="column in columns"
        :key="column.bucket"
        :column="column"
        :active-task-id="activeTask?.id"
        @open="selectedTask = $event"
        @drag-start="startDrag"
        @drag-end="clearDrag"
        @move="handleMove"
      />
    </div>

    <workspace-tasks-action-bar
      :open="!!activeTask"
      :task-title="activeTask?.title"
      :pending="isPending"
      @action="handleAction"
    />

    <workspace-tasks-detail-modal
      :open="!!selectedTask"
      :task="selectedTask"
      :pending="isPending"
      @close="selectedTask = null"
      @save="handleSave"
      @complete="handleComplete"
    />
  </section>
</template>

<style scoped>
.tasks-board {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tasks-board__lane {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(280px, 1fr);
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 8px;
}
</style>
