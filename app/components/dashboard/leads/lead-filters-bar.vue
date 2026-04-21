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

const localFilters = ref<LeadFilters>({ ...props.modelValue });
const localSearch = ref(props.searchQuery);

watch(
  () => props.modelValue,
  (val) => {
    localFilters.value = { ...val };
  },
  { deep: true },
);

watch(
  () => props.searchQuery,
  (val) => {
    localSearch.value = val;
  },
);

const hasActiveFilters = computed(() =>
  Object.values(localFilters.value).some((v) => v != null && v !== ""),
);

const stageOptions = [
  { value: "", label: "Все этапы" },
  ...STAGE_OPTIONS,
];

const sortByOptions = [
  { value: "", label: "По умолчанию" },
  ...SORT_OPTIONS,
];

const sortDirOptions = [
  { value: "desc", label: "По убыванию" },
  { value: "asc", label: "По возрастанию" },
];

const handleApply = () => {
  emit("update:modelValue", { ...localFilters.value });
  emit("update:searchQuery", localSearch.value);
  emit("apply");
};

const handleReset = () => {
  localFilters.value = {};
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

      <ui-button v-if="hasActiveFilters || localSearch" variant="outline" @click="handleReset">
        Сбросить
      </ui-button>
    </div>

    <div class="leads-filter-bar__selectors">
      <select
        v-model="localFilters.stage"
        class="leads-filter-bar__select"
      >
        <option v-for="opt in stageOptions" :key="opt.value" :value="opt.value || null">
          {{ opt.label }}
        </option>
      </select>

      <select
        v-model="localFilters.sort_by"
        class="leads-filter-bar__select"
      >
        <option v-for="opt in sortByOptions" :key="opt.value" :value="opt.value || undefined">
          {{ opt.label }}
        </option>
      </select>

      <select
        v-model="localFilters.sort_dir"
        class="leads-filter-bar__select"
      >
        <option v-for="opt in sortDirOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
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

.leads-filter-bar__select {
  flex: 1 1 150px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--color-neutral-ld);
  border-radius: 12px;
  background: var(--color-neutral-ll);
  color: var(--color-neutral-dd);
  font-family: var(--font-base), sans-serif;
  font-size: 12px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2371727A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 30px;
}

.leads-filter-bar__select:focus {
  border-color: var(--color-primary);
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
