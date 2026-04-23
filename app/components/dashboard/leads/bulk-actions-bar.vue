<script setup lang="ts">
import type { TenantMemberBrief } from "~/api/generated/api";
import { TenantLeadStage } from "~/api/generated/api";
import { STAGE_OPTIONS } from "~/stores/leads.store";

defineProps<{
  selectedCount: number;
  members: TenantMemberBrief[];
}>();

const emit = defineEmits<{
  bulkMove: [toStage: TenantLeadStage];
  bulkAssign: [memberId: string | null];
  clearSelection: [];
}>();

const showMoveSelect = ref(false);
const showAssignSelect = ref(false);
const selectedStage = ref<TenantLeadStage | "">("");
const selectedMemberId = ref<string>("");

const handleMove = () => {
  if (!selectedStage.value) return;
  emit("bulkMove", selectedStage.value as TenantLeadStage);
  selectedStage.value = "";
  showMoveSelect.value = false;
};

const handleAssign = () => {
  emit("bulkAssign", selectedMemberId.value || null);
  selectedMemberId.value = "";
  showAssignSelect.value = false;
};
</script>

<template>
  <div class="bulk-bar">
    <div class="bulk-bar__left">
      <span class="bulk-bar__count">Выбрано: {{ selectedCount }}</span>

      <button class="bulk-bar__clear" @click="emit('clearSelection')">
        <Icon name="other-icon-close" mode="svg" :size="10" />
        Снять выделение
      </button>
    </div>

    <div class="bulk-bar__actions">
      <!-- Bulk Move -->
      <div class="bulk-bar__action-group">
        <button
          class="bulk-bar__btn"
          @click="showMoveSelect = !showMoveSelect; showAssignSelect = false"
        >
          Переместить
          <Icon name="my-icon-arrow-down" mode="svg" :size="10" />
        </button>
        <div v-if="showMoveSelect" class="bulk-bar__select-popup">
          <select v-model="selectedStage" class="bulk-bar__select">
            <option value="">Выберите этап</option>
            <option v-for="s in STAGE_OPTIONS" :key="s.value" :value="s.value">
              {{ s.label }}
            </option>
          </select>
          <button
            class="bulk-bar__confirm-btn"
            :disabled="!selectedStage"
            @click="handleMove"
          >
            Применить
          </button>
        </div>
      </div>

      <!-- Bulk Assign -->
      <div class="bulk-bar__action-group">
        <button
          class="bulk-bar__btn"
          @click="showAssignSelect = !showAssignSelect; showMoveSelect = false"
        >
          Назначить
          <Icon name="my-icon-arrow-down" mode="svg" :size="10" />
        </button>
        <div v-if="showAssignSelect" class="bulk-bar__select-popup">
          <select v-model="selectedMemberId" class="bulk-bar__select">
            <option value="">Без ответственного</option>
            <option v-for="m in members" :key="m.id" :value="m.id">
              {{ m.user_full_name ?? m.user_email }}
            </option>
          </select>
          <button class="bulk-bar__confirm-btn" @click="handleAssign">
            Применить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bulk-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: var(--color-primary);
  border-radius: 12px;
  flex-wrap: wrap;
}

.bulk-bar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bulk-bar__count {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.bulk-bar__clear {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.bulk-bar__clear:hover {
  background: rgba(255, 255, 255, 0.15);
}

.bulk-bar__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bulk-bar__action-group {
  position: relative;
}

.bulk-bar__btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  font-family: var(--font-base), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.bulk-bar__btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.bulk-bar__select-popup {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid var(--color-neutral-ld);
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
  z-index: 50;
}

.bulk-bar__select {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--color-neutral-ld);
  border-radius: 8px;
  font-family: var(--font-base), sans-serif;
  font-size: 12px;
  color: var(--color-neutral-dd);
  outline: none;
}

.bulk-bar__select:focus {
  border-color: var(--color-primary);
}

.bulk-bar__confirm-btn {
  width: 100%;
  height: 32px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.bulk-bar__confirm-btn:disabled {
  background: var(--color-neutral-ld);
  color: var(--color-neutral-dl);
  cursor: not-allowed;
}
</style>
