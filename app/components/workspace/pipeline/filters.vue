<script lang="ts" setup>
const emit = defineEmits<{
  search: [],
  reset: []
}>()

const search = defineModel<string>("search", { required: true });
const category_code = defineModel<string>("category_code", { required: true });
const responsible_id = defineModel<string>("responsible_id", { required: true });

const workspaceId = inject("workspaceId") as string;

const { data: categories } = useAsyncData(
    (nuxtApp) => nuxtApp.$apiClient.api.listAllApiV1CatalogCategoriesGet()
        .then(cs => cs.data.result)
        .then(r => r.map((category) => ({ value: category.code, label: category.name_ru })))
)
const { data: members } = useAsyncData(
    (nuxtApp) => nuxtApp.$apiClient.api.listMembersApiV1TenantsTenantIdMembersGet(workspaceId)
        .then(ms => ms.data.result)
        .then(r => r.map(m => ({ value: m.id, label: m.email! }))),
    { server: false }
)

const categoriesOptions = computed(() => categories.value ?? []);
const membersOptions    = computed(() => members.value    ?? []);
const product = ref<string>("");

const hasFilters = computed(() =>
    search.value || category_code.value || responsible_id.value || product.value
);

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") emit("search");
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
          placeholder="Поиск по названию / адресу / телефону"
          @keydown="onKeydown"
      />
      <ui-button variant="primary" icon-left="my-icon-search" @click="$emit('search')">
        Найти
      </ui-button>
      <ui-button v-if="hasFilters" variant="outline" @click="$emit('reset')">
        Сбросить
      </ui-button>
    </div>

    <div class="filter__selectors">
      <ui-form-field
          type="select"
          v-model="product"
          :options="[{ label: 'Донерка', value: '1234567890' }]"
          placeholder="Продукт"
      />
      <ui-form-field
          type="select"
          v-model="category_code"
          :options="categoriesOptions"
          placeholder="Тип точки"
      />
      <ui-form-field
          type="select"
          v-model="responsible_id"
          :options="membersOptions"
          placeholder="Ответственный"
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
}

.filter__search {
  flex-grow: 1;
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