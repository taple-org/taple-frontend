<script setup lang="ts">
import { TenantLeadTaskType, type LeadSearchItem } from "~/api/generated/api";
import { useWorkspaceMemberOptions } from "~/composables/workspace/useWorkspaceMemberOptions";
import {
  fromDateOnly,
  TASK_TYPE_OPTIONS,
  type TaskCreatePayload,
} from "./model";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emit = defineEmits<{
  close: [];
  submit: [payload: TaskCreatePayload];
}>();

const { open, workspaceId, pending, preSelectedLead } = defineProps<{
  open: boolean;
  workspaceId: string;
  pending?: boolean;
  preSelectedLead?: LeadSearchItem | null;
}>();

const { $apiClient } = useNuxtApp();

const query = ref("");
const results = ref<LeadSearchItem[]>([]);
const selectedLead = ref<LeadSearchItem | null>(preSelectedLead ?? null);
const title = ref("");
const description = ref("");
const taskType = ref<TenantLeadTaskType>(TenantLeadTaskType.FollowUp);
const dueDate = ref("");
const assignedToMemberId = ref("");
const isSearching = ref(false);
const minDate = new Date().toISOString().slice(0, 10);

const { options: memberOptions, pending: membersPending } =
  useWorkspaceMemberOptions(computed(() => workspaceId));

let searchTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => open,
  (value) => {
    if (!value) return;

    query.value = "";
    results.value = [];
    selectedLead.value = preSelectedLead ?? null;
    title.value = "";
    description.value = "";
    taskType.value = TenantLeadTaskType.FollowUp;
    dueDate.value = "";
    assignedToMemberId.value = "";
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

// Map stage codes to translated labels
const getStageLabel = (stageCode?: string): string => {
  if (!stageCode) return "—";
  const keyMap: Record<string, string> = {
    new: "leads.new",
    in_progress: "leads.inProgress",
    won: "leads.won",
    lost: "leads.lost",
    hidden: "leads.hidden",
    snoozed: "leads.snoozed",
    negotiation: "leads.negotiation",
    first_contact: "leads.firstContact",
    contract: "leads.contract",
    monitoring: "leads.monitoring",
  };
  const key = keyMap[stageCode];
  return key ? t(key) : stageCode;
};

function handleSubmit() {
  if (!selectedLead.value || !title.value.trim()) return;

  emit("submit", {
    tenant_lead_id: selectedLead.value.tenant_lead_id,
    title: title.value.trim(),
    description: description.value.trim() || null,
    task_type: taskType.value,
    due_at: fromDateOnly(dueDate.value)?.slice(0, 10),
    assigned_to_member_id: assignedToMemberId.value || null,
  });
}
</script>

<template>
  <ui-simple-modal :open="open" @update:open="!$event && emit('close')">
    <div class="task-create">
      <header class="task-create__header">
        <div>
          <h3 class="task-create__title">{{ t("tasks.createTask") }}</h3>
          <p class="task-create__description-text">
            <template v-if="preSelectedLead">
              {{ t("tasks.forLead") }}:
              <strong>{{ preSelectedLead.lead_name }}</strong>
            </template>
            <template v-else>
              {{ t("tasks.findLeadAndAdd") }}
            </template>
          </p>
        </div>
        <button type="button" class="task-create__close" @click="emit('close')">
          <Icon name="my-icon:close" width="14" height="14" />
        </button>
      </header>

      <div v-if="!preSelectedLead" class="task-create__group">
        <label class="task-create__label">{{ t("tasks.lead") }}</label>
        <ui-form-field
          v-model="query"
          type="text"
          :placeholder="t('tasks.startTypingLead')"
          icon-left="my-icon-search"
        />

        <div v-if="selectedLead" class="task-create__selected">
          {{ t("tasks.selected") }}:
          <strong>{{ selectedLead.lead_name }}</strong>
        </div>

        <div v-if="isSearching" class="task-create__search-state">
          {{ t("tasks.searchingLeads") }}
        </div>

        <ul v-else-if="results.length" class="task-create__results">
          <li v-for="lead in results" :key="lead.tenant_lead_id">
            <button
              type="button"
              class="task-create__result"
              :class="{
                'task-create__result--active':
                  selectedLead?.tenant_lead_id === lead.tenant_lead_id,
              }"
              @click="selectedLead = lead"
            >
              <strong>{{ lead.lead_name }}</strong>
              <span>{{ getStageLabel(lead.stage_code) }}</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="task-create__group">
        <label class="task-create__label">{{ t("tasks.title") }}</label>
        <ui-form-field
          v-model="title"
          type="text"
          :placeholder="t('tasks.titlePlaceholder')"
        />
      </div>

      <div class="task-create__grid">
        <div class="task-create__group">
          <label class="task-create__label">{{ t("tasks.taskType") }}</label>
          <ui-form-field
            v-model="taskType"
            type="select"
            :options="TASK_TYPE_OPTIONS"
            :placeholder="t('tasks.taskType')"
          />
        </div>

        <div class="task-create__group">
          <label class="task-create__label">{{ t("tasks.dueDate") }}</label>
          <ui-form-field
            v-model="dueDate"
            type="date"
            :min="minDate"
            :placeholder="t('tasks.selectDate')"
          />
        </div>

        <div class="task-create__group">
          <label class="task-create__label">{{ t("tasks.assignee") }}</label>
          <ui-form-field
            v-model="assignedToMemberId"
            type="select"
            :options="memberOptions"
            :disabled="membersPending"
            :placeholder="t('tasks.selectMember')"
          />
        </div>
      </div>

      <div class="task-create__group">
        <label class="task-create__label">{{ t("tasks.description") }}</label>
        <textarea
          v-model="description"
          class="task-create__textarea"
          :placeholder="t('tasks.descriptionPlaceholder')"
        />
      </div>

      <div class="task-create__footer">
        <ui-button variant="outline" @click="emit('close')">{{
          t("common.cancel")
        }}</ui-button>
        <ui-button :disabled="!canSubmit || pending" @click="handleSubmit">
          {{ t("tasks.createTaskBtn") }}
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

  .task-create__footer {
    flex-direction: column-reverse;
  }
}
</style>
