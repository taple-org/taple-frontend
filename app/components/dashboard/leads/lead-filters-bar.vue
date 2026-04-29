<script setup lang="ts">
import { TenantLeadStage } from "~/api/generated/api";
import { getLeadSortOptions, getLeadStageOptions } from "~/stores/leads.store";
import type { LeadFilters } from "~/stores/leads.store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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

const stageOptions = computed(() => [
  { value: "", label: t("leads.allStages") },
  ...getLeadStageOptions(t),
]);

const sortByOptions = computed(() => [
  { value: "", label: t("leads.defaultSort") },
  ...getLeadSortOptions(t),
]);

const sortDirOptions = computed(() => [
  { value: "desc", label: t("leads.descending") },
  { value: "asc", label: t("leads.ascending") },
]);

const stageModel = computed<string>({
  get: () => localFilters.value.stage ?? "",
  set: (value) => {
    localFilters.value.stage = value ? (value as TenantLeadStage) : null;
  },
});

const sortByModel = computed<string>({
  get: () => localFilters.value.sort_by ?? "",
  set: (value) => {
    if (value) {
      localFilters.value.sort_by = value;
    } else {
      delete localFilters.value.sort_by;
    }
  },
});

const sortDirModel = computed<string>({
  get: () => localFilters.value.sort_dir ?? "desc",
  set: (value) => {
    localFilters.value.sort_dir = value as "asc" | "desc";
  },
});

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
      <ui-form-field
        v-model="localSearch"
        class="leads-filter-bar__search"
        type="text"
        icon-left="my-icon-search"
        :placeholder="t('leads.searchByNameAddress')"
        @keydown="onKeydown"
      />

      <ui-button variant="primary" @click="handleApply">{{
        t("common.search")
      }}</ui-button>

      <ui-button
        v-if="hasActiveFilters || localSearch"
        variant="outline"
        @click="handleReset"
      >
        {{ t("common.reset") }}
      </ui-button>
    </div>

    <div class="leads-filter-bar__selectors">
      <ui-form-field
        type="select"
        v-model="stageModel"
        class="leads-filter-bar__select"
        :options="stageOptions"
      />

      <ui-form-field
        type="select"
        v-model="sortByModel"
        class="leads-filter-bar__select"
        :options="sortByOptions"
      />

      <ui-fields-select-field
        v-model="sortDirModel"
        class="leads-filter-bar__select"
        :options="sortDirOptions"
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
  min-width: 0;
}

.leads-filter-bar__selectors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.leads-filter-bar__select {
  flex: 1 1 150px;
  min-width: 150px;
}

.leads-filter-bar :deep(.field-input) {
  height: 44px;
  padding-top: 0;
  padding-bottom: 0;
}

.leads-filter-bar :deep(.select__trigger) {
  min-height: 36px;
  padding: 8px 12px;
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
