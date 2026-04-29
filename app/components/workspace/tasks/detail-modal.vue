<script setup lang="ts">
import type { TaskBoardItem } from "~/api/generated/api";
import { useWorkspaceMemberOptions } from "~/composables/workspace/useWorkspaceMemberOptions";
import {
  fromDateOnly,
  getTaskTypeOptions,
  toDatePart,
  type TaskCompletePayload,
  type TaskUpdatePayload,
} from "./model";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const taskTypeOptions = computed(() => getTaskTypeOptions(t));

const emit = defineEmits<{
  close: [];
  save: [payload: TaskUpdatePayload];
  complete: [payload: TaskCompletePayload];
}>();

const { open, task, pending, workspaceId } = defineProps<{
  open: boolean;
  task: TaskBoardItem | null;
  workspaceId: string;
  pending?: boolean;
}>();

const title = ref("");
const description = ref("");
const result = ref("");
const dueDate = ref("");
const assignedToMemberId = ref("");
const taskType = ref(taskTypeOptions.value[0]!.value);

const { options: memberOptions, pending: membersPending } =
  useWorkspaceMemberOptions(computed(() => workspaceId));

watch(
  () => task,
  (value) => {
    title.value = value?.title ?? "";
    description.value = value?.description ?? "";
    result.value = value?.result ?? "";
    dueDate.value = toDatePart(value?.due_at);
    assignedToMemberId.value = value?.assigned_to_member_id ?? "";
    taskType.value = value?.task_type ?? taskTypeOptions.value[0]!.value;
  },
  { immediate: true },
);

function handleSave() {
  emit("save", {
    title: title.value.trim() || null,
    description: description.value.trim() || null,
    task_type: taskType.value,
    due_at: fromDateOnly(dueDate.value),
    result: result.value.trim() || null,
    assigned_to_member_id: assignedToMemberId.value || null,
  });
}

function handleComplete() {
  emit("complete", {
    result: result.value.trim() || null,
  });
}
</script>

<template>
  <ui-modal
    :open="open"
    :title="t('tasks.editTask')"
    :description="t('tasks.editTaskDesc')"
    @update:open="!$event && emit('close')"
  >
    <div v-if="task" class="task-detail">
      <div class="task-detail__meta">
        <div>
          <strong>{{ task.lead_name }}</strong>
          <span>{{
            task.assigned_to_full_name ||
            task.assigned_to_email ||
            t("tasks.unassigned")
          }}</span>
        </div>
        <ui-badge size="sm">{{ task.status }}</ui-badge>
      </div>

      <div class="task-detail__group">
        <label class="task-detail__label">{{ t("tasks.title") }}</label>
        <ui-form-field
          v-model="title"
          type="text"
          :placeholder="t('tasks.taskNamePlaceholder')"
        />
      </div>

      <div class="task-detail__grid">
        <div class="task-detail__group">
          <label class="task-detail__label">{{ t("tasks.taskType") }}</label>
          <ui-form-field
            v-model="taskType"
            type="select"
            :options="taskTypeOptions"
            :placeholder="t('tasks.taskType')"
          />
        </div>

        <div class="task-detail__group">
          <label class="task-detail__label">{{ t("tasks.dueDate") }}</label>
          <ui-form-field
            v-model="dueDate"
            type="date"
            :placeholder="t('tasks.selectDate')"
          />
        </div>

        <div class="task-detail__group">
          <label class="task-detail__label">{{ t("tasks.assignee") }}</label>
          <ui-form-field
            v-model="assignedToMemberId"
            type="select"
            :options="memberOptions"
            :disabled="membersPending"
            :placeholder="t('tasks.selectMember')"
          />
        </div>
      </div>

      <div class="task-detail__group">
        <label class="task-detail__label">{{ t("tasks.description") }}</label>
        <textarea
          v-model="description"
          class="task-detail__textarea"
          :placeholder="t('tasks.description')"
        />
      </div>

      <div class="task-detail__group">
        <label class="task-detail__label">{{ t("tasks.result") }}</label>
        <textarea
          v-model="result"
          class="task-detail__textarea"
          :placeholder="t('tasks.resultPlaceholder')"
        />
      </div>

      <div class="task-detail__footer">
        <ui-button variant="outline" @click="emit('close')">{{
          t("common.close")
        }}</ui-button>
        <ui-button variant="outline" :disabled="pending" @click="handleSave">
          {{ t("common.save") }}
        </ui-button>
        <ui-button :disabled="pending" @click="handleComplete">
          {{ t("tasks.completeTask") }}
        </ui-button>
      </div>
    </div>
  </ui-modal>
</template>

<style scoped>
.task-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: min(720px, calc(100vw - 96px));
}

.task-detail__meta,
.task-detail__grid,
.task-detail__footer {
  display: flex;
  gap: 12px;
}

.task-detail__meta {
  align-items: center;
  justify-content: space-between;
}

.task-detail__meta strong {
  display: block;
  color: var(--color-neutral-dd);
  font-size: 14px;
}

.task-detail__meta span {
  color: var(--color-neutral-dl);
  font-size: 12px;
}

.task-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.task-detail__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.task-detail__label {
  color: var(--color-neutral-dd);
  font-size: 12px;
  font-weight: 700;
}

.task-detail__input,
.task-detail__textarea {
  width: 100%;
  display: block;
  box-sizing: border-box;
  padding: 16px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: 12px;
  background: var(--color-secondary);
  font: inherit;
  color: var(--color-neutral-dd);
}

.task-detail__textarea {
  min-height: 112px;
  max-width: 100%;
  resize: vertical;
}

.task-detail__footer {
  justify-content: flex-end;
}

@media (max-width: 760px) {
  .task-detail {
    min-width: auto;
  }

  .task-detail__grid {
    grid-template-columns: 1fr;
  }

  .task-detail__footer {
    flex-direction: column-reverse;
  }
}
</style>
