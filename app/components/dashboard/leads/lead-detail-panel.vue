<script setup lang="ts">
import type { TenantLeadDetail } from "~/api/generated/api";
import { STAGE_LABELS } from "~/stores/leads.store";
import type { ContentSwitcherItem } from "~/components/ui/ContentSwitcher.vue";

const props = defineProps<{
  lead: TenantLeadDetail | null;
  isLoading: boolean;
  notes: any[];
  tasks: any[];
  isLoadingNotes: boolean;
  isLoadingTasks: boolean;
}>();

const emit = defineEmits<{
  close: [];
  moveLead: [toStage: string];
  createNote: [text: string];
  createTask: [data: { title: string; due_at?: string }];
  completeTask: [taskId: string];
}>();

const tabs: ContentSwitcherItem[] = [
  { value: "info", label: "Информация" },
  { value: "notes", label: "Заметки" },
  { value: "tasks", label: "Задачи" },
  { value: "history", label: "История" },
];

const selectedTab = ref<string[]>(["info"]);
const newNoteText = ref("");
const newTaskTitle = ref("");
const newTaskDueAt = ref("");
const isAddingNote = ref(false);
const isAddingTask = ref(false);

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatScore = (score: number | null | undefined) =>
  score != null ? Math.round(score * 100) : null;

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

const contactIcon = (type: string) => {
  const icons: Record<string, string> = {
    phone: "other-icon-phone",
    email: "my-icon-inbox",
    whatsapp: "other-icon-whatsapp",
    telegram: "other-icon-telegram",
    instagram: "other-icon-instagram",
    website: "other-icon-globe",
  };
  return icons[type] ?? "other-icon-link";
};

const handleSubmitNote = () => {
  if (!newNoteText.value.trim()) return;
  emit("createNote", newNoteText.value.trim());
  newNoteText.value = "";
  isAddingNote.value = false;
};

const handleSubmitTask = () => {
  if (!newTaskTitle.value.trim()) return;
  emit("createTask", {
    title: newTaskTitle.value.trim(),
    ...(newTaskDueAt.value ? { due_at: newTaskDueAt.value } : {}),
  });
  newTaskTitle.value = "";
  newTaskDueAt.value = "";
  isAddingTask.value = false;
};

const activityIcon = (type: string) => {
  const icons: Record<string, string> = {
    stage_change: "my-icon-arrow-right",
    note_added: "my-icon-inbox",
    task_created: "my-icon-check",
    member_assigned: "my-icon-user",
  };
  return icons[type] ?? "my-icon-circle";
};

const activityColor = (type: string) => {
  const colors: Record<string, string> = {
    stage_change: "#006FFD",
    note_added: "#298267",
    task_created: "#FF8C00",
    member_assigned: "#9B59B6",
  };
  return colors[type] ?? "#71727A";
};
</script>

<template>
  <aside class="detail-panel" aria-label="Детали лида">
    <!-- Loading skeleton -->
    <div v-if="isLoading" class="detail-panel__loading">
      <div class="detail-panel__skeleton detail-panel__skeleton--title" />
      <div class="detail-panel__skeleton detail-panel__skeleton--subtitle" />
      <div class="detail-panel__skeleton detail-panel__skeleton--block" />
      <div class="detail-panel__skeleton detail-panel__skeleton--block" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!lead" class="detail-panel__empty">
      <Icon name="my-icon-inbox" mode="svg" :size="28" />
      <p>Выберите лид для просмотра</p>
    </div>

    <template v-else>
      <!-- Header -->
      <header class="detail-panel__header">
        <div class="detail-panel__header-top">
          <span
            class="detail-panel__stage"
            :title="lead.stage_code"
          >
            {{ STAGE_LABELS[lead.stage_code] ?? lead.stage_code }}
          </span>
          <button class="detail-panel__close" @click="emit('close')">
            <Icon name="other-icon-close" mode="svg" :size="10" />
          </button>
        </div>

        <h2 class="detail-panel__title">{{ lead.lead_name }}</h2>
        <p v-if="lead.lead_legal_name" class="detail-panel__legal-name">
          {{ lead.lead_legal_name }}
        </p>
        <p class="detail-panel__subtitle">{{ lead.business_category_name_ru }}</p>

        <div v-if="lead.lead_bin_iin" class="detail-panel__bin">
          БИН/ИИН: <strong>{{ lead.lead_bin_iin }}</strong>
        </div>

        <!-- Score badges -->
        <div class="detail-panel__scores">
          <div
            v-if="formatScore(lead.priority_score) != null"
            class="detail-panel__score-badge detail-panel__score-badge--priority"
          >
            <span class="detail-panel__score-label">Приоритет</span>
            <span class="detail-panel__score-val">{{ formatScore(lead.priority_score) }}</span>
          </div>
          <div
            v-if="formatScore(lead.fit_score) != null"
            class="detail-panel__score-badge detail-panel__score-badge--fit"
          >
            <span class="detail-panel__score-label">Соответствие</span>
            <span class="detail-panel__score-val">{{ formatScore(lead.fit_score) }}</span>
          </div>
          <div
            v-if="formatScore(lead.freshness_score) != null"
            class="detail-panel__score-badge detail-panel__score-badge--freshness"
          >
            <span class="detail-panel__score-label">Свежесть</span>
            <span class="detail-panel__score-val">{{ formatScore(lead.freshness_score) }}</span>
          </div>
          <div
            v-if="formatScore(lead.contactability_score) != null"
            class="detail-panel__score-badge detail-panel__score-badge--contact"
          >
            <span class="detail-panel__score-label">Доступность</span>
            <span class="detail-panel__score-val">{{ formatScore(lead.contactability_score) }}</span>
          </div>
        </div>
      </header>

      <!-- Responsible member -->
      <div v-if="lead.responsible_member" class="detail-panel__member">
        <span class="detail-panel__member-label">Ответственный:</span>
        <span class="detail-panel__member-name">
          {{ lead.responsible_member.first_name ?? "" }}
          {{ lead.responsible_member.last_name ?? "" }}
          <span v-if="!lead.responsible_member.first_name && !lead.responsible_member.last_name">
            {{ lead.responsible_member.email ?? "—" }}
          </span>
        </span>
      </div>

      <!-- Tabs -->
      <ui-content-switcher v-model="selectedTab" :items="tabs" class="detail-panel__tabs" />

      <!-- Tab content -->
      <div class="detail-panel__content">

        <!-- ── INFO TAB ── -->
        <div v-if="selectedTab[0] === 'info'" class="detail-panel__tab-panel">

          <!-- Contacts -->
          <section v-if="phones.length || emails.length || otherContacts.length" class="detail-panel__section">
            <h4 class="detail-panel__section-label">Контакты</h4>
            <ul class="detail-panel__contact-list">
              <li v-for="c in phones" :key="c.id ?? c.value" class="detail-panel__contact-item">
                <Icon :name="contactIcon('phone')" mode="svg" :size="12" />
                <a :href="`tel:${c.value}`" class="detail-panel__contact-link">{{ c.value }}</a>
              </li>
              <li v-for="c in emails" :key="c.id ?? c.value" class="detail-panel__contact-item">
                <Icon :name="contactIcon('email')" mode="svg" :size="12" />
                <a :href="`mailto:${c.value}`" class="detail-panel__contact-link">{{ c.value }}</a>
              </li>
              <li v-for="c in otherContacts" :key="c.id ?? c.value" class="detail-panel__contact-item">
                <Icon :name="contactIcon(c.type)" mode="svg" :size="12" />
                <span class="detail-panel__contact-text">{{ c.value }}</span>
              </li>
            </ul>
          </section>

          <!-- Addresses -->
          <section v-if="lead.addresses?.length" class="detail-panel__section">
            <h4 class="detail-panel__section-label">Адреса</h4>
            <ul class="detail-panel__address-list">
              <li v-for="addr in lead.addresses" :key="addr.id" class="detail-panel__address-item">
                <span class="detail-panel__address-text">{{ addr.full_address ?? addr.city_name_ru }}</span>
                <a
                  v-if="addr.full_address"
                  href="#"
                  class="detail-panel__map-link"
                  @click.prevent
                >2GIS</a>
              </li>
            </ul>
          </section>

          <!-- Signals -->
          <section v-if="lead.signals" class="detail-panel__section">
            <h4 class="detail-panel__section-label">Сигналы</h4>
            <div class="detail-panel__signals">
              <div v-if="lead.signals.rating != null" class="detail-panel__signal">
                <span class="detail-panel__signal-key">Рейтинг</span>
                <span class="detail-panel__signal-val">⭐ {{ lead.signals.rating }}</span>
              </div>
              <div v-if="lead.signals.review_count != null" class="detail-panel__signal">
                <span class="detail-panel__signal-key">Отзывы</span>
                <span class="detail-panel__signal-val">{{ lead.signals.review_count }}</span>
              </div>
              <div v-if="lead.signals.branch_count != null" class="detail-panel__signal">
                <span class="detail-panel__signal-key">Филиалы</span>
                <span class="detail-panel__signal-val">{{ lead.signals.branch_count }}</span>
              </div>
              <div v-if="lead.signals.has_delivery != null" class="detail-panel__signal">
                <span class="detail-panel__signal-key">Доставка</span>
                <span class="detail-panel__signal-val">{{ lead.signals.has_delivery ? "Да" : "Нет" }}</span>
              </div>
              <div v-if="lead.signals.is_open_24_7 != null" class="detail-panel__signal">
                <span class="detail-panel__signal-key">24/7</span>
                <span class="detail-panel__signal-val">{{ lead.signals.is_open_24_7 ? "Да" : "Нет" }}</span>
              </div>
            </div>
          </section>

          <!-- Branches -->
          <section v-if="lead.branches?.length" class="detail-panel__section">
            <h4 class="detail-panel__section-label">Филиалы ({{ lead.branches.length }})</h4>
            <ul class="detail-panel__branches">
              <li v-for="branch in lead.branches" :key="branch.id" class="detail-panel__branch">
                <div class="detail-panel__branch-header">
                  <span class="detail-panel__branch-name">{{ branch.name ?? "Без названия" }}</span>
                  <span
                    class="detail-panel__branch-status"
                    :class="branch.is_active ? 'detail-panel__branch-status--active' : 'detail-panel__branch-status--inactive'"
                  >
                    {{ branch.is_active ? "Активен" : "Неактивен" }}
                  </span>
                </div>
                <p v-if="branch.full_address" class="detail-panel__branch-address">
                  {{ branch.full_address }}
                </p>
                <div v-if="branch.signals" class="detail-panel__branch-signals">
                  <span v-if="branch.signals.rating != null">⭐ {{ branch.signals.rating }}</span>
                  <span v-if="branch.signals.review_count != null">💬 {{ branch.signals.review_count }}</span>
                </div>
              </li>
            </ul>
          </section>

          <!-- Dates -->
          <section class="detail-panel__section">
            <h4 class="detail-panel__section-label">Даты</h4>
            <div class="detail-panel__dates">
              <div class="detail-panel__date-row">
                <span class="detail-panel__date-key">Создан</span>
                <span class="detail-panel__date-val">{{ formatDate(lead.created_at) }}</span>
              </div>
              <div v-if="lead.snoozed_until" class="detail-panel__date-row">
                <span class="detail-panel__date-key">Отложен до</span>
                <span class="detail-panel__date-val">{{ formatDate(lead.snoozed_until) }}</span>
              </div>
              <div v-if="lead.hidden_until" class="detail-panel__date-row">
                <span class="detail-panel__date-key">Скрыт до</span>
                <span class="detail-panel__date-val">{{ formatDate(lead.hidden_until) }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- ── NOTES TAB ── -->
        <div v-if="selectedTab[0] === 'notes'" class="detail-panel__tab-panel">
          <div class="detail-panel__tab-actions">
            <button
              v-if="!isAddingNote"
              class="detail-panel__add-btn"
              @click="isAddingNote = true"
            >
              + Добавить заметку
            </button>
          </div>

          <div v-if="isAddingNote" class="detail-panel__note-form">
            <textarea
              v-model="newNoteText"
              class="detail-panel__textarea"
              placeholder="Введите заметку..."
              rows="3"
              autofocus
            />
            <div class="detail-panel__form-actions">
              <ui-button variant="ghost" @click="isAddingNote = false; newNoteText = ''">
                Отмена
              </ui-button>
              <ui-button variant="primary" @click="handleSubmitNote">
                Сохранить
              </ui-button>
            </div>
          </div>

          <div v-if="isLoadingNotes" class="detail-panel__tab-loading">Загрузка...</div>

          <div v-else-if="notes.length === 0 && !isAddingNote" class="detail-panel__tab-empty">
            Заметок нет
          </div>

          <ul v-else class="detail-panel__notes-list">
            <li v-for="note in notes" :key="note.id" class="detail-panel__note">
              <p class="detail-panel__note-text">{{ note.text }}</p>
              <span class="detail-panel__note-date">{{ formatDate(note.created_at) }}</span>
            </li>
          </ul>
        </div>

        <!-- ── TASKS TAB ── -->
        <div v-if="selectedTab[0] === 'tasks'" class="detail-panel__tab-panel">
          <div class="detail-panel__tab-actions">
            <button
              v-if="!isAddingTask"
              class="detail-panel__add-btn"
              @click="isAddingTask = true"
            >
              + Добавить задачу
            </button>
          </div>

          <div v-if="isAddingTask" class="detail-panel__task-form">
            <input
              v-model="newTaskTitle"
              class="detail-panel__input"
              placeholder="Название задачи"
            />
            <input
              v-model="newTaskDueAt"
              type="datetime-local"
              class="detail-panel__input"
            />
            <div class="detail-panel__form-actions">
              <ui-button variant="ghost" @click="isAddingTask = false; newTaskTitle = ''; newTaskDueAt = ''">
                Отмена
              </ui-button>
              <ui-button variant="primary" @click="handleSubmitTask">
                Создать
              </ui-button>
            </div>
          </div>

          <div v-if="isLoadingTasks" class="detail-panel__tab-loading">Загрузка...</div>

          <div v-else-if="tasks.length === 0 && !isAddingTask" class="detail-panel__tab-empty">
            Задач нет
          </div>

          <ul v-else class="detail-panel__tasks-list">
            <li
              v-for="task in tasks"
              :key="task.id"
              class="detail-panel__task"
              :class="{ 'detail-panel__task--done': task.completed_at }"
            >
              <button
                class="detail-panel__task-check"
                :disabled="!!task.completed_at"
                @click="emit('completeTask', task.id)"
              >
                <Icon
                  :name="task.completed_at ? 'my-icon-check' : 'my-icon-circle'"
                  mode="svg"
                  :size="14"
                />
              </button>
              <div class="detail-panel__task-content">
                <span class="detail-panel__task-title">{{ task.title }}</span>
                <span v-if="task.due_at" class="detail-panel__task-due">
                  {{ formatDate(task.due_at) }}
                </span>
              </div>
            </li>
          </ul>
        </div>

        <!-- ── HISTORY TAB ── -->
        <div v-if="selectedTab[0] === 'history'" class="detail-panel__tab-panel">
          <div
            v-if="!lead.activity_history?.length"
            class="detail-panel__tab-empty"
          >
            История будет доступна после первого взаимодействия
          </div>

          <ul v-else class="detail-panel__timeline">
            <li
              v-for="(item, idx) in lead.activity_history"
              :key="idx"
              class="detail-panel__timeline-item"
            >
              <div
                class="detail-panel__timeline-dot"
                :style="{ background: activityColor(item.activity_type) }"
              />
              <div class="detail-panel__timeline-body">
                <span class="detail-panel__timeline-desc">{{ item.description ?? item.activity_type }}</span>
                <span class="detail-panel__timeline-date">{{ formatDate(item.created_at) }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.detail-panel {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 300px;
  height: 100%;
  border-radius: 16px;
  background: var(--color-neutral-ll);
  overflow: hidden;
  flex-shrink: 0;
}

.detail-panel__loading {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-panel__skeleton {
  background: linear-gradient(90deg, var(--color-neutral-ld) 25%, var(--color-neutral-ll) 50%, var(--color-neutral-ld) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.detail-panel__skeleton--title { height: 20px; width: 70%; }
.detail-panel__skeleton--subtitle { height: 14px; width: 50%; }
.detail-panel__skeleton--block { height: 60px; width: 100%; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.detail-panel__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-neutral-dl);
  text-align: center;
  padding: 20px;
}

.detail-panel__empty p {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
}

/* Header */
.detail-panel__header {
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--color-neutral-ld);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-panel__header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.detail-panel__stage {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 100px;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 600;
}

.detail-panel__close {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-dl);
  padding: 4px;
  border-radius: 6px;
  transition: background 0.15s;
}

.detail-panel__close:hover {
  background: var(--color-neutral-ld);
}

.detail-panel__title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  line-height: 1.25;
}

.detail-panel__legal-name {
  margin: 0;
  font-size: 11px;
  color: var(--color-neutral-dm);
}

.detail-panel__subtitle {
  margin: 0;
  font-size: 11px;
  color: #71727a;
}

.detail-panel__bin {
  font-size: 10px;
  color: var(--color-neutral-dl);
}

/* Scores */
.detail-panel__scores {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.detail-panel__score-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 8px;
  border-radius: 10px;
  min-width: 48px;
}

.detail-panel__score-badge--priority {
  background: color-mix(in srgb, #006FFD 12%, transparent);
}
.detail-panel__score-badge--fit {
  background: color-mix(in srgb, #298267 12%, transparent);
}
.detail-panel__score-badge--freshness {
  background: color-mix(in srgb, #FF8C00 12%, transparent);
}
.detail-panel__score-badge--contact {
  background: color-mix(in srgb, #9B59B6 12%, transparent);
}

.detail-panel__score-label {
  font-size: 8px;
  font-weight: 500;
  color: var(--color-neutral-dm);
  white-space: nowrap;
}

.detail-panel__score-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

/* Member */
.detail-panel__member {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--color-neutral-ld);
}

.detail-panel__member-label {
  font-size: 11px;
  color: var(--color-neutral-dm);
}

.detail-panel__member-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-neutral-dd);
}

/* Tabs */
.detail-panel__tabs {
  margin: 8px 12px 0;
  flex-shrink: 0;
}

/* Content */
.detail-panel__content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--color-neutral-ld) transparent;
}

.detail-panel__tab-panel {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Sections */
.detail-panel__section {
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-neutral-ld);
}

.detail-panel__section:last-child {
  border-bottom: 0;
}

.detail-panel__section-label {
  margin: 0 0 5px;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-neutral-dm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Contacts */
.detail-panel__contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-panel__contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-panel__contact-link {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
}

.detail-panel__contact-link:hover {
  text-decoration: underline;
}

.detail-panel__contact-text {
  font-size: 11px;
  color: var(--color-neutral-dm);
}

/* Addresses */
.detail-panel__address-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-panel__address-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.detail-panel__address-text {
  font-size: 11px;
  color: var(--color-neutral-dm);
  flex: 1;
}

.detail-panel__map-link {
  font-size: 10px;
  color: var(--color-neutral-dl);
  text-decoration: underline;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Signals */
.detail-panel__signals {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-panel__signal {
  display: flex;
  flex-direction: column;
  padding: 4px 8px;
  background: var(--color-neutral-ld);
  border-radius: 8px;
  min-width: 50px;
}

.detail-panel__signal-key {
  font-size: 9px;
  color: var(--color-neutral-dl);
  font-weight: 500;
}

.detail-panel__signal-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

/* Branches */
.detail-panel__branches {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-panel__branch {
  padding: 6px 8px;
  background: var(--color-neutral-ld);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.detail-panel__branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.detail-panel__branch-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-panel__branch-status {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.detail-panel__branch-status--active {
  background: rgba(41, 130, 103, 0.15);
  color: #298267;
}

.detail-panel__branch-status--inactive {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.detail-panel__branch-address {
  margin: 0;
  font-size: 10px;
  color: #71727a;
}

.detail-panel__branch-signals {
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: var(--color-neutral-dm);
}

/* Dates */
.detail-panel__dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-panel__date-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.detail-panel__date-key {
  font-size: 11px;
  color: var(--color-neutral-dl);
}

.detail-panel__date-val {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-neutral-dd);
}

/* Tab actions */
.detail-panel__tab-actions {
  padding: 8px 16px 4px;
}

.detail-panel__add-btn {
  background: none;
  border: 1px dashed var(--color-neutral-ld);
  border-radius: 10px;
  width: 100%;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.detail-panel__add-btn:hover {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
}

.detail-panel__tab-loading,
.detail-panel__tab-empty {
  padding: 20px 16px;
  text-align: center;
  font-size: 12px;
  color: var(--color-neutral-dl);
}

/* Note form */
.detail-panel__note-form,
.detail-panel__task-form {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-panel__textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-neutral-ld);
  border-radius: 10px;
  font-family: var(--font-base), sans-serif;
  font-size: 12px;
  color: var(--color-neutral-dd);
  resize: vertical;
  outline: none;
  box-sizing: border-box;
}

.detail-panel__textarea:focus {
  border-color: var(--color-primary);
}

.detail-panel__input {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--color-neutral-ld);
  border-radius: 10px;
  font-family: var(--font-base), sans-serif;
  font-size: 12px;
  color: var(--color-neutral-dd);
  outline: none;
  box-sizing: border-box;
}

.detail-panel__input:focus {
  border-color: var(--color-primary);
}

.detail-panel__form-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

/* Notes list */
.detail-panel__notes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-panel__note {
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-neutral-ld);
}

.detail-panel__note-text {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--color-neutral-dd);
  line-height: 1.4;
}

.detail-panel__note-date {
  font-size: 10px;
  color: var(--color-neutral-dl);
}

/* Tasks list */
.detail-panel__tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-panel__task {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-neutral-ld);
}

.detail-panel__task--done .detail-panel__task-title {
  text-decoration: line-through;
  color: var(--color-neutral-dl);
}

.detail-panel__task-check {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.detail-panel__task-check:disabled {
  color: #298267;
  cursor: default;
}

.detail-panel__task-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.detail-panel__task-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-neutral-dd);
}

.detail-panel__task-due {
  font-size: 10px;
  color: var(--color-neutral-dl);
}

/* Timeline */
.detail-panel__timeline {
  list-style: none;
  padding: 8px 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-panel__timeline-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding-bottom: 12px;
  position: relative;
}

.detail-panel__timeline-item::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 12px;
  bottom: 0;
  width: 1px;
  background: var(--color-neutral-ld);
}

.detail-panel__timeline-item:last-child::before {
  display: none;
}

.detail-panel__timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-panel__timeline-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.detail-panel__timeline-desc {
  font-size: 12px;
  color: var(--color-neutral-dd);
}

.detail-panel__timeline-date {
  font-size: 10px;
  color: var(--color-neutral-dl);
}
</style>
