<script setup lang="ts">
import type { TenantMemberBrief } from "~/api/generated/api";
import { TenantLeadStage } from "~/api/generated/api";
import { getLeadStageOptions } from "~/stores/leads.store";
import type { SelectOption } from "~/components/ui/fields/registry";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  selectedCount: number;
  members: TenantMemberBrief[];
}>();

const emit = defineEmits<{
  bulkMove: [toStage: TenantLeadStage];
  bulkAssign: [memberId: string | null];
  clearSelection: [];
}>();

const showMovePopover = ref(false);
const showAssignPopover = ref(false);
const selectedStage = ref<TenantLeadStage | "">("");
const selectedMemberId = ref<string>("");
const hasSelectedMember = ref(false);

const stageOptions = computed<SelectOption[]>(() =>
  getLeadStageOptions(t).map((s) => ({ value: s.value, label: s.label })),
);

const memberOptions = computed<SelectOption[]>(() => [
  { value: "__UNASSIGN__", label: t("leads.unassigned") },
  ...props.members.map((m) => ({
    value: m.id,
    label: m.user_full_name ?? m.user_email,
  })),
]);

const handleMove = () => {
  if (!selectedStage.value) return;
  emit("bulkMove", selectedStage.value as TenantLeadStage);
  selectedStage.value = "";
  showMovePopover.value = false;
};

const handleAssign = () => {
  const memberId =
    selectedMemberId.value === "__UNASSIGN__" ? null : selectedMemberId.value;
  emit("bulkAssign", memberId);
  selectedMemberId.value = "";
  hasSelectedMember.value = false;
  showAssignPopover.value = false;
};
</script>

<template>
  <div class="bulk-bar">
    <div class="bulk-bar__left">
      <span class="bulk-bar__count"
        >{{ t("leads.selected") }}: {{ selectedCount }}</span
      >

      <button class="bulk-bar__clear" @click="emit('clearSelection')">
        <Icon name="other-icon-close" mode="svg" :size="10" />
        {{ t("leads.clearSelection") }}
      </button>
    </div>

    <div class="bulk-bar__actions">
      <!-- Bulk Move -->
      <ui-popover v-model:open="showMovePopover" placement="top-end">
        <template #trigger>
          <button class="bulk-bar__btn">
            {{ t("leads.move") }}
            <Icon name="my-icon-arrow-down" mode="svg" :size="10" />
          </button>
        </template>
        <div class="bulk-bar__popover-content">
          <ui-fields-select-field
            v-model="selectedStage"
            :options="stageOptions"
            :placeholder="t('leads.selectStage')"
          />
          <ui-button size="sm" :disabled="!selectedStage" @click="handleMove">
            {{ t("common.apply") }}
          </ui-button>
        </div>
      </ui-popover>

      <!-- Bulk Assign -->
      <ui-popover v-model:open="showAssignPopover" placement="top-end">
        <template #trigger>
          <button class="bulk-bar__btn">
            {{ t("leads.assign") }}
            <Icon name="my-icon-arrow-down" mode="svg" :size="10" />
          </button>
        </template>
        <div class="bulk-bar__popover-content">
          <ui-fields-select-field
            v-model="selectedMemberId"
            :options="memberOptions"
            :placeholder="t('leads.selectAssignee')"
            @update:model-value="hasSelectedMember = true"
          />
          <ui-button
            size="sm"
            :disabled="!hasSelectedMember"
            @click="handleAssign"
          >
            {{ t("common.apply") }}
          </ui-button>
        </div>
      </ui-popover>
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

.bulk-bar__popover-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  min-width: 200px;
}
</style>
