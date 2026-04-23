<script setup lang="ts">
import { TenantLeadStage } from "~/api/generated/api";
import { STAGE_OPTIONS, SORT_OPTIONS } from "~/stores/leads.store";
import type { LeadFilters } from "~/stores/leads.store";

const props = defineProps<{
  modelValue: LeadFilters;
  searchQuery: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: LeadFilters];
  "update:searchQuery": [value: string];
  apply: [];
  reset: [];
}>();

const localSearch = ref(props.searchQuery);

// Local filter state - only synced to parent on Apply
const localStage = ref(props.modelValue.stage ?? "");
const localSortBy = ref(props.modelValue.sort_by ?? "");
const localSortDir = ref(props.modelValue.sort_dir ?? "desc");

// Sync from parent when props change (e.g., on reset)
watch(
  () => props.searchQuery,
  (val) => {
    localSearch.value = val;
  },
);

watch(
  () => props.modelValue,
  (val) => {
    localStage.value = val.stage ?? "";
    localSortBy.value = val.sort_by ?? "";
    localSortDir.value = val.sort_dir ?? "desc";
  },
  { deep: true },
);

const hasActiveFilters = computed(
  () =>
    localStage.value !== "" ||
    localSortBy.value !== "" ||
    localSortDir.value !== "desc" ||
    localSearch.value !== "",
);

const stageOptions = [{ value: "", label: "Все этапы" }, ...STAGE_OPTIONS];

const sortByOptions = [{ value: "", label: "По умолчанию" }, ...SORT_OPTIONS];

const sortDirOptions = [
  { value: "desc", label: "По убыванию" },
  { value: "asc", label: "По возрастанию" },
];

const handleApply = () => {
  emit("update:modelValue", {
    stage: localStage.value ? (localStage.value as TenantLeadStage) : null,
    sort_by: localSortBy.value || undefined,
    sort_dir: localSortDir.value as "asc" | "desc",
  });
  emit("update:searchQuery", localSearch.value);
  emit("apply");
};

const handleReset = () => {
  localSearch.value = "";
  emit("update:modelValue", {});
  emit("update:searchQuery", "");
  emit("reset");
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") handleApply();
};
</script>

<template>
  <div class="leads-filter-bar">
    <div class="leads-filter-bar__row">
      <label class="leads-filter-bar__search">
        <Icon name="my-icon-search" mode="svg" :size="16" />
        <input
          v-model="localSearch"
          type="search"
          class="leads-filter-bar__search-input"
          placeholder="Поиск по названию / адресу"
          @keydown="onKeydown"
        />
      </label>

      <ui-button variant="primary" @click="handleApply">Найти</ui-button>

      <ui-button
        v-if="hasActiveFilters || localSearch"
        variant="outline"
        @click="handleReset"
      >
        Сбросить
      </ui-button>
    </div>

    <div class="leads-filter-bar__selectors">
      <ui-fields-select-field
        v-model="localStage"
        :options="stageOptions"
        placeholder="Этап"
      />

      <ui-fields-select-field
        v-model="localSortBy"
        :options="sortByOptions"
        placeholder="Сортировка"
      />

      <ui-fields-select-field
        v-model="localSortDir"
        :options="sortDirOptions"
        placeholder="Направление"
      />
    </div>
  </div>
</template>

<style scoped>
.leads-filter-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leads-filter-bar__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.leads-filter-bar__search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 16px;
  border-radius: 24px;
  background: var(--color-neutral-ll);
  color: var(--color-neutral-dd);
  min-width: 0;
}

.leads-filter-bar__search-input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  color: var(--color-neutral-dd);
  font-family: var(--font-base), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  min-width: 0;
}

.leads-filter-bar__search-input::placeholder {
  color: var(--color-neutral-dl);
}

.leads-filter-bar__selectors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.leads-filter-bar__selectors :deep(.select__trigger) {
  height: 36px;
  padding: 0 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 700px) {
  .leads-filter-bar__row {
    flex-wrap: wrap;
  }

  .leads-filter-bar__selectors {
    gap: 6px;
  }
}
</style>
