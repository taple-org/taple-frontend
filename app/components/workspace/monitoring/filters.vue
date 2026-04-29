<script setup lang="ts">
import { useWorkspaceMemberOptions } from "~/composables/workspace/useWorkspaceMemberOptions";
import { useI18n } from "vue-i18n";
import { getLocalizedField } from "~/utils/localized";

const emit = defineEmits<{
  apply: [];
  reset: [];
}>();

const search = defineModel<string>("search", { required: true });
const category_code = defineModel<string>("category_code", { required: true });
const responsible_id = defineModel<string>("responsible_id", { required: true });

const workspaceId = inject("workspaceId") as string;
const { t, locale } = useI18n();

const { data: categories } = useAsyncData(
  (nuxtApp) => nuxtApp.$apiClient.api.listAllApiV1CatalogCategoriesGet()
    .then((response) => response.data.result)
    .then((result) => result.map((category) => ({
      value: category.code,
      label: getLocalizedField(category as unknown as LocalizedRecord, "name", locale.value),
    }))),
);
const { options: membersOptions } = useWorkspaceMemberOptions(workspaceId);

const categoriesOptions = computed(() => categories.value ?? []);

const hasFilters = computed(() =>
  search.value || category_code.value || responsible_id.value,
);

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") emit("apply");
};
</script>

<template>
  <div class="filter">
    <div class="filter__row">
      <ui-form-field
        class="filter__search"
        type="text"
        v-model="search"
        icon-left="my-icon-search"
        :placeholder="t('common.searchByNameAddressPhone')"
        @keydown="onKeydown"
      />
      <ui-button variant="primary" icon-left="my-icon-search" @click="emit('apply')">{{ t("common.search") }}</ui-button>
      <ui-button v-if="hasFilters" variant="outline" @click="emit('reset')">{{ t("common.reset") }}</ui-button>
    </div>

    <div class="filter__selectors">
      <ui-form-field
        type="select"
        v-model="category_code"
        :options="categoriesOptions"
        :placeholder="t('common.pointType')"
      />
      <ui-form-field
        type="select"
        v-model="responsible_id"
        :options="membersOptions"
        :placeholder="t('tasks.assignee')"
      />
    </div>
  </div>
</template>

<style scoped>
.filter {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 25px 0 20px;
}

.filter__row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter__search {
  flex: 1 1 280px;
}

.filter__status {
  flex: 1 1 260px;
}

.filter__selectors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter__selectors > * {
  flex: 1 1 180px;
  min-width: 150px;
}
</style>
