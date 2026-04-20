<script setup lang="ts">
import { TenantLeadTaskType, type LeadSearchItem } from "~/api/generated/api";
import {
  fromDateAndTime,
  TASK_TYPE_OPTIONS,
  type TaskCreatePayload,
} from "./model";

const emit = defineEmits<{
  close: [];
  submit: [payload: TaskCreatePayload];
}>();

const { open, workspaceId, pending } = defineProps<{
  open: boolean;
  workspaceId: string;
  pending?: boolean;
}>();

const { $apiClient } = useNuxtApp();

const query = ref("");
const results = ref<LeadSearchItem[]>([]);
const selectedLead = ref<LeadSearchItem | null>(null);
const title = ref("");
const description = ref("");
const taskType = ref<TenantLeadTaskType>(TenantLeadTaskType.FollowUp);
const dueDate = ref("");
const dueTime = ref("10:00");
const isSearching = ref(false);

let searchTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => open,
  (value) => {
    if (!value) return;

    query.value = "";
    results.value = [];
    selectedLead.value = null;
    title.value = "";
    description.value = "";
    taskType.value = TenantLeadTaskType.FollowUp;
    dueDate.value = "";
    dueTime.value = "10:00";
  },
);

watch(query, (value) => {
  if (searchTimer) clearTimeout(searchTimer);

  if (!open || value.trim().length < 2) {
    results.value = [];
    isSearching.value = false;
    return;
  }

  isSearching.value = true;
  searchTimer = setTimeout(async () => {
    try {
      const response = await $apiClient.api.searchLeadsApiV1LeadsSearchGet({
        tenant_id: workspaceId,
        q: value.trim(),
        limit: 8,
      });
      results.value = response.data.result;
    } finally {
      isSearching.value = false;
    }
  }, 250);
});

const canSubmit = computed(() => !!selectedLead.value && title.value.trim());

function handleSubmit() {
  if (!selectedLead.value || !title.value.trim()) return;

  emit("submit", {
    tenant_lead_id: selectedLead.value.tenant_lead_id,
    title: title.value.trim(),
    description: description.value.trim() || null,
    task_type: taskType.value,
    due_at: fromDateAndTime(dueDate.value, dueTime.value),
  });
}
</script>

<template>
  <ui-simple-modal
    :open="open"
    @update:open="!$event && emit('close')"
  >
    <div class="task-create">
      <header class="task-create__header">
        <div>
          <h3 class="task-create__title">Создать задачу</h3>
          <p class="task-create__description-text">
            Найдите лид и добавьте новую задачу в глобальную task board
          </p>
        </div>
        <button type="button" class="task-create__close" @click="emit('close')">
          <Icon name="my-icon:close" width="14" height="14" />
        </button>
      </header>

      <div class="task-create__group">
        <label class="task-create__label">Лид</label>
        <ui-form-field
          v-model="query"
          type="text"
          placeholder="Начните вводить название лида"
          icon-left="my-icon-search"
        />

        <div v-if="selectedLead" class="task-create__selected">
          Выбран: <strong>{{ selectedLead.lead_name }}</strong>
        </div>

        <div v-if="isSearching" class="task-create__search-state">Ищем лиды...</div>

        <ul v-else-if="results.length" class="task-create__results">
          <li v-for="lead in results" :key="lead.tenant_lead_id">
            <button
              type="button"
              class="task-create__result"
              :class="{ 'task-create__result--active': selectedLead?.tenant_lead_id === lead.tenant_lead_id }"
              @click="selectedLead = lead"
            >
              <strong>{{ lead.lead_name }}</strong>
              <span>{{ lead.stage_code }}</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="task-create__group">
        <label class="task-create__label">Заголовок</label>
        <ui-form-field v-model="title" type="text" placeholder="Например, созвониться с клиентом" />
      </div>

      <div class="task-create__grid">
        <div class="task-create__group">
          <label class="task-create__label">Тип задачи</label>
          <ui-form-field v-model="taskType" type="select" :options="TASK_TYPE_OPTIONS" placeholder="Тип задачи" />
        </div>

        <div class="task-create__group">
          <label class="task-create__label">Срок</label>
          <div class="task-create__date-row">
            <ui-date-picker v-model="dueDate" placeholder="Выберите дату" />
            <input v-model="dueTime" class="task-create__input task-create__input--time" type="time" />
          </div>
        </div>
      </div>

      <div class="task-create__group">
        <label class="task-create__label">Описание</label>
        <textarea
          v-model="description"
          class="task-create__textarea"
          placeholder="Контекст задачи, детали разговора, что проверить..."
        />
      </div>

      <div class="task-create__footer">
        <ui-button variant="outline" @click="emit('close')">Отмена</ui-button>
        <ui-button :disabled="!canSubmit || pending" @click="handleSubmit">
          Создать задачу
        </ui-button>
      </div>
    </div>
  </ui-simple-modal>
</template>

<style scoped>
.task-create {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: min(720px, calc(100vw - 96px));
  padding: 28px;
  box-sizing: border-box;
}

.task-create__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.task-create__title {
  margin: 0 0 4px;
  color: var(--color-neutral-dd);
  font-size: 22px;
  font-weight: 700;
}

.task-create__description-text {
  margin: 0;
  color: var(--color-neutral-dl);
  font-size: 12px;
}

.task-create__close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--color-neutral-dl);
  cursor: pointer;
}

.task-create__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.task-create__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.task-create__label {
  color: var(--color-neutral-dd);
  font-size: 12px;
  font-weight: 700;
}

.task-create__selected,
.task-create__search-state {
  color: var(--color-neutral-dl);
  font-size: 12px;
}

.task-create__results {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
}

.task-create__result {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: 14px;
  background: var(--color-secondary);
  text-align: left;
  cursor: pointer;
}

.task-create__result--active {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, white);
}

.task-create__result strong {
  color: var(--color-neutral-dd);
  font-size: 13px;
}

.task-create__result span {
  color: var(--color-neutral-dl);
  font-size: 11px;
}

.task-create__date-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 132px;
  gap: 10px;
}

.task-create__input,
.task-create__textarea {
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

.task-create__textarea {
  min-height: 110px;
  max-width: 100%;
  resize: vertical;
}

.task-create__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 760px) {
  .task-create {
    min-width: auto;
    padding: 20px;
  }

  .task-create__grid {
    grid-template-columns: 1fr;
  }

  .task-create__date-row {
    grid-template-columns: 1fr;
  }

  .task-create__footer {
    flex-direction: column-reverse;
  }
}
</style>
