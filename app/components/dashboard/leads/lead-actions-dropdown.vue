<script setup lang="ts">
import type {
  TenantLeadListItem,
  TenantMemberBrief,
} from "~/api/generated/api";
import { TenantLeadStage } from "~/api/generated/api";
import { STAGE_LABELS, STAGE_OPTIONS } from "~/stores/leads.store";

const props = defineProps<{
  lead: TenantLeadListItem;
  members: TenantMemberBrief[];
}>();

const emit = defineEmits<{
  takeToWork: [];
  snooze: [until: string];
  hide: [];
  assign: [memberId: string];
  delete: [];
}>();

const isOpen = ref(false);
const subMenu = ref<"snooze" | "assign" | null>(null);
const snoozeDate = ref("");
const dropdownRef = ref<HTMLElement | null>(null);

const handleTakeToWork = () => {
  emit("takeToWork");
  closeAll();
};

const handleSnooze = () => {
  if (!snoozeDate.value) return;
  emit("snooze", new Date(snoozeDate.value).toISOString().slice(0, 19));
  snoozeDate.value = "";
  closeAll();
};

const handleAssign = (memberId: string) => {
  emit("assign", memberId);
  closeAll();
};

const handleHide = () => {
  emit("hide");
  closeAll();
};

const handleDelete = () => {
  emit("delete");
  closeAll();
};

const closeAll = () => {
  isOpen.value = false;
  subMenu.value = null;
};

// Close on outside click
onMounted(() => {
  document.addEventListener("click", onOutsideClick);
});
onUnmounted(() => {
  document.removeEventListener("click", onOutsideClick);
});

const onOutsideClick = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    closeAll();
  }
};

const snoozePresets = [
  { label: "На 1 день", hours: 24 },
  { label: "На 3 дня", hours: 72 },
  { label: "На неделю", hours: 168 },
];

const handleSnoozePreset = (hours: number) => {
  const until = new Date(Date.now() + hours * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19);
  emit("snooze", until);
  closeAll();
};
</script>

<template>
  <div ref="dropdownRef" class="lead-actions">
    <button
      class="lead-actions__trigger"
      :class="{ 'lead-actions__trigger--active': isOpen }"
      @click.stop="
        isOpen = !isOpen;
        subMenu = null;
      "
    >
      <span class="lead-actions__dot" />
      <span class="lead-actions__dot" />
      <span class="lead-actions__dot" />
    </button>

    <div v-if="isOpen" class="lead-actions__dropdown">
      <!-- Main menu -->
      <template v-if="!subMenu">
        <button class="lead-actions__item" @click="handleTakeToWork">
          Взять в работу
        </button>
        <button class="lead-actions__item" @click="subMenu = 'snooze'">
          Отложить
        </button>
        <button class="lead-actions__item" @click="subMenu = 'assign'">
          Назначить
          <Icon name="my-icon-arrow-right" mode="svg" :size="10" />
        </button>
        <button class="lead-actions__item" @click="handleHide">Скрыть</button>
        <div class="lead-actions__divider" />
        <button
          class="lead-actions__item lead-actions__item--danger"
          @click="handleDelete"
        >
          Удалить
        </button>
      </template>

      <!-- Snooze submenu -->
      <template v-else-if="subMenu === 'snooze'">
        <button class="lead-actions__back" @click="subMenu = null">
          <Icon name="my-icon-arrow-left" mode="svg" :size="10" />
          Отложить
        </button>
        <div class="lead-actions__divider" />
        <button
          v-for="preset in snoozePresets"
          :key="preset.hours"
          class="lead-actions__item"
          @click="handleSnoozePreset(preset.hours)"
        >
          {{ preset.label }}
        </button>
        <div class="lead-actions__divider" />
        <div class="lead-actions__comment-block">
          <UiDatePicker v-model="snoozeDate" placeholder="Выберите дату" />
          <button
            class="lead-actions__confirm-btn"
            :disabled="!snoozeDate"
            @click="handleSnooze"
          >
            Отложить
          </button>
        </div>
      </template>

      <!-- Assign submenu -->
      <template v-else-if="subMenu === 'assign'">
        <button class="lead-actions__back" @click="subMenu = null">
          <Icon name="my-icon-arrow-left" mode="svg" :size="10" />
          Назначить
        </button>
        <div class="lead-actions__divider" />
        <div v-if="members.length === 0" class="lead-actions__empty">
          Нет доступных участников
        </div>
        <button
          v-for="member in members"
          :key="member.id"
          class="lead-actions__item"
          @click="handleAssign(member.id)"
        >
          {{ member.user_full_name ?? member.user_email }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.lead-actions {
  position: relative;
  display: inline-flex;
}

.lead-actions__trigger {
  display: flex;
  flex-direction: column;
  gap: 2.5px;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.lead-actions__trigger:hover,
.lead-actions__trigger--active {
  background: var(--color-neutral-ld);
}

.lead-actions__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-neutral-dm);
}

.lead-actions__dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: 50;
  min-width: 180px;
  background: #fff;
  border: 1px solid var(--color-neutral-ld);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  padding: 4px 0;
}

.lead-actions__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: transparent;
  text-align: left;
  font-family: var(--font-base), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-neutral-dd);
  cursor: pointer;
  transition: background 0.1s;
}

.lead-actions__item:hover {
  background: var(--color-neutral-ll);
}

.lead-actions__item--danger {
  color: var(--color-error, #e74c3c);
}

.lead-actions__back {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: transparent;
  text-align: left;
  font-family: var(--font-base), sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  cursor: pointer;
  transition: background 0.1s;
}

.lead-actions__back:hover {
  background: var(--color-neutral-ll);
}

.lead-actions__divider {
  height: 1px;
  background: var(--color-neutral-ld);
  margin: 4px 0;
}

.lead-actions__comment-block {
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lead-actions__comment-input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--color-neutral-ld);
  border-radius: 8px;
  font-family: var(--font-base), sans-serif;
  font-size: 11px;
  color: var(--color-neutral-dd);
  outline: none;
  box-sizing: border-box;
}

.lead-actions__comment-input:focus {
  border-color: var(--color-primary);
}

.lead-actions__confirm-btn {
  width: 100%;
  height: 30px;
  background: var(--color-primary);
  color: var(--color-secondary, #fff);
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.lead-actions__confirm-btn:disabled {
  background: var(--color-neutral-ld);
  color: var(--color-neutral-dl);
  cursor: not-allowed;
}

.lead-actions__empty {
  padding: 8px 14px;
  font-size: 12px;
  color: var(--color-neutral-dl);
  text-align: center;
}
</style>
