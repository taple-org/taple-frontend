<script setup lang="ts">
import { Dialog } from "@ark-ui/vue/dialog";
import { TenantLeadTaskType } from "~/api/generated/api";
import type { CreateTaskRequest, TenantLeadDetail } from "~/api/generated/api";
import { STAGE_LABELS } from "~/stores/leads.store";
import type { ContentSwitcherItem } from "~/components/ui/ContentSwitcher.vue";
import type { TaskCreatePayload } from "~/components/workspace/tasks/model";

enum TaskModalStep {
  Confirm = "confirm",
  Create = "create",
}

enum Direction {
  Forward = "forward",
  Back = "back",
}

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  open: boolean;
  lead: TenantLeadDetail | null;
  isLoading: boolean;
  notes: any[];
  tasks: any[];
  isLoadingNotes: boolean;
  isLoadingTasks: boolean;
}>();

const emit = defineEmits<{
  close: [];
  createNote: [text: string];
  createTask: [data: CreateTaskRequest];
  completeTask: [taskId: string];
  takeToWork: [done?: (success: boolean) => void];
}>();

const open = computed({
  get: () => props.open,
  set: (v) => {
    if (!v) emit("close");
  },
});

const tabs: ContentSwitcherItem[] = [
  { value: "info", label: "Информация" },
  { value: "notes", label: "Заметки" },
  { value: "tasks", label: "Задачи" },
  { value: "history", label: "История" },
];

const selectedTab = ref<string[]>(["info"]);
const newNoteText = ref("");
const isAddingNote = ref(false);

// ── Task creation modal state ──────────────────────────────────────────────
const showTaskModal = ref(false);
const taskModalStep = ref<TaskModalStep>(TaskModalStep.Create);
const taskModalDirection = ref<Direction>(Direction.Forward);
const isCreatingTask = ref(false);

// Reset state whenever the modal opens
watch(
  () => props.open,
  (v) => {
    if (v) {
      selectedTab.value = ["info"];
      newNoteText.value = "";
      isAddingNote.value = false;
      // Reset task modal state
      showTaskModal.value = false;
      taskModalStep.value = TaskModalStep.Create;
      taskModalDirection.value = Direction.Forward;
      shouldOpenTaskAfterTakeToWork.value = false;
      isTakingToWork.value = false;
    }
  },
);

const formatDate = (d?: string | null) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtScore = (s?: number | null) =>
  s != null ? Math.round(s * 100) : null;

const phones = computed(() =>
  (props.lead?.contacts ?? []).filter((c) => c.type === "phone"),
);
const emails = computed(() =>
  (props.lead?.contacts ?? []).filter((c) => c.type === "email"),
);
const otherContacts = computed(() =>
  (props.lead?.contacts ?? []).filter(
    (c) => c.type !== "phone" && c.type !== "email",
  ),
);

const contactIcon = (type: string) =>
  ({
    phone: "other-icon-phone",
    email: "my-icon-inbox",
    whatsapp: "other-icon-whatsapp",
    telegram: "other-icon-telegram",
    instagram: "other-icon-instagram",
    website: "other-icon-globe",
  })[type] ?? "other-icon-link";

const submitNote = () => {
  if (!newNoteText.value.trim()) return;
  emit("createNote", newNoteText.value.trim());
  newNoteText.value = "";
  isAddingNote.value = false;
};

const openTaskModal = () => {
  taskModalStep.value = TaskModalStep.Create;
  taskModalDirection.value = Direction.Forward;
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
};

const submitTask = (payload: TaskCreatePayload) => {
  isCreatingTask.value = true;
  emit("createTask", {
    title: payload.title,
    description: payload.description || undefined,
    task_type: payload.task_type,
    due_at: payload.due_at || undefined,
    assigned_to_member_id: payload.assigned_to_member_id || undefined,
  });
  closeTaskModal();
  isCreatingTask.value = false;
};

const goToStep = (step: TaskModalStep) => {
  taskModalDirection.value =
    step === TaskModalStep.Create ? Direction.Forward : Direction.Back;
  taskModalStep.value = step;
};

const activityColor = (type: string) =>
  ({
    stage_change: "#006FFD",
    note_added: "#298267",
    task_created: "#FF8C00",
    member_assigned: "#9B59B6",
  })[type] ?? "#71727A";

// ── Activity history description formatter ────────────────────────────────
const getActivityDescription = (item: any): string => {
  const actor = item.actor?.full_name ?? "Система";

  switch (item.type) {
    case "stage_change":
      return `${actor} переместил(а) лид: ${item.from_stage} → ${item.to_stage}`;
    case "note_added":
      return `${actor} добавил(а) заметку: ${item.note_text ?? ""}`;
    case "task_created":
      return `${actor} создал(а) задачу: ${item.task_title}`;
    case "member_assigned":
      return `${actor} назначил(а) ответственного: ${item.assigned_member_name ?? ""}`;
    default:
      return `${actor} выполнил(а) действие`;
  }
};

// ── Task creation with lead status check ─────────────────────────────────
const isTakingToWork = ref(false);
const shouldOpenTaskAfterTakeToWork = ref(false);

const isInProgress = computed(() => props.lead?.stage_code === "in_progress");

watch(isInProgress, (value) => {
  if (!value || !shouldOpenTaskAfterTakeToWork.value) return;
  shouldOpenTaskAfterTakeToWork.value = false;
  isTakingToWork.value = false;
  goToStep(TaskModalStep.Create);
});

const handleAddTaskClick = () => {
  if (!isInProgress.value) {
    taskModalStep.value = TaskModalStep.Confirm;
    taskModalDirection.value = Direction.Forward;
    showTaskModal.value = true;
    return;
  }
  openTaskModal();
};

const handleTakeToWorkConfirm = () => {
  isTakingToWork.value = true;
  shouldOpenTaskAfterTakeToWork.value = true;
  emit("takeToWork", (success) => {
    isTakingToWork.value = false;
    if (success) {
      goToStep(TaskModalStep.Create);
    }
  });
};

const scores = computed(() => {
  const l = props.lead;
  if (!l) return [];
  return [
    {
      key: "priority",
      label: "Приоритет",
      val: fmtScore(l.priority_score),
      bg: "#EAF2FF",
      color: "#006FFD",
    },
    {
      key: "fit",
      label: "Соответствие",
      val: fmtScore(l.fit_score),
      bg: "#E7F4E8",
      color: "#298267",
    },
    {
      key: "freshness",
      label: "Свежесть",
      val: fmtScore(l.freshness_score),
      bg: "#FFF4E5",
      color: "#FF8C00",
    },
    {
      key: "contact",
      label: "Доступность",
      val: fmtScore(l.contactability_score),
      bg: "#F3EAFF",
      color: "#9B59B6",
    },
  ].filter((s) => s.val != null);
});
</script>

<template>
  <Dialog.Root v-model:open="open" lazy-mount unmount-on-exit>
    <Teleport to="body">
      <Dialog.Backdrop class="ldp-backdrop" />
      <Dialog.Positioner class="ldp-positioner">
        <Dialog.Content class="ldp-modal">
          <!-- ── Loading skeleton ── -->
          <div v-if="isLoading" class="ldp-skeleton-wrap">
            <div class="ldp-skeleton ldp-skeleton--title" />
            <div class="ldp-skeleton ldp-skeleton--sub" />
            <div class="ldp-skeleton ldp-skeleton--block" />
            <div class="ldp-skeleton ldp-skeleton--block" />
          </div>

          <template v-else-if="lead">
            <!-- ── Header ── -->
            <header class="ldp-header">
              <div class="ldp-header__top">
                <div class="ldp-header__badges">
                  <span class="ldp-stage">{{
                    STAGE_LABELS[lead.stage_code] ?? lead.stage_code
                  }}</span>
                  <div class="ldp-header__scores">
                    <span
                      v-for="s in scores"
                      :key="s.key"
                      class="ldp-score-chip"
                      :style="{ background: s.bg, color: s.color }"
                    >
                      {{ s.label }}: <strong>{{ s.val }}</strong>
                    </span>
                  </div>
                </div>
                <Dialog.CloseTrigger class="ldp-close">
                  <Icon name="other-icon-close" mode="svg" :size="12" />
                </Dialog.CloseTrigger>
              </div>

              <div class="ldp-header__title-row">
                <h2 class="ldp-title">{{ lead.lead_name }}</h2>
                <p v-if="lead.lead_legal_name" class="ldp-legal">
                  {{ lead.lead_legal_name }}
                </p>
              </div>

              <div class="ldp-header__meta">
                <span class="ldp-category">{{
                  lead.business_category_name_ru
                }}</span>
                <span v-if="lead.lead_bin_iin" class="ldp-bin"
                  >БИН/ИИН: {{ lead.lead_bin_iin }}</span
                >
                <span v-if="lead.responsible_member" class="ldp-member">
                  Ответственный:
                  <strong>
                    {{
                      lead.responsible_member?.user_full_name ??
                      lead.responsible_member?.user_email ??
                      "-"
                    }}
                  </strong>
                </span>
              </div>
            </header>

            <!-- ── Tabs ── -->
            <ui-content-switcher
              v-model="selectedTab"
              :items="tabs"
              class="ldp-tabs"
            />

            <!-- ── Body ── -->
            <div class="ldp-body">
              <!-- INFO -->
              <div v-if="selectedTab[0] === 'info'" class="ldp-panel">
                <div class="ldp-columns">
                  <!-- Left col: contacts + addresses + dates -->
                  <div class="ldp-col">
                    <section
                      v-if="
                        phones.length || emails.length || otherContacts.length
                      "
                      class="ldp-section"
                    >
                      <h4 class="ldp-section__label">Контакты</h4>
                      <ul class="ldp-contact-list">
                        <li
                          v-for="c in phones"
                          :key="c.id ?? c.value"
                          class="ldp-contact-item"
                        >
                          <Icon
                            :name="contactIcon('phone')"
                            mode="svg"
                            :size="13"
                          />
                          <a
                            :href="`tel:${c.value}`"
                            class="ldp-contact-link"
                            >{{ c.value }}</a
                          >
                        </li>
                        <li
                          v-for="c in emails"
                          :key="c.id ?? c.value"
                          class="ldp-contact-item"
                        >
                          <Icon
                            :name="contactIcon('email')"
                            mode="svg"
                            :size="13"
                          />
                          <a
                            :href="`mailto:${c.value}`"
                            class="ldp-contact-link"
                            >{{ c.value }}</a
                          >
                        </li>
                        <li
                          v-for="c in otherContacts"
                          :key="c.id ?? c.value"
                          class="ldp-contact-item"
                        >
                          <Icon
                            :name="contactIcon(c.type)"
                            mode="svg"
                            :size="13"
                          />
                          <span class="ldp-contact-text">{{ c.value }}</span>
                        </li>
                      </ul>
                    </section>

                    <section v-if="lead.addresses?.length" class="ldp-section">
                      <h4 class="ldp-section__label">Адреса</h4>
                      <ul class="ldp-address-list">
                        <li
                          v-for="addr in lead.addresses"
                          :key="addr.id"
                          class="ldp-address-item"
                        >
                          <span class="ldp-address-text">{{
                            addr.full_address ?? addr.city_name_ru
                          }}</span>
                          <a
                            v-if="addr.full_address"
                            href="#"
                            class="ldp-map-link"
                            @click.prevent
                            >2GIS</a
                          >
                        </li>
                      </ul>
                    </section>

                    <section class="ldp-section">
                      <h4 class="ldp-section__label">Даты</h4>
                      <div class="ldp-date-grid">
                        <span class="ldp-date-key">Создан</span>
                        <span class="ldp-date-val">{{
                          formatDate(lead.created_at)
                        }}</span>
                        <template v-if="lead.snoozed_until">
                          <span class="ldp-date-key">Отложен до</span>
                          <span class="ldp-date-val">{{
                            formatDate(lead.snoozed_until)
                          }}</span>
                        </template>
                        <template v-if="lead.hidden_until">
                          <span class="ldp-date-key">Скрыт до</span>
                          <span class="ldp-date-val">{{
                            formatDate(lead.hidden_until)
                          }}</span>
                        </template>
                      </div>
                    </section>
                  </div>

                  <!-- Right col: signals + branches -->
                  <div class="ldp-col">
                    <section v-if="lead.signals" class="ldp-section">
                      <h4 class="ldp-section__label">Сигналы</h4>
                      <div class="ldp-signals-grid">
                        <div
                          v-if="lead.signals.rating != null"
                          class="ldp-signal-chip"
                        >
                          <span class="ldp-signal-key">Рейтинг</span>
                          <span class="ldp-signal-val"
                            >⭐ {{ lead.signals.rating }}</span
                          >
                        </div>
                        <div
                          v-if="lead.signals.review_count != null"
                          class="ldp-signal-chip"
                        >
                          <span class="ldp-signal-key">Отзывы</span>
                          <span class="ldp-signal-val">{{
                            lead.signals.review_count
                          }}</span>
                        </div>
                        <div
                          v-if="lead.signals.branch_count != null"
                          class="ldp-signal-chip"
                        >
                          <span class="ldp-signal-key">Филиалы</span>
                          <span class="ldp-signal-val">{{
                            lead.signals.branch_count
                          }}</span>
                        </div>
                        <div
                          v-if="lead.signals.has_delivery != null"
                          class="ldp-signal-chip"
                        >
                          <span class="ldp-signal-key">Доставка</span>
                          <span class="ldp-signal-val">{{
                            lead.signals.has_delivery ? "Да" : "Нет"
                          }}</span>
                        </div>
                        <div
                          v-if="lead.signals.is_24x7 != null"
                          class="ldp-signal-chip"
                        >
                          <span class="ldp-signal-key">24/7</span>
                          <span class="ldp-signal-val">{{
                            lead.signals?.is_24x7 ? "Да" : "Нет"
                          }}</span>
                        </div>
                      </div>
                    </section>

                    <section v-if="lead.branches?.length" class="ldp-section">
                      <h4 class="ldp-section__label">
                        Филиалы ({{ lead.branches.length }})
                      </h4>
                      <ul class="ldp-branch-list">
                        <li
                          v-for="b in lead.branches"
                          :key="b.id"
                          class="ldp-branch"
                        >
                          <div class="ldp-branch__header">
                            <span class="ldp-branch__addr">{{
                              b.full_address ?? "Адрес не указан"
                            }}</span>
                            <span
                              class="ldp-branch__status"
                              :class="
                                b.is_active
                                  ? 'ldp-branch__status--on'
                                  : 'ldp-branch__status--off'
                              "
                            >
                              {{ b.is_active ? "Активен" : "Неактивен" }}
                            </span>
                          </div>
                          <div v-if="b.signals" class="ldp-branch__sigs">
                            <span v-if="b.signals.rating != null"
                              >⭐ {{ b.signals.rating }}</span
                            >
                            <span v-if="b.signals.review_count != null"
                              >💬 {{ b.signals.review_count }}</span
                            >
                          </div>
                          <!-- Congestion heatmap (visit frequency) -->
                          <div
                            v-if="b.congestion?.present"
                            class="ldp-branch__congestion"
                          >
                            <dashboard-leads-congestion-heatmap
                              :congestion="b.congestion"
                            />
                          </div>
                        </li>
                      </ul>
                    </section>
                  </div>
                </div>
              </div>

              <!-- NOTES -->
              <div v-if="selectedTab[0] === 'notes'" class="ldp-panel">
                <div class="ldp-tab-action-row">
                  <button
                    v-if="!isAddingNote"
                    class="ldp-add-btn"
                    @click="isAddingNote = true"
                  >
                    + Добавить заметку
                  </button>
                </div>

                <div v-if="isAddingNote" class="ldp-form">
                  <textarea
                    v-model="newNoteText"
                    class="ldp-textarea"
                    placeholder="Введите заметку..."
                    rows="4"
                    autofocus
                  />
                  <div class="ldp-form__actions">
                    <ui-button
                      variant="ghost"
                      @click="
                        isAddingNote = false;
                        newNoteText = '';
                      "
                      >Отмена</ui-button
                    >
                    <ui-button variant="primary" @click="submitNote"
                      >Сохранить</ui-button
                    >
                  </div>
                </div>

                <div v-if="isLoadingNotes" class="ldp-empty">Загрузка...</div>
                <div
                  v-else-if="notes.length === 0 && !isAddingNote"
                  class="ldp-empty"
                >
                  Заметок пока нет
                </div>

                <ul v-else class="ldp-notes">
                  <li v-for="note in notes" :key="note.id" class="ldp-note">
                    <p class="ldp-note__text">{{ note.note }}</p>
                    <div class="ldp-note__meta">
                      <span class="ldp-note__author">{{
                        note.author_full_name ?? note.author_email ?? "—"
                      }}</span>
                      <span class="ldp-note__date">{{
                        formatDate(note.created_at)
                      }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- TASKS -->
              <div v-if="selectedTab[0] === 'tasks'" class="ldp-panel">
                <div class="ldp-tab-action-row">
                  <button class="ldp-add-btn" @click="handleAddTaskClick">
                    + Добавить задачу
                  </button>
                </div>

                <div v-if="isLoadingTasks" class="ldp-empty">Загрузка...</div>
                <div v-else-if="tasks.length === 0" class="ldp-empty">
                  Задач пока нет
                </div>

                <ul v-else class="ldp-tasks">
                  <li
                    v-for="task in tasks"
                    :key="task.id"
                    class="ldp-task"
                    :class="{ 'ldp-task--done': task.completed_at }"
                  >
                    <button
                      class="ldp-task__check"
                      :disabled="!!task.completed_at"
                      @click="emit('completeTask', task.id)"
                    >
                      <Icon
                        :name="
                          task.completed_at ? 'my-icon-check' : 'my-icon-circle'
                        "
                        mode="svg"
                        :size="16"
                      />
                    </button>
                    <div class="ldp-task__body">
                      <span class="ldp-task__title">{{ task.title }}</span>
                      <span v-if="task.due_at" class="ldp-task__due">{{
                        formatDate(task.due_at)
                      }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- HISTORY -->
              <div v-if="selectedTab[0] === 'history'" class="ldp-panel">
                <div v-if="!lead.activity_history?.length" class="ldp-empty">
                  История появится после первого взаимодействия с лидом
                </div>

                <ul v-else class="ldp-timeline">
                  <li
                    v-for="(item, idx) in lead.activity_history"
                    :key="idx"
                    class="ldp-timeline__item"
                  >
                    <div
                      class="ldp-timeline__dot"
                      :style="{ background: activityColor(item.type) }"
                    />
                    <div class="ldp-timeline__body">
                      <span class="ldp-timeline__desc">{{
                        getActivityDescription(item)
                      }}</span>
                      <span class="ldp-timeline__date">{{
                        formatDate(item.occurred_at)
                      }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- /ldp-body -->
          </template>

          <!-- Fallback (shouldn't normally show) -->
          <div v-else class="ldp-empty-modal">
            <p>Данные лида недоступны</p>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>

  <!-- Task creation flow modal with slide transitions -->
  <ui-simple-modal v-model:open="showTaskModal" @close="closeTaskModal">
    <Transition :name="`task-modal-slide-${taskModalDirection}`" mode="out-in">
      <!-- Confirm step: Take to work -->
      <div
        v-if="taskModalStep === TaskModalStep.Confirm"
        key="confirm"
        class="take-to-work-modal"
      >
        <h3 class="take-to-work-modal__title">Взять лид в работу?</h3>
        <p class="take-to-work-modal__desc">
          Чтобы создать задачу, лид должен быть в работе. Взять лида в работу
          сейчас?
        </p>
        <div class="take-to-work-modal__actions">
          <ui-button variant="outline" @click="closeTaskModal"
            >Отмена</ui-button
          >
          <ui-button
            variant="primary"
            :disabled="isTakingToWork"
            @click="handleTakeToWorkConfirm"
          >
            {{ isTakingToWork ? "Обработка..." : "Да, взять в работу" }}
          </ui-button>
        </div>
      </div>

      <!-- Create step: Task form -->
      <div v-else key="create" class="task-create-wrapper">
        <WorkspaceTasksCreateModal
          :open="true"
          :workspace-id="lead?.tenant_id ?? ''"
          :pending="isCreatingTask"
          :pre-selected-lead="
            lead
              ? {
                  tenant_lead_id: lead.id,
                  lead_id: lead.lead_id,
                  lead_name: lead.lead_name,
                  stage_code: lead.stage_code,
                }
              : null
          "
          @close="closeTaskModal"
          @submit="submitTask"
        />
      </div>
    </Transition>
  </ui-simple-modal>
</template>

<style scoped>
/* ── Backdrop ── */
.ldp-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.45);
}
.ldp-backdrop[data-state="open"] {
  animation: ldp-fade-in 200ms ease;
}
.ldp-backdrop[data-state="closed"] {
  animation: ldp-fade-out 150ms ease;
}

/* ── Positioner ── */
.ldp-positioner {
  position: fixed;
  inset: 0;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  pointer-events: none;
}

/* ── Modal shell ── */
.ldp-modal {
  pointer-events: all;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e8e9f1;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  contain: layout style;
}
.ldp-modal[data-state="open"] {
  animation: ldp-slide-up 300ms ease;
}
.ldp-modal[data-state="closed"] {
  animation: ldp-slide-down 200ms ease;
}

/* ── Animations ── */
@keyframes ldp-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes ldp-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes ldp-slide-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes ldp-slide-down {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(24px);
  }
}

/* ── Header ── */
.ldp-header {
  padding: 24px 28px 16px;
  border-bottom: 1px solid #e8e9f1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.ldp-header__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.ldp-header__badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ldp-stage {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 100px;
  background: #eaf2ff;
  color: #006ffd;
  font-size: 11px;
  font-weight: 700;
}

.ldp-header__scores {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ldp-score-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 500;
}
.ldp-score-chip strong {
  font-weight: 800;
  font-size: 12px;
}

.ldp-close {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: #8f9098;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;
}
.ldp-close:hover {
  background: #f0f1f7;
  color: #1f2024;
}

.ldp-header__title-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ldp-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2024;
  line-height: 1.2;
}
.ldp-legal {
  margin: 0;
  font-size: 12px;
  color: #8f9098;
}

.ldp-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}
.ldp-category,
.ldp-bin,
.ldp-member {
  font-size: 12px;
  color: #71727a;
}
.ldp-bin strong,
.ldp-member strong {
  color: #1f2024;
  font-weight: 600;
}

/* ── Tabs ── */
.ldp-tabs {
  margin: 12px 28px 0;
  flex-shrink: 0;
}

/* ── Body ── */
.ldp-body {
  flex: 1;
  overflow-y: auto;
  min-height: 400px;
  max-height: 400px;
  padding: 20px 28px 28px;
  scrollbar-width: thin;
  scrollbar-color: #e8e9f1 transparent;
}

.ldp-panel {
  min-height: 360px;
}

.ldp-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ldp-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.ldp-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Section card ── */
.ldp-section {
  border: 1px solid #e8e9f1;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ldp-section__label {
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  color: #8f9098;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Contacts ── */
.ldp-contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ldp-contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ldp-contact-link {
  font-size: 13px;
  font-weight: 500;
  color: #006ffd;
  text-decoration: none;
}
.ldp-contact-link:hover {
  text-decoration: underline;
}
.ldp-contact-text {
  font-size: 13px;
  color: #494a50;
}

/* ── Addresses ── */
.ldp-address-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ldp-address-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.ldp-address-text {
  font-size: 12px;
  color: #494a50;
  flex: 1;
}
.ldp-map-link {
  font-size: 11px;
  color: #8f9098;
  text-decoration: underline;
  white-space: nowrap;
}

/* ── Dates ── */
.ldp-date-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 5px 16px;
}
.ldp-date-key {
  font-size: 12px;
  color: #8f9098;
}
.ldp-date-val {
  font-size: 12px;
  font-weight: 500;
  color: #1f2024;
}

/* ── Signals ── */
.ldp-signals-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ldp-signal-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 14px;
  background: #f8f9fe;
  border-radius: 12px;
  min-width: 64px;
}
.ldp-signal-key {
  font-size: 9px;
  color: #8f9098;
  font-weight: 500;
}
.ldp-signal-val {
  font-size: 16px;
  color: #1f2024;
  font-weight: 700;
}

/* ── Branches ── */
.ldp-branch-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ldp-branch {
  background: #f8f9fe;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ldp-branch__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.ldp-branch__addr {
  font-size: 12px;
  color: #494a50;
  flex: 1;
  line-height: 1.4;
}
.ldp-branch__status {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  white-space: nowrap;
}
.ldp-branch__status--on {
  background: rgba(41, 130, 103, 0.15);
  color: #298267;
}
.ldp-branch__status--off {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}
.ldp-branch__sigs {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #494a50;
}
.ldp-branch__congestion {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--color-neutral-ld);
}

/* ── Notes ── */
.ldp-notes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
.ldp-note {
  padding: 14px 0;
  border-bottom: 1px solid #e8e9f1;
}
.ldp-note:last-child {
  border-bottom: 0;
}
.ldp-note__text {
  margin: 0 0 8px;
  font-size: 13px;
  color: #1f2024;
  line-height: 1.5;
}
.ldp-note__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.ldp-note__author {
  font-size: 11px;
  font-weight: 500;
  color: #006ffd;
}
.ldp-note__date {
  font-size: 11px;
  color: #8f9098;
}

/* ── Tasks ── */
.ldp-tasks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
.ldp-task {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #e8e9f1;
}
.ldp-task:last-child {
  border-bottom: 0;
}
.ldp-task--done .ldp-task__title {
  text-decoration: line-through;
  color: #8f9098;
}
.ldp-task__check {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--color-primary);
  flex-shrink: 0;
}
.ldp-task__check:disabled {
  color: #298267;
  cursor: default;
}
.ldp-task__body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}
.ldp-task__title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2024;
}
.ldp-task__due {
  font-size: 11px;
  color: #8f9098;
}

/* ── Timeline ── */
.ldp-timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
.ldp-timeline__item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 18px;
  position: relative;
}
.ldp-timeline__item::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 12px;
  bottom: 0;
  width: 1px;
  background: #e8e9f1;
}
.ldp-timeline__item:last-child::before {
  display: none;
}
.ldp-timeline__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 3px;
}
.ldp-timeline__body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}
.ldp-timeline__desc {
  font-size: 13px;
  color: #1f2024;
}
.ldp-timeline__date {
  font-size: 11px;
  color: #8f9098;
}

/* ── Form elements ── */
.ldp-tab-action-row {
  padding-bottom: 4px;
}

.ldp-add-btn {
  width: 100%;
  padding: 12px;
  border: 1px dashed #c5c6cc;
  border-radius: 12px;
  background: none;
  font-family: var(--font-base), sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.ldp-add-btn:hover {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
}

.ldp-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ldp-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e8e9f1;
  border-radius: 12px;
  font-family: var(--font-base), sans-serif;
  font-size: 13px;
  color: #1f2024;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  line-height: 1.5;
}
.ldp-textarea:focus {
  border-color: var(--color-primary);
}

.ldp-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #e8e9f1;
  border-radius: 12px;
  font-family: var(--font-base), sans-serif;
  font-size: 13px;
  color: #1f2024;
  outline: none;
  box-sizing: border-box;
}
.ldp-input:focus {
  border-color: var(--color-primary);
}

.ldp-form__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* ── Empty states ── */
.ldp-empty {
  padding: 48px 20px;
  text-align: center;
  font-size: 14px;
  color: #8f9098;
}
.ldp-empty-modal {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  font-size: 14px;
  color: #8f9098;
}

/* ── Skeleton ── */
.ldp-skeleton-wrap {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ldp-skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f1f7 25%, #f8f9fe 50%, #f0f1f7 75%);
  background-size: 200% 100%;
  animation: ldp-shimmer 1.4s infinite;
}
.ldp-skeleton--title {
  height: 26px;
  width: 50%;
}
.ldp-skeleton--sub {
  height: 16px;
  width: 30%;
}
.ldp-skeleton--block {
  height: 90px;
  width: 100%;
}
@keyframes ldp-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ── Task creation modal (from workspace/tasks) ── */
.task-create {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: min(520px, calc(100vw - 96px));
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
  margin-top: 8px;
}

/* ── Take to work modal ── */
.take-to-work-modal {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 360px;
}

.take-to-work-modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2024;
}

.take-to-work-modal__desc {
  margin: 0;
  font-size: 13px;
  color: #71727a;
  line-height: 1.5;
}

.take-to-work-modal__actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
}

/* ── Responsive ── */
@media (max-width: 700px) {
  .ldp-modal {
    max-height: 95vh;
    border-radius: 16px;
  }
  .ldp-positioner {
    padding: 12px 8px;
  }
  .ldp-header {
    padding: 18px 18px 14px;
  }
  .ldp-body {
    padding: 16px 18px 22px;
  }
  .ldp-tabs {
    margin: 10px 18px 0;
  }
  .ldp-columns {
    grid-template-columns: 1fr;
  }
  .take-to-work-modal {
    min-width: 280px;
    padding: 20px;
  }
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
