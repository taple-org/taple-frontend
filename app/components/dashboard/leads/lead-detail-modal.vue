<script setup lang="ts">
import { ref } from "vue";
import { Dialog } from "@ark-ui/vue/dialog";
import type { Lead } from "./types";
import UiButton from "~/components/ui/Button.vue";
import UiBadge from "~/components/ui/Badge.vue";
import UiContentSwitcher from "~/components/ui/ContentSwitcher.vue";
import type { ContentSwitcherItem } from "~/components/ui/ContentSwitcher.vue";

defineOptions({ inheritAttrs: false });

interface Props {
  lead: Lead | null;
}

interface Emits {
  "update:open": [value: boolean];
  postpone: [leadId: string];
  take: [leadId: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const open = defineModel<boolean>("open");

const tabs: ContentSwitcherItem[] = [
  { value: "info", label: "Информация" },
  { value: "eval", label: "Оценка и данные" },
  { value: "history", label: "История" },
];

const selectedTab = ref<string[]>(["info"]);
const noteValue = ref<string>("");

const handlePostpone = () => {
  if (props.lead?.id) {
    emit("postpone", props.lead.id);
  }
};

const handleTake = () => {
  if (props.lead?.id) {
    emit("take", props.lead.id);
  }
};
</script>

<template>
  <div>
    <Dialog.Root v-model:open="open" lazy-mount unmount-on-exit>
      <Teleport to="body">
        <Dialog.Backdrop class="modal-backdrop" />
        <Dialog.Positioner class="modal-positioner">
          <Dialog.Content v-if="lead" class="modal">
            <!-- Header -->
            <div class="modal__header">
              <div class="modal__header-top">
                <div class="modal__badges">
                  <UiBadge variant="primary" size="sm">{{
                    lead.openStatus
                  }}</UiBadge>
                  <div class="modal__score">{{ lead.score }}</div>
                </div>
                <Dialog.CloseTrigger class="modal__close">
                  <Icon name="other-icon-close" mode="svg" :size="10" />
                </Dialog.CloseTrigger>
              </div>

              <div class="modal__title-section">
                <h2 class="modal__title">{{ lead.title }}</h2>
                <p class="modal__subtitle">{{ lead.subtitle }}</p>
              </div>

              <!-- Tags -->
              <div v-if="lead.tags.length" class="modal__tags">
                <span
                  v-for="tag in lead.tags"
                  :key="tag"
                  class="modal__tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Tabs -->
            <UiContentSwitcher v-model="selectedTab" :items="tabs" class="modal__tabs" />

            <!-- Tab Content -->
            <div class="modal__content">
              <!-- Info Tab -->
              <div v-if="selectedTab[0] === 'info'" class="modal__tab-panel">
                <div class="modal__columns">
                  <div class="modal__column">
                    <!-- Contacts -->
                    <div v-if="lead.contacts.length || lead.email" class="modal__section">
                      <h3 class="modal__section-title">Контакты</h3>
                      <div class="modal__section-content">
                        <div
                          v-for="contact in lead.contacts"
                          :key="contact"
                          class="modal__contact-row"
                        >
                          <Icon name="other-icon-phone" mode="svg" :size="14" />
                          <span>{{ contact }}</span>
                        </div>
                        <div v-if="lead.email" class="modal__contact-row">
                          <Icon name="my-icon-inbox" mode="svg" :size="14" />
                          <span>{{ lead.email }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Location -->
                    <div v-if="lead.address" class="modal__section">
                      <div class="modal__section-header">
                        <h3 class="modal__section-title">Локация</h3>
                        <a
                          href="#"
                          class="modal__link"
                          @click.prevent
                        >
                          Открыть в 2GIS
                          <Icon name="other-icon-external" mode="svg" :size="8" />
                        </a>
                      </div>
                      <div class="modal__section-content">
                        <p class="modal__text">{{ lead.address }}</p>
                      </div>
                    </div>

                    <!-- Freshness -->
                    <div v-if="lead.freshness" class="modal__section">
                      <h3 class="modal__section-title">Свежесть</h3>
                      <div class="modal__section-content">
                        <p class="modal__text">{{ lead.freshness }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="modal__column">
                    <!-- Summary -->
                    <div v-if="lead.reasons.length" class="modal__section modal__section--full">
                      <h3 class="modal__section-title">Сводка</h3>
                      <div class="modal__section-content modal__summary">
                        <div
                          v-for="(reason, index) in lead.reasons"
                          :key="index"
                          class="modal__summary-row"
                        >
                          <span class="modal__summary-label">{{ reason.split(':')[0] }}:</span>
                          <span class="modal__summary-value">{{ reason.split(':')[1]?.trim() }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Note -->
                <div class="modal__section">
                  <h3 class="modal__section-title">Заметка</h3>
                  <div class="modal__section-content">
                    <textarea
                      v-model="noteValue"
                      class="modal__textarea"
                      placeholder="Короткая заметка (опционально)"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <!-- Evaluation Tab -->
              <div v-if="selectedTab[0] === 'eval'" class="modal__tab-panel">
                <!-- Fit Scores -->
                <div v-if="lead.fitScores.length" class="modal__section">
                  <h3 class="modal__section-title">Оценки</h3>
                  <div class="modal__section-content">
                    <div
                      v-for="score in lead.fitScores"
                      :key="score.label"
                      class="modal__score-row"
                    >
                      <span class="modal__score-label">{{ score.label }}</span>
                      <span class="modal__score-value">{{ score.level }}</span>
                    </div>
                  </div>
                </div>

                <!-- Branches -->
                <div v-if="lead.branches.length" class="modal__section">
                  <h3 class="modal__section-title">
                    Филиалы ({{ lead.branches.length }})
                  </h3>
                  <div class="modal__section-content">
                    <div
                      v-for="branch in lead.branches"
                      :key="branch.id"
                      class="modal__branch"
                    >
                      <div class="modal__branch-header">
                        <span class="modal__branch-name">{{
                          branch.name || "Без названия"
                        }}</span>
                        <span
                          :class="[
                            'modal__branch-status',
                            branch.isActive
                              ? 'modal__branch-status--active'
                              : 'modal__branch-status--inactive',
                          ]"
                        >
                          {{ branch.isActive ? "Активен" : "Неактивен" }}
                        </span>
                      </div>
                      <p
                        v-if="branch.fullAddress"
                        class="modal__branch-address"
                      >
                        {{ branch.fullAddress }}
                      </p>
                      <div
                        v-if="branch.rating != null || branch.reviewCount != null"
                        class="modal__branch-signals"
                      >
                        <span
                          v-if="branch.rating != null"
                          class="modal__branch-signal"
                          >⭐ {{ branch.rating }}</span
                        >
                        <span
                          v-if="branch.reviewCount != null"
                          class="modal__branch-signal"
                          >💬 {{ branch.reviewCount }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- History Tab -->
              <div v-if="selectedTab[0] === 'history'" class="modal__tab-panel">
                <div class="modal__empty">
                  <p>История доступна после первого взаимодействия с лидом</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal__footer">
              <UiButton
                variant="error"
                class="modal__btn"
                @click="handlePostpone"
              >
                Отложить
              </UiButton>
              <UiButton
                variant="primary"
                class="modal__btn"
                @click="handleTake"
              >
                Взять в работу
              </UiButton>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Teleport>
    </Dialog.Root>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}

.modal-backdrop[data-state='open'] {
  animation: fadeIn 200ms ease;
}

.modal-backdrop[data-state='closed'] {
  animation: fadeOut 150ms ease;
}

.modal-positioner {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  padding: 16px;
  pointer-events: none;
}

.modal {
  width: 90%;
  max-width: 690px;
  max-height: 90vh;
  border-radius: 16px;
  background: #FFFFFF;
  border: 1px solid #E8E9F1;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  pointer-events: all;
  contain: layout style;
}

.modal[data-state='open'] {
  animation: slideUp 300ms ease;
}

.modal[data-state='closed'] {
  animation: slideDown 200ms ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* Header */
.modal__header {
  padding: 25px 25px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal__header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal__badges {
  display: flex;
  align-items: center;
  gap: 5px;
}

.modal__score {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #298267;
  color: #E7F4E8;
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.14px;
}

.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #494A50;
  transition: color var(--transition-base);
  padding: 4px;
}

.modal__close:hover {
  color: #1F2024;
}

.modal__title-section {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1F2024;
  line-height: normal;
  font-family: var(--font-base);
}

.modal__subtitle {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #71727A;
  line-height: 16px;
  letter-spacing: 0.12px;
}

.modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.modal__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 12px;
  background: #EAF2FF;
  color: #006FFD;
  font-size: 6px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: normal;
}

/* Tabs */
.modal__tabs {
  margin: 0 25px;
}

/* Content */
.modal__content {
  flex: 1;
  overflow-y: auto;
  padding: 15px 25px;
  min-height: 0;
}

.modal__tab-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal__columns {
  display: flex;
  gap: 10px;
}

.modal__column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Sections */
.modal__section {
  border: 1px solid #E8E9F1;
  border-radius: 15px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.modal__section--full {
  height: 100%;
}

.modal__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.modal__section-title {
  margin: 0;
  font-size: 10px;
  font-weight: 500;
  color: #8F9098;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  line-height: 13px;
}

.modal__section-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.modal__link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 5px;
  font-weight: 500;
  color: #8F9098;
  text-decoration: none;
  border-bottom: 0.5px solid #8F9098;
  line-height: normal;
  transition: color var(--transition-base);
}

.modal__link:hover {
  color: #494A50;
  border-bottom-color: #494A50;
}

.modal__text {
  margin: 0;
  font-size: 8px;
  font-weight: 500;
  color: #71727A;
  line-height: normal;
}

/* Contacts */
.modal__contact-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 8px;
  font-weight: 500;
  color: #494A50;
  line-height: normal;
}

.modal__contact-row :deep(svg) {
  color: #494A50;
  flex-shrink: 0;
}

/* Summary */
.modal__summary {
  gap: 5px;
}

.modal__summary-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 8px;
  line-height: normal;
}

.modal__summary-label {
  font-weight: 500;
  color: #1F2024;
}

.modal__summary-value {
  font-weight: 700;
  color: #1F2024;
}

/* Textarea */
.modal__textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E8E9F1;
  border-radius: 12px;
  font-family: var(--font-base);
  font-size: 10px;
  font-weight: 400;
  color: #1F2024;
  line-height: 20px;
  resize: vertical;
  transition: border-color var(--transition-base);
  background: #FFFFFF;
}

.modal__textarea::placeholder {
  color: #8F9098;
}

.modal__textarea:focus {
  outline: none;
  border-color: #006FFD;
}

/* Scores */
.modal__score-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 8px;
  line-height: normal;
}

.modal__score-label {
  font-weight: 500;
  color: #1F2024;
}

.modal__score-value {
  font-weight: 700;
  color: #006FFD;
}

/* Branches */
.modal__branch {
  padding: 10px;
  border-radius: 6px;
  background: #F8F9FE;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal__branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.modal__branch-name {
  font-size: 8px;
  font-weight: 600;
  color: #494A50;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal__branch-status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 6px;
  font-weight: 600;
  white-space: nowrap;
  line-height: normal;
}

.modal__branch-status--active {
  background: rgba(41, 130, 103, 0.15);
  color: #298267;
}

.modal__branch-status--inactive {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.modal__branch-address {
  margin: 0;
  font-size: 8px;
  font-weight: 400;
  color: #71727A;
  line-height: 1.3;
}

.modal__branch-signals {
  display: flex;
  gap: 10px;
}

.modal__branch-signal {
  font-size: 8px;
  font-weight: 500;
  color: #494A50;
}

/* Empty State */
.modal__empty {
  text-align: center;
  padding: 40px 20px;
}

.modal__empty p {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #71727A;
  line-height: 1.5;
}

/* Footer */
.modal__footer {
  display: flex;
  gap: 0;
  padding: 0 25px 25px;
}

.modal__btn {
  flex: 1;
  font-size: 10px;
  font-weight: 500;
  padding: 10px 8px;
  border-radius: 0;
}

.modal__btn:first-child {
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
}

.modal__btn:last-child {
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
}

/* Responsive */
@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-height: 95vh;
  }

  .modal__columns {
    flex-direction: column;
  }

  .modal__header {
    padding: 20px 20px 12px;
  }

  .modal__content {
    padding: 12px 20px;
  }

  .modal__footer {
    padding: 0 20px 20px;
  }
}
</style>
