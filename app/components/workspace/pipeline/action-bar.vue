<script setup lang="ts">
import {
  getPipelineActionSections,
  type PipelineBoardActionId,
} from "./model";
import { useI18n } from "vue-i18n";

const emit = defineEmits<{
  action: [actionId: PipelineBoardActionId];
}>();

const { open, pending } = defineProps<{
  open: boolean;
  pending?: boolean;
}>();
const { t } = useI18n();
const actionSections = computed(() => getPipelineActionSections(t));

const activeActionId = ref<PipelineBoardActionId | null>(null);

function handleDragEnter(actionId: PipelineBoardActionId, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  activeActionId.value = actionId;
}

function handleDragOver(actionId: PipelineBoardActionId, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
  activeActionId.value = actionId;
}

function handleDragLeave(actionId: PipelineBoardActionId, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();

  const relatedTarget = event.relatedTarget as Node | null;
  const currentTarget = event.currentTarget as Node | null;
  if (relatedTarget && currentTarget?.contains(relatedTarget)) return;

  if (activeActionId.value === actionId) {
    activeActionId.value = null;
  }
}

function handleDrop(actionId: PipelineBoardActionId, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  activeActionId.value = null;
  emit("action", actionId);
}
</script>

<template>
  <Transition name="pipeline-bar">
    <aside v-if="open" class="pipeline-bar">
      <div class="pipeline-bar__sections">
        <section
          v-for="section in actionSections"
          :key="section.id"
          class="pipeline-bar__section"
        >
          <header class="pipeline-bar__section-header">
            <strong>{{ section.title }}</strong>
            <span>{{ section.description }}</span>
          </header>

          <div class="pipeline-bar__actions">
            <div
              v-for="action in section.actions"
              :key="action.id"
              class="pipeline-bar__action"
              :class="[
                `pipeline-bar__action--${action.tone}`,
                {
                  'pipeline-bar__action--active': activeActionId === action.id,
                  'pipeline-bar__action--pending': pending,
                },
              ]"
              @dragenter="handleDragEnter(action.id, $event)"
              @dragover="handleDragOver(action.id, $event)"
              @dragleave="handleDragLeave(action.id, $event)"
              @drop="handleDrop(action.id, $event)"
            >
              {{ action.label }}
            </div>
          </div>
        </section>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.pipeline-bar {
  position: sticky;
  bottom: 16px;
  z-index: 20;
  display: grid;
  gap: 14px;
  margin-top: 18px;
  padding: 16px;
  border-radius: 24px;
  background: rgba(31, 32, 36, 0.92);
  color: var(--color-white);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
}

.pipeline-bar__sections {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
}

.pipeline-bar__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pipeline-bar__section-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pipeline-bar__section-header strong {
  font-size: 13px;
}

.pipeline-bar__section-header span {
  font-size: 11px;
  opacity: 0.7;
}

.pipeline-bar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pipeline-bar__action {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-weight: 700;
  transition: transform 150ms ease, background-color 150ms ease, border-color 150ms ease;
}

.pipeline-bar__action--active {
  transform: translateY(-1px);
}

.pipeline-bar__action--danger.pipeline-bar__action--active {
  background: rgba(255, 97, 109, 0.24);
  border-color: rgba(255, 97, 109, 0.72);
}

.pipeline-bar__action--warning.pipeline-bar__action--active,
.pipeline-bar__action--default.pipeline-bar__action--active,
.pipeline-bar__action--success.pipeline-bar__action--active {
  background: rgba(0, 111, 253, 0.24);
  border-color: rgba(0, 111, 253, 0.72);
}

.pipeline-bar__action--pending {
  opacity: 0.6;
}

.pipeline-bar-enter-active,
.pipeline-bar-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.pipeline-bar-enter-from,
.pipeline-bar-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
