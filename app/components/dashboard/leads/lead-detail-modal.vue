<script setup lang="ts">
import { ref } from 'vue'
import { Dialog } from '@ark-ui/vue/dialog'
import { Tabs } from '@ark-ui/vue/tabs'
import type { Lead } from './types'
import UiButton from '~/components/ui/Button.vue'
import UiBadge from '~/components/ui/Badge.vue'

defineOptions({ inheritAttrs: false })

interface Props {
  lead: Lead | null
}

interface Emits {
  'update:open': [value: boolean]
  postpone: [leadId: string]
  take: [leadId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const open = defineModel<boolean>('open')

const tabs = [
  { value: 'info', label: 'Информация' },
  { value: 'eval', label: 'Оценко и данные' },
  { value: 'history', label: 'История' },
]

const selectedTab = ref<string>('info')
const noteValue = ref<string>('')

const handlePostpone = () => {
  if (props.lead?.id) {
    emit('postpone', props.lead.id)
  }
}

const handleTake = () => {
  if (props.lead?.id) {
    emit('take', props.lead.id)
  }
}
</script>

<template>
  <div>
    <Dialog.Root v-model:open="open" lazy-mount unmount-on-exit>
      <Teleport to="body">
        <Dialog.Backdrop class="dialog-backdrop" />
      <Dialog.Positioner class="dialog-positioner">
        <Dialog.Content v-if="lead" class="lead-detail-modal">
          <!-- Header -->
          <div class="lead-detail-modal__header">
            <div class="lead-detail-modal__header-top">
              <div class="lead-detail-modal__badges">
                <UiBadge variant="primary" size="sm">{{ lead.openStatus }}</UiBadge>
                <div class="lead-detail-modal__score">{{ lead.score }}</div>
              </div>
              <Dialog.CloseTrigger class="lead-detail-modal__close">
                <Icon name="other-icon-close" mode="svg" :size="24" />
              </Dialog.CloseTrigger>
            </div>

            <div class="lead-detail-modal__title-section">
              <h2 class="lead-detail-modal__title">{{ lead.title }}</h2>
              <p class="lead-detail-modal__subtitle">{{ lead.subtitle }}</p>
            </div>

            <!-- Tags -->
            <div class="lead-detail-modal__tags">
              <span v-for="tag in lead.tags" :key="tag" class="lead-detail-modal__tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Tabs -->
          <Tabs.Root v-model="selectedTab" class="lead-detail-modal__tabs">
            <Tabs.List class="lead-detail-modal__tab-list">
              <Tabs.Trigger
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                class="lead-detail-modal__tab-trigger"
              >
                {{ tab.label }}
              </Tabs.Trigger>
            </Tabs.List>

            <!-- Info Tab -->
            <Tabs.Content value="info" class="lead-detail-modal__tab-content">
              <div class="lead-detail-modal__section">
                <h3 class="lead-detail-modal__section-title">Контакты</h3>
                <div class="lead-detail-modal__contacts">
                  <div v-for="contact in lead.contacts" :key="contact" class="lead-detail-modal__contact">
                    <Icon name="other-icon-phone" mode="svg" :size="16" />
                    <span>{{ contact }}</span>
                  </div>
                  <div v-if="lead.email" class="lead-detail-modal__contact">
                    <Icon name="my-icon-inbox" mode="svg" :size="16" />
                    <span>{{ lead.email }}</span>
                  </div>
                </div>
              </div>

              <div class="lead-detail-modal__section">
                <h3 class="lead-detail-modal__section-title">Локация</h3>
                <div class="lead-detail-modal__location">
                  <p class="lead-detail-modal__location-address">{{ lead.address }}</p>
                  <a href="#" class="lead-detail-modal__location-link" @click.prevent>
                    Открыть в 2GIS
                  </a>
                </div>
              </div>

              <div class="lead-detail-modal__section">
                <h3 class="lead-detail-modal__section-title">Свежесть</h3>
                <p class="lead-detail-modal__freshness">{{ lead.freshness }}</p>
              </div>

              <div class="lead-detail-modal__section">
                <label class="lead-detail-modal__section-title">Заметка</label>
                <textarea
                  v-model="noteValue"
                  class="lead-detail-modal__textarea"
                  placeholder="Короткая заметка (опционально)"
                  rows="4"
                />
              </div>
            </Tabs.Content>

            <!-- Evaluation Tab -->
            <Tabs.Content value="eval" class="lead-detail-modal__tab-content">
              <div class="lead-detail-modal__section">
                <h3 class="lead-detail-modal__section-title">Оценки</h3>
                <div v-if="lead.fitScores.length" class="lead-detail-modal__scores">
                  <div v-for="score in lead.fitScores" :key="score.label" class="lead-detail-modal__score-item">
                    <span class="lead-detail-modal__score-label">{{ score.label }}</span>
                    <span class="lead-detail-modal__score-value">{{ score.level }}</span>
                  </div>
                </div>
                <p v-else class="lead-detail-modal__empty-state">Нет данных</p>
              </div>

              <div v-if="lead.branches?.length" class="lead-detail-modal__section">
                <h3 class="lead-detail-modal__section-title">Филиалы ({{ lead.branches.length }})</h3>
                <div class="lead-detail-modal__branches">
                  <div v-for="branch in lead.branches" :key="branch.id" class="lead-detail-modal__branch">
                    <div class="lead-detail-modal__branch-header">
                      <span class="lead-detail-modal__branch-name">{{ branch.name || 'Без названия' }}</span>
                      <span :class="['lead-detail-modal__branch-status', branch.isActive ? 'lead-detail-modal__branch-status--active' : 'lead-detail-modal__branch-status--inactive']">
                        {{ branch.isActive ? 'Активен' : 'Неактивен' }}
                      </span>
                    </div>
                    <p v-if="branch.fullAddress" class="lead-detail-modal__branch-address">{{ branch.fullAddress }}</p>
                    <div v-if="branch.rating != null || branch.reviewCount != null" class="lead-detail-modal__branch-signals">
                      <span v-if="branch.rating != null" class="lead-detail-modal__branch-signal">⭐ {{ branch.rating }}</span>
                      <span v-if="branch.reviewCount != null" class="lead-detail-modal__branch-signal">💬 {{ branch.reviewCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <!-- History Tab -->
            <Tabs.Content value="history" class="lead-detail-modal__tab-content">
              <div class="lead-detail-modal__section">
                <p class="lead-detail-modal__empty-state">История доступна после первого взаимодействия с лидом</p>
              </div>
            </Tabs.Content>
          </Tabs.Root>

          <!-- Footer -->
          <div class="lead-detail-modal__footer">
            <UiButton variant="error" class="lead-detail-modal__btn lead-detail-modal__btn--postpone" @click="handlePostpone">
              Отложить
            </UiButton>
            <UiButton variant="primary" class="lead-detail-modal__btn lead-detail-modal__btn--take" @click="handleTake">
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
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.2s ease-out;
}

.dialog-positioner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lead-detail-modal {
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  border-radius: 16px;
  background: var(--color-neutral-ll);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.lead-detail-modal__header {
  padding: 16px;
  border-bottom: 1px solid var(--color-neutral-l);
}

.lead-detail-modal__header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.lead-detail-modal__badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lead-detail-modal__score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-highlight-d);
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.lead-detail-modal__close {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-dm);
  transition: color 0.2s ease;
  padding: 4px;
}

.lead-detail-modal__close:hover {
  color: var(--color-neutral-dd);
}

.lead-detail-modal__title-section {
  margin-bottom: 12px;
}

.lead-detail-modal__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  line-height: 1.2;
}

.lead-detail-modal__subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dl);
}

.lead-detail-modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lead-detail-modal__tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--color-highlight-ll);
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tabs */
.lead-detail-modal__tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.lead-detail-modal__tab-list {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-neutral-l);
  padding: 0 16px;
  background: var(--color-neutral-ll);
}

.lead-detail-modal__tab-trigger {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-neutral-dl);
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  top: 1px;
}

.lead-detail-modal__tab-trigger[data-selected] {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.lead-detail-modal__tab-trigger:hover:not([data-selected]) {
  color: var(--color-neutral-dm);
}

/* Tab Content */
.lead-detail-modal__tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.lead-detail-modal__section {
  margin-bottom: 20px;
}

.lead-detail-modal__section:last-child {
  margin-bottom: 0;
}

.lead-detail-modal__section-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-neutral-dm);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* Contacts */
.lead-detail-modal__contacts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lead-detail-modal__contact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  background: var(--color-neutral-l);
  font-size: 13px;
  color: var(--color-neutral-dm);
}

.lead-detail-modal__contact :deep(svg) {
  color: var(--color-neutral-dl);
  flex-shrink: 0;
}

/* Location */
.lead-detail-modal__location {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  background: var(--color-neutral-l);
}

.lead-detail-modal__location-address {
  margin: 0;
  font-size: 13px;
  color: var(--color-neutral-dm);
  line-height: 1.4;
}

.lead-detail-modal__location-link {
  font-size: 12px;
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
  align-self: flex-start;
}

.lead-detail-modal__location-link:hover {
  opacity: 0.8;
}

/* Freshness */
.lead-detail-modal__freshness {
  margin: 0;
  padding: 8px;
  border-radius: 6px;
  background: var(--color-neutral-l);
  font-size: 13px;
  color: var(--color-neutral-dm);
  line-height: 1.4;
}

/* Textarea */
.lead-detail-modal__textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-neutral-l);
  border-radius: 6px;
  font-family: var(--font-base), sans-serif;
  font-size: 13px;
  color: var(--color-neutral-dd);
  resize: vertical;
  transition: border-color 0.2s ease;
}

.lead-detail-modal__textarea::placeholder {
  color: var(--color-neutral-dl);
}

.lead-detail-modal__textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Scores */
.lead-detail-modal__scores {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lead-detail-modal__score-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 6px;
  background: var(--color-neutral-l);
  font-size: 13px;
}

.lead-detail-modal__score-label {
  color: var(--color-neutral-dm);
  font-weight: 500;
}

.lead-detail-modal__score-value {
  color: var(--color-primary);
  font-weight: 700;
}

/* Branches */
.lead-detail-modal__branches {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lead-detail-modal__branch {
  padding: 10px;
  border-radius: 6px;
  background: var(--color-neutral-l);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lead-detail-modal__branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.lead-detail-modal__branch-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-neutral-dm);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lead-detail-modal__branch-status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.lead-detail-modal__branch-status--active {
  background: rgba(41, 130, 103, 0.15);
  color: #298267;
}

.lead-detail-modal__branch-status--inactive {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.lead-detail-modal__branch-address {
  margin: 0;
  font-size: 12px;
  color: var(--color-neutral-dl);
  line-height: 1.3;
}

.lead-detail-modal__branch-signals {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.lead-detail-modal__branch-signal {
  font-size: 11px;
  color: var(--color-neutral-dm);
  font-weight: 500;
}

/* Empty State */
.lead-detail-modal__empty-state {
  text-align: center;
  padding: 20px;
  color: var(--color-neutral-dl);
  font-size: 14px;
  margin: 0;
}

/* Footer */
.lead-detail-modal__footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--color-neutral-l);
  background: var(--color-neutral-ll);
}

.lead-detail-modal__btn {
  flex: 1;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 16px;
}

.lead-detail-modal__btn--postpone {
  background: #ff616d;
  border-color: #ff616d;
  color: white;
}

.lead-detail-modal__btn--postpone:hover:not(.btn--disabled) {
  background: #ff4455;
  border-color: #ff4455;
}

.lead-detail-modal__btn--take {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .lead-detail-modal {
    width: 95%;
    max-height: 95vh;
  }

  .lead-detail-modal__header {
    padding: 12px;
  }

  .lead-detail-modal__tab-content {
    padding: 12px;
  }

  .lead-detail-modal__footer {
    padding: 12px;
    gap: 8px;
  }
}
</style>
