<script setup lang="ts">
import {
  DEFAULT_TASK_BUCKETS,
  filterTaskBoardColumns,
  type TaskCreatePayload,
} from "~/components/workspace/tasks/model";
import type { TaskBucket, TaskBoardResponse } from "~/api/generated/api";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useSeoMeta({
  title: "Задачи — Taple",
  description: "Глобальная kanban-доска задач рабочего пространства в Taple.",
  robots: "noindex, nofollow",
});

const route = useRoute();
const workspaceId = route.params.workspaceId as string;
const { $apiClient } = useNuxtApp();
const notification = useNotification();

const isCreateOpen = ref(false);
const isCreatePending = ref(false);
const visibleBuckets = ref<TaskBucket[]>([...DEFAULT_TASK_BUCKETS]);
const search = ref("");
const responsibleMemberId = ref("");
const assignedToMemberId = ref("");

const {
  data: taskBoard,
  pending,
  error,
  refresh,
} = useAsyncData(
  `task-board-${workspaceId}`,
  () =>
    $apiClient.api
      .getTaskBoardApiV1LeadsTasksGet({
        tenant_id: workspaceId,
        search: search.value.trim() || null,
        responsible_member_id: responsibleMemberId.value || undefined,
        assigned_to_member_id: assignedToMemberId.value || undefined,
        buckets: visibleBuckets.value.length ? visibleBuckets.value : null,
      })
      .then((response) => response.data.result),
  {
    server: false,
    default: () => ({ columns: [], total_count: 0 }) as TaskBoardResponse,
    watch: [search, responsibleMemberId, assignedToMemberId, visibleBuckets],
  },
);

watch(error, (err) => {
  if (err) {
    notification.error("Ошибка", "Не удалось загрузить task board");
  }
}, { immediate: true });

const columns = computed(() =>
  filterTaskBoardColumns(taskBoard.value?.columns ?? [], visibleBuckets.value),
);
const totalCount = computed(() =>
  columns.value.reduce((sum, column) => sum + column.tasks.length, 0),
);

async function handleCreate(payload: TaskCreatePayload) {
  isCreatePending.value = true;
  try {
    await $apiClient.api.createGlobalTaskApiV1LeadsTasksPost(
      { tenant_id: workspaceId },
      payload,
    );
    isCreateOpen.value = false;
    notification.success("Готово", "Задача создана");
    await refresh();
  } catch {
    notification.error("Ошибка", "Не удалось создать задачу");
  } finally {
    isCreatePending.value = false;
  }
}
</script>

<template>
  <ui-container :padding="[30, 15]">
    <section class="tasks-page__hero">
      <div class="tasks-page__actions">
        <div class="tasks-page__stat">
          <strong>{{ totalCount }}</strong>
          <span>задач в выбранных таблицах</span>
        </div>
        <ui-button icon-left="my-icon:add" @click="isCreateOpen = true">
          Создать задачу
        </ui-button>
      </div>
    </section>

    <workspace-tasks-filters
      :workspace-id="workspaceId"
      v-model:search="search"
      v-model:buckets="visibleBuckets"
      v-model:responsible-member-id="responsibleMemberId"
      v-model:assigned-to-member-id="assignedToMemberId"
    />
    <div v-if="pending" class="tasks-page__state">Загружаем task board...</div>
    <client-only v-else>
      <workspace-tasks-board
        :columns="columns"
        :workspace-id="workspaceId"
        @changed="refresh"
      />
    </client-only>
    <workspace-tasks-create-modal
      :open="isCreateOpen"
      :workspace-id="workspaceId"
      :pending="isCreatePending"
      @close="isCreateOpen = false"
      @submit="handleCreate"
    />
  </ui-container>
</template>

<style scoped>

.tasks-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.tasks-page__copy {
  max-width: 760px;
}

.tasks-page__eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tasks-page__title {
  margin: 0 0 8px;
  color: var(--color-neutral-dd);
  font-size: 34px;
  font-weight: 700;
  line-height: 1.1;
}

.tasks-page__description {
  margin: 0;
  color: var(--color-neutral-dm);
  font-size: 15px;
  line-height: 1.6;
}

.tasks-page__actions {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.tasks-page__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 12px 14px;
  border-radius: 16px;
  background: var(--color-neutral-ll);
}

.tasks-page__stat strong {
  color: var(--color-neutral-dd);
  font-size: 20px;
  line-height: 1;
}

.tasks-page__stat span,
.tasks-page__state {
  color: var(--color-neutral-dl);
  font-size: 12px;
}

.tasks-page__state {
  padding: 24px 0;
}

@media (max-width: 900px) {
  .tasks-page__hero {
    flex-direction: column;
    align-items: stretch;
  }

  .tasks-page__actions {
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .tasks-page__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .tasks-page__stat {
    align-items: flex-start;
  }
}
</style>
