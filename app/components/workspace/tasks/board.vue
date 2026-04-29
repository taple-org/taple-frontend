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
  getTaskBoardGroups,
  type TaskBoardActionId,
  type TaskCompletePayload,
  type TaskUpdatePayload,
} from "./model";
import { useI18n } from "vue-i18n";

const emit = defineEmits<{
  changed: [];
}>();

const { columns, workspaceId } = defineProps<{
  columns: TaskBoardColumn[];
  workspaceId: string;
}>();

const { $apiClient } = useNuxtApp();
const notification = useNotification();
const { t } = useI18n();

const activeTask = ref<TaskBoardItem | null>(null);
const selectedTask = ref<TaskBoardItem | null>(null);
const isPending = ref(false);

async function handleMove(bucket: TaskBucket) {
  if (!activeTask.value || isPending.value || activeTask.value.bucket === bucket) {
    clearDrag();
    return;
  }

  if (bucket === TaskBucket.Overdue) {
    notification.warning(t("common.unavailable"), t("tasks.overdueManualMoveError"));
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
    notification.error(t("common.error"), t("tasks.moveError"));
  } finally {
    isPending.value = false;
    clearDrag();
  }
}

async function handleAction(actionId: TaskBoardActionId) {
  if (!activeTask.value || isPending.value) return;

  const task = activeTask.value;
  const payload = buildActionPayload(actionId);
  if (actionId !== "delete" && !payload) {
    clearDrag();
    return;
  }

  isPending.value = true;
  try {
    if (actionId === "delete") {
      await $apiClient.api.deleteTaskApiV1LeadsTenantLeadIdTasksTaskIdDelete(
        task.tenant_lead_id,
        task.id,
        { tenant_id: workspaceId },
      );
    } else if (actionId === "done") {
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
    notification.error(
      t("common.error"),
      actionId === "delete" ? t("tasks.deleteError") : t("tasks.actionError"),
    );
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
    notification.error(t("common.error"), t("tasks.updateError"));
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
    notification.error(t("common.error"), t("tasks.completeError"));
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

const columnGroups = computed(() =>
  getTaskBoardGroups(t).map((group) => ({
    ...group,
    columns: columns.filter((column) => group.buckets.includes(column.bucket)),
  })).filter((group) => group.columns.length),
);
</script>

<template>
  <section class="tasks-board">
    <div class="tasks-board__groups">
      <section
        v-for="group in columnGroups"
        :key="group.id"
        class="tasks-board__group"
        :data-group="group.id"
      >
        <header class="tasks-board__group-header">
          <div>
            <h3 class="tasks-board__group-title">{{ group.title }}</h3>
            <p class="tasks-board__group-description">{{ group.description }}</p>
          </div>
          <span class="tasks-board__group-count">
            {{ group.columns.reduce((sum, column) => sum + column.count, 0) }}
          </span>
        </header>

        <div class="tasks-board__lane">
          <workspace-tasks-column
            v-for="column in group.columns"
            :key="column.bucket"
            :column="column"
            :active-task-id="activeTask?.id"
            @open="selectedTask = $event"
            @drag-start="startDrag"
            @drag-end="clearDrag"
            @move="handleMove"
          />
        </div>
      </section>
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
      :workspace-id="workspaceId"
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
  gap: 18px;
}

.tasks-board__groups {
  display: grid;
  grid-auto-flow: column;
  grid-auto-rows: minmax(420px, max-content);
  gap: 16px;
  overflow-x: auto;
  padding: 6px 4px 12px;
  border-radius: 24px;
  box-shadow:
    inset 18px 0 24px -24px rgba(31, 32, 36, 0.12),
    inset -18px 0 24px -24px rgba(31, 32, 36, 0.12);
  scrollbar-width: thin;
  scrollbar-color: var(--color-neutral-ld) transparent;
}

.tasks-board__groups::-webkit-scrollbar {
  height: 10px;
}

.tasks-board__groups::-webkit-scrollbar-track {
  background: transparent;
}

.tasks-board__groups::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--color-neutral-ld) 80%, white);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.tasks-board__group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--color-neutral-lm) 72%, white);
  border-radius: 22px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-neutral-ll) 88%, white) 0%, white 100%);
  box-shadow:
    0 12px 28px rgba(31, 32, 36, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.75) inset;
}

.tasks-board__group-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.tasks-board__group-title {
  margin: 0 0 4px;
  color: var(--color-neutral-dd);
  font-size: 16px;
  font-weight: 700;
}

.tasks-board__group-description {
  margin: 0;
  color: var(--color-neutral-dl);
  font-size: 12px;
}

.tasks-board__group-count {
  display: inline-grid;
  place-items: center;
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--color-neutral-ll);
  color: var(--color-neutral-dm);
  font-size: 12px;
  font-weight: 700;
}

.tasks-board__lane {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(320px, 360px);
  align-items: start;
  gap: 14px;
  align-content: start;
}

@media (max-width: 640px) {
  .tasks-board__groups {
    grid-auto-columns: minmax(92vw, 92vw);
  }

  .tasks-board__lane {
    grid-auto-columns: minmax(280px, 86vw);
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: thin;
    scrollbar-color: var(--color-neutral-ld) transparent;
  }

  .tasks-board__lane::-webkit-scrollbar {
    height: 8px;
  }

  .tasks-board__lane::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--color-neutral-ld) 80%, white);
    border: 2px solid transparent;
    border-radius: 999px;
    background-clip: padding-box;
  }

  .tasks-board__group-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
