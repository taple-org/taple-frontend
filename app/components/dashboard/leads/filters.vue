<script setup lang="ts">
import type { FilterOption } from "./types";

type DropdownOption = {
  label: string;
  value: string;
};

const props = defineProps<{
  dropdownOptions: DropdownOption[];
  selectedCity: string | null;
  productFilters: FilterOption[];
  pointTypeFilters: FilterOption[];
  requiredFilters: FilterOption[];
}>();

const emit = defineEmits<{
  "update:selectedCity": [value: string | null];
}>();

const cityModel = computed<string>({
  get: () => props.selectedCity ?? '',
  set: (value) => emit("update:selectedCity", value),
});
</script>

<template>
  <aside class="leads-filters" aria-label="Фильтры лидов">
    <!-- BUG FIX: was `modelValue=""cityModel` — fixed to proper v-model -->
    <ui-fields-select-field
        v-model="cityModel"
        :options="dropdownOptions"
        placeholder="Город"
        :disabled="!dropdownOptions || dropdownOptions.length === 0"
    />

    <section class="leads-filters__block">
      <h2 class="leads-filters__title">Продукты</h2>
      <div class="leads-filters__checkbox-list">
        <ui-fields-checkbox-field
            v-for="item in productFilters"
            :key="item.label"
            v-model="item.checked"
            :label="item.label"
        />
      </div>
    </section>

    <section class="leads-filters__block">
      <h2 class="leads-filters__title">Тип точки</h2>
      <div class="leads-filters__checkbox-list">
        <ui-fields-checkbox-field
            v-for="item in pointTypeFilters"
            :key="item.label"
            v-model="item.checked"
            :label="item.label"
        />
      </div>
      <button class="leads-filters__expand" type="button">Раскрыть</button>
    </section>

    <section class="leads-filters__block">
      <h2 class="leads-filters__title">Обязательные параметры</h2>
      <div class="leads-filters__checkbox-list">
        <ui-fields-checkbox-field
            v-for="item in requiredFilters"
            :key="item.label"
            v-model="item.checked"
            :label="item.label"
        />
      </div>
    </section>
  </aside>
</template>

<style scoped>
.leads-filters {
  width: 246px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.leads-filters__block { display: flex; flex-direction: column; gap: 10px; }
.leads-filters__title { margin: 0; font-size: 12px; font-weight: 700; line-height: 1.2; color: var(--color-black); }
.leads-filters__checkbox-list { display: flex; flex-direction: column; gap: 5px; }
.leads-filters__expand {
  width: fit-content; border: 0; background: transparent; padding: 0;
  color: var(--color-neutral-dl); font-size: 10px; font-weight: 500; cursor: pointer;
}
.leads-filters :deep(.dropdown__trigger) { width: 100%; }
.leads-filters :deep(.dropdown__control) { min-height: 44px; }
.leads-filters :deep(.checkbox) { display: flex; align-items: center; gap: 12px; }
.leads-filters :deep(.checkbox__control) { width: 20px; height: 20px; border-color: var(--color-neutral-ld); }
.leads-filters :deep(.checkbox__label) { color: #71727a; font-size: 12px; font-weight: 500; }

@media (max-width: 980px) {
  .leads-filters { width: 100%; }
}
</style>