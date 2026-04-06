<script lang="ts" setup>
import { useNamingScope } from '~/composables/workspace/useWorkspaceFormScope';

const { r$ } = useNamingScope();
const { $apiClient } = useNuxtApp();
const { data: cities, error } = useAsyncData(() => $apiClient.api.listAllApiV1CatalogCitiesGet())
const options = computed(() => {
    if(!cities.value?.data) return [];
    return [...cities.value.data.result.map((city) => ({ label: city.name_ru, value: city.id })), { label: "Алматы", value:"oskdmocimsdc" }]
})

console.log(options.value)
</script>
<template>
    <div class="naming-scope">
        <ui-form-field type="text" v-model="r$.$value.name" :error="r$.$errors.name[0]"
            placeholder="Введите название рабочего пространства" class="field" />
        <ui-form-field type="select" v-model="r$.$value.city" :error="r$.$errors.city[0]" 
        :options="options" placeholder="Введите название района" class="field" />
    </div>
</template>
<style scoped>
.naming-scope {
    display: flex;
    gap: 10px;
}

.naming-scope .field {
    flex: 1 0 0;
}
</style>